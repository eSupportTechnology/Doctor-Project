const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Admin login route
router.post('/login', upload.none(), async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Phone Number or Email and Password are required.' });
        }

        // Fetch user by email or phone
        const admin = await prisma.admin.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { contactNumber: identifier },
                ],
            },
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials. User not found.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.Password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials. Password mismatch.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: 'admin',
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: admin.id,
                UserName: admin.UserName,
                email: admin.email,
                role: 'Admin'
            },
            token,
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Admin Registration Route
router.post('/register', upload.none(), async (req, res) => {
    try {
        const { UserName, email, contactNumber, password } = req.body;

        if (!UserName || !password || !email || !contactNumber) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        console.log('Checking for duplicate user...');

        const existingAdmin = await prisma.admin.findFirst({
            where: {
                OR: [
                    { email },
                    { UserName },
                ],
            },
        });

        if (existingAdmin) {
            return res.status(400).json({ error: 'User with this email or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                UserName,
                email,
                contactNumber,
                Password: hashedPassword
            },
        });

        // Generate JWT Token
        const token = jwt.sign(
            { id: newAdmin.id, email: newAdmin.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            message: 'Admin registered successfully!',
            user: {
                id: newAdmin.id,
                UserName: newAdmin.UserName,
                email: newAdmin.email,
                contactNumber: newAdmin.contactNumber,
            },
            token,
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again.', details: error.message });
    }
});

// Admin Details Route
router.get('/details', async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                UserName: true,
                email: true,
                contactNumber: true, // Exclude password field
            },
        });
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admin details:', error);
        res.status(500).json({ error: 'Error fetching admin details.', details: error.message });
    }
});

module.exports = router;
