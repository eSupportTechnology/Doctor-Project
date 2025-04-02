const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const db = require('../database/database.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
    try {
        const { scheduleID, nic, mobileNo, title, firstName, lastName, gender, slotNumber, timeSlot, age } = req.body;

        if (!scheduleID || !nic || !mobileNo || !firstName || !lastName || !gender || !slotNumber || !timeSlot || !age) {
            return res.status(404).json({ message: 'Missing details of patient' });
        }

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                AND: [
                    { scheduleID: parseInt(scheduleID) },
                    { nic: nic },
                ]
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'Appointment exists' });
        }

        const doctorFee = await prisma.schedule.findUnique({
            where: {
                id: parseInt(scheduleID),
            }
        });
        const sheet_No = slotNumber;

        const appointment = await prisma.appointment.create({
            data: {
                mobileNo,
                title,
                firstName,
                lastName,
                gender,
                fee: parseFloat(doctorFee.doctor_fee),
                age: parseInt(age),
                nic,
                sheet_No: parseInt(sheet_No),
                timeSlot,
                scheduleID: parseInt(scheduleID),
            }
        });

        if (!appointment) {
            return res.status(400).json({ message: 'Problem in database' });
        }

        const schedule = await prisma.schedule.findUnique({
            where: { id: parseInt(scheduleID) },
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const sheets = JSON.parse(schedule.sheets);
        const slotIndex = sheets.findIndex((sheet) => sheet.slotNumber === parseInt(slotNumber));

        if (slotIndex === -1) {
            return res.status(404).json({ message: 'Slot not found in schedule' });
        }

        if (sheets[slotIndex].status === 'booked') {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        sheets[slotIndex].status = 'booked';

        await prisma.schedule.update({
            where: { id: parseInt(scheduleID) },
            data: {
                sheets: JSON.stringify(sheets),
            },
        });

        res.status(200).json({ message: 'Appointment successfully created and schedule updated' });
    } catch (error) {
        console.error('Error in backend', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/submitRegister', async (req, res) => {
    const { scheduleID, mobileNo, title, firstName, lastName, gender, age, nic, dateOfBirth, email, password, address, username, slotNumber, timeSlot } = req.body;

    if (!scheduleID || !mobileNo || !title || !firstName || !lastName || !gender || !age || !nic || !dateOfBirth || !email || !password || !address || !username || !slotNumber || !timeSlot) {
        return res.status(400).json({ message: 'Please enter all details' });
    }

    try {
        const sheet_No = slotNumber;

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                AND: [
                    { scheduleID: parseInt(scheduleID) },
                    { nic: nic },
                ]
            }
        });

        if (existingAppointment) {
            return res.status(300).json({ message: 'Appointment exists' });
        }

        const appointment = await prisma.appointment.create({
            data: {
                mobileNo,
                title,
                firstName,
                lastName,
                gender,
                age: parseInt(age),
                nic,
                sheet_No: parseInt(sheet_No),
                timeSlot,
                scheduleID: parseInt(scheduleID),
            }
        });

        if (!appointment) {
            return res.status(400).json({ message: 'Problem in database' });
        }

        const schedule = await prisma.schedule.findUnique({
            where: { id: parseInt(scheduleID) },
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const sheets = JSON.parse(schedule.sheets);
        const slotIndex = sheets.findIndex((sheet) => sheet.slotNumber === parseInt(slotNumber));

        if (slotIndex === -1) {
            return res.status(404).json({ message: 'Slot not found in schedule' });
        }

        if (sheets[slotIndex].status === 'booked') {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        sheets[slotIndex].status = 'booked';

        await prisma.schedule.update({
            where: { id: parseInt(scheduleID) },
            data: {
                sheets: JSON.stringify(sheets),
            },
        });

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

        const phone = mobileNo;

        const dob = dateOfBirth;

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                dob: new Date(dob),
                gender,
                phone: phone,
                email,
                address,
                nic,
                username,
                password: hashedPassword,
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

        return res.status(200).json({
            message: 'User registered and appointment created successfully!',
            staff: safeUser,
            token: token, // JWT
        });

        // res.status(200).json({ message: 'Appointment successfully created and schedule updated' });
    } catch (error) {
        console.error('Error in backend', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/*router.get('/appointments/:doctorName', async (req, res) => {
    try {
        const doctorName = req.params.doctorName;

        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    doctor: {
                        fullName: {
                            contains: doctorName.toLowerCase(), // Case insensitive
                        }
                    }
                }
            },
            include: {
                schedule: true
            }
        });

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this doctor' });
        }

        res.status(200).json(appointments);*/


router.get('/appointments/:doctorName', async (req, res) => {
    try {
        const doctorName = req.params.doctorName;
        const appointments = await prisma.appointment.findMany({
            where: {},
            include: {
                schedule: {
                    select: {
                        date: true,
                        doctor: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });

        // JavaScript for case-insensitive filtering
        const filteredAppointments = appointments.filter((appointment) =>
            appointment.schedule.doctor.fullName
                .toLowerCase()
                .includes(doctorName.toLowerCase())
        );

        //not in the appointments retune 404 error
        if (filteredAppointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this doctor' });
        }

        //  appointments return 
        res.status(200).json(filteredAppointments);

    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.put('/appointments/update-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Update the status of the appointment
        const updatedAppointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.delete('/appointments/cancel/:appointmentId', async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId);

        // Find the appointment by ID and delete it
        const appointment = await prisma.appointment.delete({
            where: {
                id: appointmentId,
            },
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/appointments/print/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
            include: {
                schedule: {
                    select: {
                        date: true,
                        doctor: {
                            select: { fullName: true },
                        },
                    },
                },
            },
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const doc = new PDFDocument();
        const filePath = `appointment_${id}.pdf`;

        res.setHeader('Content-Disposition', `attachment; filename="${filePath}"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Appointment Details', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Patient Name: ${appointment.firstName} ${appointment.lastName}`);
        doc.text(`NIC: ${appointment.nic}`);
        doc.text(`Mobile No: ${appointment.mobileNo}`);
        doc.text(`Doctor: ${appointment.schedule.doctor.fullName}`);
        doc.text(`Date: ${appointment.schedule.date}`);
        doc.text(`Time Slot: ${appointment.timeSlot}`);
        doc.text(`Slot Number: ${appointment.sheet_No}`);

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put("/appointments/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, age, gender, mobileNo, nic, timeSlot, status } = req.body;

        // Check if the appointment exists
        const existingAppointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Update the appointment
        const updatedAppointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: {
                firstName,
                lastName,
                age: age ? parseInt(age) : null, // Ensure age is an integer
                gender,
                mobileNo,
                nic,
                timeSlot,
                status,
            },
        });

        res.status(200).json({ message: "Appointment updated successfully", updatedAppointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/doctor', async (req, res) => {
    const doctorID = req.query.doctorID;

    if (!doctorID) {
        return res.status(400).json({ message: "Doctor ID is missing" });
    }

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    doctor_id: parseInt(doctorID),
                },
            },
            include: {
                schedule: true,  // Include related schedule data if needed
            },
        });

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this doctor" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.patch('/appointments/cancel/:id', async (req, res) => {
    const appointmentId = parseInt(req.params.id);
    const deletedAt = new Date(); // Current date and time for soft delete

    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { deleted_at: deletedAt },
        });
        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).send('Error canceling appointment');
    }
});


// API route for restore
router.patch('/appointments/restore/:id', async (req, res) => {
    const appointmentId = parseInt(req.params.id);

    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { deleted_at: null }, // Restore by setting deleted_at to null
        });
        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error restoring appointment:', error);
        res.status(500).send('Error restoring appointment');
    }
});

module.exports = router;