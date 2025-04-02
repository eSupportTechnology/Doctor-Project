const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();
const db = require('../database/database.js');
const authenticateDoctor = require('../middleware/authenticateDoctor');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Upload/Doctors/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});


const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 10 * 1024 * 1024 },
}).single('profile_image'); 


//========================================================================================== GET all doctors
router.get('/details', async (req, res) => {
    try {
        const doctors = await prisma.doctors.findMany();
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching doctors!' });
    }
});

//========================================================================================== GET all doctors with extra details
router.get('/doctorDetails', async (req, res) => {
    try {
        const query = `
        SELECT
            d.id,
            d.fullName,
            d.email,
            d.experience,
            d.contact_number,
            d.address,
            d.reg_number,
            c.eng_name AS specialization,
            d.gender,
            d.birthday,
            d.profileImage
        FROM doctors d
        LEFT JOIN category c ON d.specializationId = c.id;
        `;

        const [rows] = await db.execute(query);

        const formattedRows = rows.map(row => ({
            ...row,
            birthday: row.birthday ? row.birthday.toISOString().split('T')[0] : null,
        }));

        res.status(200).json(formattedRows);
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ error: 'Failed to fetch doctor details' });
    }
});

//==========================================================================================  GET single doctor by ID
router.get('/doctor/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const doctor = await prisma.doctors.findUnique({
            where: { id: id },
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching doctor' });
    }
});

//======================================================================================= POST register new doctor
router.post('/register', upload, async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            specializationId,
            qualifications,
            experience,
            contact_number,
            address,
            reg_number,
            gender,
            birthday
        } = req.body;

        const profileImage = req.file ? req.file.path : null;
        console.log('Profile image path:', profileImage);
        
        
        if (!fullName || !email || !password || !specializationId || !contact_number || !reg_number) {
            return res.status(400).json({ message: 'Please fill all required fields!' });
        }

        const checkDoctor = await prisma.doctors.findUnique({
            where: { email }
        });

        if (checkDoctor) {
            return res.status(400).json({ message: 'Doctor email address already used' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.doctors.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                qualifications,
                experience: parseInt(experience),
                contact_number,
                address,
                reg_number,
                gender,
                birthday: birthday ? new Date(birthday) : null,
                profileImage,  
                specializationId: parseInt(specializationId)
            },
        });

        res.status(201).json({ message: 'Doctor is created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while registering doctor' });
    }
});


//==========================================================================================  POST login doctor
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const doctor = await prisma.doctors.findUnique({
            where: { email }
        });

        if (!doctor) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, doctor.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: doctor.id,
                email: doctor.email,
                role: 'Doctor'
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...doctorWithoutPassword } = doctor;
        res.json(
            {
                message: 'Login Successful',
                token,
                role: 'Doctor',
                user: doctorWithoutPassword
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while logging in' });
    }
});


//======================================================================================= PUT update doctor by ID
router.put('/update/:id', upload, async (req, res) => {
    const { id } = req.params;
    const {
      fullName,
      email,
      password,
      specializationId,
      qualifications,
      experience,
      contact_number,
      address,
      reg_number,
      gender,
      birthday,
    } = req.body;
  
    const profileImage = req.file ? req.file.path : null;
  
    try {
      const doctor = await prisma.doctors.findUnique({ where: { id: parseInt(id) } });
      console.log(doctor);  

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      
      let updatedPassword;
      if (password) {
        updatedPassword = await bcrypt.hash(password, 10);
      }
  
      const updatedDoctor = await prisma.doctors.update({
        where: { id: parseInt(id) },
        data: {
          fullName,
          email,
          password: updatedPassword || doctor.password,
          specializationId: parseInt(specializationId), 
          qualifications,
          experience: parseInt(experience),
          contact_number,
          address,
          reg_number,
          gender,
          birthday: birthday ? new Date(birthday) : null,
          profileImage,
        },
      });
      
  
      res.status(200).json(updatedDoctor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating doctor' });
    }
  });
  
//==========================================================================================  DELETE doctor
router.delete('/:id', async (req, res) => {
    try {
        await prisma.doctors.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });

        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting doctor' });
    }
});
//==========================================================================================  GET doctor profile details (for authenticated doctor)
router.get('/profile', authenticateDoctor, async (req, res) => {
    try {
      const { id, fullName: name, profileImage, specializationId } = req.user;
      
    
      const doctor = await prisma.doctors.findUnique({
        where: { id },
        select: {
          gender: true,
          birthday: true,
          contact_number: true,
          address: true,
          email: true,
          password: true 
        }
      });
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      
      const specialization = await prisma.category.findUnique({
        where: { id: specializationId },
      });

      const imageUrl = profileImage ? `http://localhost:8081/Upload/Doctors/${profileImage.split('Upload/Doctors/').pop().replace(/\\/g, '/')}` : null;
  
      
      const formattedBirthday = doctor.birthday ? doctor.birthday.toISOString().split('T')[0] : null;
  
    
      res.status(200).json({
        id,
        name,
        profileImage: imageUrl,
        gender: doctor.gender,
        birthday: formattedBirthday, 
        contact_number: doctor.contact_number,
        address: doctor.address,
        email: doctor.email,
        password: '••••••••', 
        specialization: specialization?.eng_name || 'Unknown', 
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });
  
//========================================================================================== PUT doctor details (for authenticated doctor)

router.put('/profile', authenticateDoctor, async (req, res) => {
  try {
    const { id } = req.user;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const { contact_number, address, gender, birthday } = req.body;

    
    if (!contact_number || !address || !gender || !birthday) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedDoctor = await prisma.doctors.update({
      where: {
        id: id,
      },
      data: {
        contact_number,
        address,
        gender,
        birthday: new Date(birthday), 
      },
    });

    res.status(200).json({
      message: 'Doctor profile updated successfully',
      updatedDoctor,
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Error updating doctor profile', error: error.message });
  }
});

//========================================================================================== PATCH doctor privacy setting (for authenticated doctor)

router.patch("/change-password", authenticateDoctor, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password cannot be the same as the current password" });
    }

    const doctor = await prisma.doctors.findUnique({
      where: { id: req.user.id }, 
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.doctors.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

  
module.exports = router;