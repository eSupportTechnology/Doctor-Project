const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const db = require('../database/database.js');

const prisma = new PrismaClient();

// ================================================================================================= Add New Schedule
router.post('/add', async (req, res) => {
    const { doctor_id, available_from, available_to, week_day, start_time, end_time, doctor_fee, patients } = req.body;

    if (!doctor_id || !available_from || !available_to || !week_day || !start_time || !end_time || !doctor_fee || !patients) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Save the original availability
        const availability = await prisma.availability.create({
            data: {
                doctor_id: parseInt(doctor_id),
                available_from: new Date(available_from).toISOString(),
                available_to: new Date(available_to).toISOString(),
                week_day,
                start_time,
                end_time,
                doctor_fee,
                patients: parseInt(patients),
            },
        });

        // Generate recurring schedules
        const startDate = new Date(available_from);
        const endDate = new Date(available_to);
        const dayMapping = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };

        const targetDay = dayMapping[week_day];
        let currentDate = new Date(startDate);
        let schedules = [];

        while (currentDate <= endDate) {
            if (currentDate.getDay() === targetDay) {
                // Calculate time slots for the schedule
                const startMinutes = parseInt(start_time.split(':')[0]) * 60 + parseInt(start_time.split(':')[1]);
                const endMinutes = parseInt(end_time.split(':')[0]) * 60 + parseInt(end_time.split(':')[1]);
                const slotDuration = Math.floor((endMinutes - startMinutes) / patients);
                let currentSlotStart = startMinutes;

                const sheets = [];

                for (let i = 1; i <= patients; i++) {
                    const slotStartHours = Math.floor(currentSlotStart / 60);
                    const slotStartMinutes = currentSlotStart % 60;
                    const slotEndMinutes = currentSlotStart + slotDuration;
                    const slotEndHours = Math.floor(slotEndMinutes / 60);
                    const slotEndMinutesRemainder = slotEndMinutes % 60;

                    const formattedStart = `${slotStartHours.toString().padStart(2, '0')}:${slotStartMinutes.toString().padStart(2, '0')}`;
                    const formattedEnd = `${slotEndHours.toString().padStart(2, '0')}:${slotEndMinutesRemainder.toString().padStart(2, '0')}`;

                    sheets.push({
                        slotNumber: i,
                        timeSlot: `${formattedStart} - ${formattedEnd}`,
                        status: 'available',
                    });

                    currentSlotStart += slotDuration;
                }

                schedules.push({
                    doctor_id: parseInt(doctor_id),
                    date: currentDate.toISOString(),
                    start_time,
                    end_time,
                    doctor_fee,
                    patients: parseInt(patients),
                    sheets: JSON.stringify(sheets), // Save sheets as a stringified array
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Save the schedules in bulk
        await prisma.schedule.createMany({ data: schedules });

        res.status(200).json({ message: 'Schedule created successfully.' });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ================================================================================================= Get schedule
router.get('/schedules', async (req, res) => {
    const { doctorId } = req.query;

    try {
        const query = `
            SELECT s.id, s.date, s.start_time, s.end_time, d.id AS doctorId, d.fullName, s.doctor_fee, s.patients
            FROM Schedule s
            JOIN Doctors d ON s.doctor_id = d.id
            WHERE d.id = ?
            ORDER BY s.date ASC
        `;

        const [rows] = await db.execute(query, [doctorId]);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ================================================================================================= Delete Schedule
router.delete('/delete', async (req, res) => {
    try {
        const { scheduleID } = req.query;

        if (!scheduleID) {
            return res.status(400).json({ message: 'Schedule ID is required' });
        }

        const query = `DELETE FROM Schedule WHERE id = ?`;
        const [result] = await db.execute(query, [scheduleID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json({ message: 'Delete schedule is successful!' });
    } catch (error) {
        console.error("Error in deleting from the backend");
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ================================================================================================= Get data using schedule ID
router.get('/scheduleData', async (req, res) => {
    try {
        const scheduleID = req.query.scheduleID;

        if (!scheduleID) {
            return res.status(400).json({ message: 'Schedule ID is required' });
        }

        const query = `SELECT start_time, end_time, date, doctor_fee FROM schedule WHERE id = ?`;
        const rows = await db.execute(query, [scheduleID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Problem in backend:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//================================================================================================== Update Schedules
router.put('/update', async (req, res) => {
    const { start_time, end_time, doctor_fee, scheduleID, patients } = req.body;

    try {
        // Calculate time slots
        const startTime = new Date(`1970-01-01T${start_time}`);
        const endTime = new Date(`1970-01-01T${end_time}`);
        const totalMinutes = (endTime - startTime) / 60000; // Calculate the total minutes
        const timePerPatient = totalMinutes / patients;

        let currentSlotTime = startTime;
        const sheets = [];

        for (let i = 1; i <= patients; i++) {
            const nextSlotTime = new Date(currentSlotTime.getTime() + timePerPatient * 60000);
            sheets.push({
                slotNumber: i,
                timeSlot: `${currentSlotTime.toTimeString().substring(0, 5)} - ${nextSlotTime.toTimeString().substring(0, 5)}`,
                status: 'available', // Default status is "available"
            });
            currentSlotTime = nextSlotTime;
        }

        // Convert sheets array to JSON string
        const sheetsJson = JSON.stringify(sheets);

        // Update query
        const query = `UPDATE schedule
                        SET
                        start_time = ?,
                        end_time = ?,
                        doctor_fee = ?,
                        patients = ?,
                        sheets = ?
                        WHERE id = ?`;

        const [result] = await db.execute(query, [start_time, end_time, doctor_fee, patients, sheetsJson, scheduleID]);

        if (result.affectedRows > 0) {
            res.status(200).send('Schedule updated successfully');
        } else {
            res.status(404).send('Schedule not found!');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server side error' });
        console.error(error);
    }
});

//================================================================================================== Get Sheets Details
router.get('/getSheets', async (req, res) => {
    try {
        const scheduleID = req.query.scheduleID;

        if (!scheduleID) {
            return res.status(400).json({ message: 'Schedule ID is required' });
        }

        const query = `SELECT sheets FROM schedule WHERE id = ?`;
        const rows = await db.execute(query, [scheduleID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Problem in backend:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//================================================================================================== Get Doctor Details using schedule ID
router.get('/doctors', async(req, res) => {
    try {
        const scheduleID = req.query.scheduleID;

        if (!scheduleID) {
            return res.status(400).json({ message: 'Schedule ID is required' });
        }

        const query = `SELECT d.fullName, s.date
                        FROM doctors d
                        LEFT JOIN schedule s
                        ON d.id = s.doctor_id
                        WHERE s.id = ?`;

        const row = await db.execute(query, [scheduleID]);

        if (row.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(row);
    } catch (error) {
        console.error('Error in server side');
        return res.status(500).json("Internal Server Error");
    }
});

module.exports = router;