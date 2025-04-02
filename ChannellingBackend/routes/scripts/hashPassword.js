const bcrypt = require('bcryptjs');

const hashPassword = async () => {
    const plainPassword = 'yourAdminPassword'; // Replace with your actual password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Hashed Password:', hashedPassword);
};

hashPassword();
