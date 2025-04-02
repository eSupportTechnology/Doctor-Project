const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Replace with a strong secret key

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ error: 'Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(bearerToken, SECRET_KEY);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Token is invalid.' });
        }
        req.userId = decoded.id;  // Correct the assignment to req.userId
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid token or expired.' });
    }
};

// Register Staff
router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, address, gender, dob, NIC, Qualification, password } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        if (!firstName || !lastName || !email || !contactNumber || !address || !gender || !dob || !NIC || !Qualification || !password || !profileImage) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingUser = await prisma.staff.findFirst({ where: { OR: [{ email }, { NIC }] } });
        if (existingUser) return res.status(400).json({ error: 'User with this email or NIC already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.staff.create({
            data: { firstName, lastName, email, contactNumber, address, gender, dob: new Date(dob), profileImage, NIC, Qualification, password: hashedPassword },
        });

        res.status(201).json({ message: 'Staff registered successfully!', staff: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Login Staff
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const staff = await prisma.staff.findFirst({ where: { OR: [{ email: identifier }, { contactNumber: identifier }] } });
        if (!staff) return res.status(401).json({ error: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: staff.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get Logged-in Staff Details
router.get('/me', verifyToken, async (req, res) => {
    try {
        const staff = await prisma.staff.findUnique({
            where: { id: req.userId },
            select: { id: true, firstName: true, lastName: true, email: true, contactNumber: true, address: true, gender: true, dob: true, profileImage: true, NIC: true, Qualification: true },
        });

        if (!staff) return res.status(404).json({ error: 'Staff member not found.' });
        res.status(200).json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Delete Staff
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const staffId = parseInt(req.params.id);
        const deletedStaff = await prisma.staff.delete({ where: { id: staffId } });
        res.status(200).json({ message: 'Staff deleted successfully!', staff: deletedStaff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Update staff API
router.put('/update/:id', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        const staffId = parseInt(req.params.id);
        const { firstName, lastName, email, contactNumber, address, gender, dob, NIC, Qualification, password } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        // Validate staff ID
        if (!staffId || isNaN(staffId)) {
            return res.status(400).json({ error: 'Invalid staff ID.' });
        }

        // Check if staff member exists
        const existingStaff = await prisma.staff.findUnique({ where: { id: staffId } });
        if (!existingStaff) {
            return res.status(404).json({ error: 'Staff member not found.' });
        }

        // Prepare updated data
        const updatedData = {
            firstName,
            lastName,
            email,
            contactNumber,
            address,
            gender,
            dob: dob ? new Date(dob) : undefined,
            NIC,
            Qualification,
            profileImage: profileImage || existingStaff.profileImage,
        };

        // Hash password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Perform update using Prisma transaction
        const updatedStaff = await prisma.$transaction(async (prisma) => {
            return await prisma.staff.update({
                where: { id: staffId },
                data: updatedData,
            });
        });

        // Respond with success
        res.status(200).json({ message: 'Staff updated successfully!', staff: updatedStaff });
    } catch (error) {
        console.error(error);

        // Handle known MySQL lock timeout error
        if (error.code === 'P2025') {
            return res.status(500).json({ error: 'Staff member not found or already updated.' });
        }
        if (error.message.includes('Lock wait timeout exceeded')) {
            return res.status(500).json({
                error: 'Database timeout occurred. Please try again.',
                details: error.message,
            });
        }

        res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
});

//---------------------detail display
router.get('/details', async (req, res) => {
    try {
      const staffData = await prisma.staff.findMany();
      res.status(200).json(staffData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching staff details.' });
      console.error('Error fetching staff details:', error);
    }
});

// update Password
router.put('/updatePassword', verifyToken, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Validate input fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required.' });
      }

      const staffId = req.userId; // Ensure it's req.userId set in verifyToken middleware

      // Find the staff member by ID
      const staff = await prisma.staff.findUnique({ where: { id: staffId } });
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found.' });
      }

      // Check if current password is correct
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, staff.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      const updatedStaff = await prisma.staff.update({
        where: { id: staffId },
        data: { password: hashedNewPassword },
      });

      res.status(200).json({ success: true, message: 'Password updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;

