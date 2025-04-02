const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create', async (req,res) => {
    const { appointmentId, description, price } = req.body;

    if(!appointmentId || !description || !price){
        return res.status(404).json({message: "Please fill all the details!"});
    }

    try {
        await prisma.services.create({
            data : {
                appointmentId,
                description,
                price: parseFloat(price)
            }
        });

        res.status(200).json({message : "Service Created Successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});


router.get('/details', async (req,res) => {
    const appointmentId = req.query.appointmentId;

    if(!appointmentId){
        return res.status(400).json({ message: "Appointment ID is missing" });
    }

    try {
        const services = await prisma.services.findMany({
            where: {
                appointmentId: parseInt(appointmentId),
            }
        })

        if(services.length === 0){
            return res.status(202).json({message: "Services are not available"});
        }

        res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/doctor/services', async (req, res) => {
    const doctorID = req.query.doctorID;

    if (!doctorID) {
        return res.status(400).json({ message: "Doctor ID is missing" });
    }

    try {
        const services = await prisma.services.findMany({
            where: {
                appointment: {
                    schedule: {
                        doctor_id: parseInt(doctorID),
                    },
                },
            },
            include: {
                appointment: {
                    include: {
                        schedule: true,
                    },
                },
            },
        });

        if (services.length === 0) {
            return res.status(404).json({ message: "No services found for this doctor" });
        }

        res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;