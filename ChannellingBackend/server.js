require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database/database'); //Corrected import

const smsRoutes = require('./routes/Sms');
const patientRoutes = require('./routes/Patient');
const categoryRoutes = require('./routes/Category');
const doctorRoutes = require('./routes/Doctor');
const adminRoutes = require('./routes/Admin');
const staffRoutes = require('./routes/Staff');
const invoiceRoutes = require('./routes/Invoice');
const scheduleRoutes = require('./routes/Schedule');
const appointmentRoutes = require('./routes/Appointment');
const pharmacyRoutes = require('./routes/Pharmacy');
const servicesRoutes = require('./routes/Service');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/schedule', scheduleRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/patient', patientRoutes);
app.use('/admin', adminRoutes);
app.use('/doctors', doctorRoutes);
app.use('/category', categoryRoutes);
app.use('/staff', staffRoutes);
app.use('/pharmacy', pharmacyRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/sms', smsRoutes);
app.use('/service', servicesRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/Upload/Patient', express.static(path.join(__dirname, 'Upload/Patient')))
app.use('/Upload/Categories', express.static(path.join(__dirname, 'Upload/Categories')))
app.use('/Upload/Doctors', express.static('Upload/Doctors'));

app.get('/api/doctor/profile', (req, res) => {
    res.json({ message: 'Doctor profile data' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Admin API. Use /api/admin/login for login.');
});

// Ensure database connection before starting the server
db.getConnection()
    .then(() => {
        app.listen(8081, () => {
            console.log('✅ Server is running on port 8081');
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
    });
