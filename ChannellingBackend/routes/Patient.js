const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/database');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Upload/Patient');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

//-----------------Patient register part
router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dob,
            gender,
            phone,
            email,
            address,
            nic,
            username,
            password,
        } = req.body;

        if (!firstName || !lastName || !dob || !gender || !phone || !email || !address || !nic || !username || !password || !req.file) {
            return res.status(400).json({ error: 'All fields are required, including a profile image.' });
        }

        console.log('Checking for duplicate user...');
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { nic: nic },
                    { username: username },
                ],
            },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email, NIC, or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profileImagePath = req.file ? `/Upload/Patient/${req.file.filename}` : null;

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                dob: new Date(dob),
                gender,
                phone,
                email,
                address,
                nic,
                username,
                password: hashedPassword,
                profileImage: profileImagePath,
            },
        });

        //Add JWT 
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email }, // Payload 
            JWT_SECRET, // secret key
            { expiresIn: '1h' }
        );

        //  new password
        const { password: _, ...safeUser } = newUser;

        return res.status(201).json({
            message: 'User registered successfully!',
            staff: safeUser,
            token: token, // JWT
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



//-----------------Patient login part

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Phone Number හෝ Email සහ Password අවශ්‍යයි.' });
        }

        // Fetch user by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials. User not found.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials. Password mismatch.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: 'user', // Add user role (if needed)
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Respond with user details and token
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token: token, // JWT Token
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



//------------------update patient
router.put('/update/:id', async (req, res) => {
    try {
        const patientId = parseInt(req.params.id, 10); // Convert ID to integer
        const {
            firstName,
            lastName,
            dob,
            gender,
            phone,
            email,
            address,
            nic,
            username,
            password,
        } = req.body;

        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({ error: 'Invalid patient ID.' });
        }

        const existingPatient = await prisma.user.findUnique({
            where: { id: patientId },
        });

        if (!existingPatient) {
            return res.status(404).json({ error: 'Patient not found.' });
        }

        let updatedData = {
            firstName,
            lastName,
            dob: new Date(dob),
            gender,
            phone,
            email,
            address,
            nic,
            username,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const updatedPatient = await prisma.user.update({
            where: { id: patientId },
            data: updatedData,
        });

        res.status(200).json({ message: 'Patient updated successfully!', patient: updatedPatient });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



//---------------------detail display

router.get('/details/:id', async (req, res) => {
    try {
        const patientId = parseInt(req.params.id, 10); // Convert ID to integer

        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({ error: 'Invalid patient ID.' });
        }

        console.log(`Fetching details for patient ID: ${patientId}`);

        // Prisma query to fetch the patient from the database
        const patientDetails = await prisma.user.findUnique({
            where: { id: patientId },
        });

        // If patient not found, return 404
        if (!patientDetails) {
            return res.status(404).json({ error: 'Patient not found.' });
        }

        // Return patient details
        res.status(200).json({ message: 'Patient details retrieved successfully!', patient: patientDetails });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



//------------------------delete patient
router.delete('/delete/:id', async (req, res) => {
    try {
        const patientId = parseInt(req.params.id, 10); // Convert ID to integer

        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({ error: 'Invalid patient ID.' });
        }

        console.log(`Deleting patient with ID: ${patientId}`);

        // Prisma query to delete the patient from the database
        const deletedPatient = await prisma.user.delete({
            where: { id: patientId },
        });

        // If no patient is found and deleted, return 404
        if (!deletedPatient) {
            return res.status(404).json({ error: 'Patient not found.' });
        }

        // Successfully deleted the patient
        res.status(200).json({ message: 'Patient deleted successfully!', patient: deletedPatient });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


router.post('/generate', async (req, res) => {
    const { patientID, mobileNo } = req.body;

    if (!patientID && !mobileNo) {
        return res.status(400).json({ success: false, message: 'Missing patientID or mobileNo' });
    }

    try {
        let patient;

        if (patientID) {
            patient = await prisma.user.findUnique({
                where: {
                    id: parseInt(patientID),
                },
            });
        } else if (mobileNo) {
            patient = await prisma.user.findUnique({
                where: {
                    nic: mobileNo,
                },
            });
        }

        if (patient) {
            res.json({ success: true, data: patient });
        } else {
            res.json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error fetching patient data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET); // Verify token
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                dob: true,
                email: true,
                phone: true,
                profileImage: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
