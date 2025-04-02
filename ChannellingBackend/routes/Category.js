const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Upload/Categories');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

//================================================================================================== Create category route
router.post('/create', upload.single('image'), async (req, res) => {
    const { eng_name, sin_name } = req.body;
    const image = req.file ? req.file.filename : null; // Get the uploaded image filename

    // Validate the required fields
    if (!eng_name || !sin_name || !image) {
        return res.status(400).send("Please fill in all required data, including the image.");
    }
    
    try{
        // Check if the category already exists
        const existingCategory = await prisma.category.findUnique({
            where: { eng_name }
        });

        if(existingCategory){
            return res.status(400).json({ message: 'Category already exist' });
        }

        await prisma.category.create({
            data: {
                eng_name,
                sin_name,
                image
            },
        });

        res.status(201).json({ message: 'Category created successfully!' });
    } 
    
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Server error while creating category'})
    }
});

//================================================================================================== Get All categories
router.get('/categories', async(req, res) => {
    try{
        const GetCategories = await prisma.category.findMany();

        res.status(200).json(GetCategories);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error while fetching categories' });
    }
});

router.get('/category/:id/doctors', async (req, res) => {
    const { id } = req.params; //  get Category ID 
    const categoryId = parseInt(id, 10); // String to Int convert

    if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }

    try {
        // Doctors filter and select doctor details including name
        const doctors = await prisma.doctors.findMany({
            where: {
                specializationId: categoryId, // Filtering by categoryId (specialization)
            },
            select: {
                id: true, // Doctor ID
                fullName: true, // Doctor Name
                // You can add any other fields needed
            },
        });

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found for this category.' });
        }

        res.status(200).json(doctors); // Returning doctors with their names
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error while fetching doctors' });
    }
});

router.get('/doccategory', async(req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                Doctors: true,
            },
        });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong while fetching categories' });
    }
});

// Get a single category by ID
router.get('/categ/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }, // Find category by ID
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching category' });
    }
});

//================================================================================================== Delete category route
router.delete('/delete/:id', async(req, res) => {
    
    const { id } = req.params;

    try{
        const checkCategory = await prisma.category.findUnique({
            where: { id: parseInt(id) },
        });

        if(!category){
            return res.status(404).json({ message: 'Category is not found' });
        }

        await prisma.category.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Category Deleted Successfully' })
    }

    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting category' });
    }
});

module.exports = router;
