const express = require('express'); 
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

// Ensure the Pharmacy folder exists for storing images
const uploadDir = path.join(__dirname, '..', 'Upload', 'Pharmacy');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer to save uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save to 'Upload/Pharmacy' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Admin login route
// router.post('/login', upload.none(), async (req, res) => {
//     try {
//         const { UserName, Password } = req.body;

//         if (!UserName || !Password) {
//             return res.status(400).json({ message: 'Please fill email and the password' });
//         }

//         const admin = await prisma.admin.findUnique({
//             where: { UserName },
//         });

//         if (!admin) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const passwordCheck = await bcrypt.compare(Password, admin.Password);

//         if (!passwordCheck) {
//             return res.status(401).json({ message: 'Password is incorrect!' });
//         }

//         console.log('Successfully logged');
//         return res.status(200).json({ message: 'Logged successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(404).json({ message: 'Admin login fail!' });
//     }
// });

// // Admin register route
// router.post('/register', upload.none(), async (req, res) => {
//     const { UserName, Password } = req.body;

//     if (!UserName || !Password) {
//         return res.status(400).json({ message: 'Please fill email and the password' });
//     }

//     const admin = await prisma.admin.findUnique({
//         where: { UserName },
//     });

//     if (admin) {
//         return res.status(401).json({ message: 'Username already used' });
//     }

//     const hashedPassword = await bcrypt.hash(Password, 10);

//     await prisma.admin.create({
//         data: {
//             UserName,
//             Password: hashedPassword,
//         },
//     });

//     return res.status(200).json({ message: 'Admin registered successfully' });
// });

// Pharmacy product upload route
router.post('/add', upload.array('images', 5), async (req, res) => {
    try {
        const {
            productName,
            description,
            basePrice,
            discountPercentage,
            discountType,
            sku,
            quantity,
            category,
            tags,
        } = req.body;

        // Get file paths from the uploaded images
        const images = req.files.map((file) => `Pharmacy/${file.filename}`);

        const newProduct = await prisma.pharmacy.create({
            data: {
                productName,
                description,
                basePrice: parseFloat(basePrice),
                discountPercentage: parseFloat(discountPercentage),
                discountType,
                sku,
                quantity: parseInt(quantity),
                category,
                tags,
                images,
            },
        });

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Get all pharmacy products route
router.get('/pharmacy', async (req, res) => {
    try {
        const products = await prisma.pharmacy.findMany();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

module.exports = router;

