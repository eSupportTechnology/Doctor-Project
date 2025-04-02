const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'amarasingha', 
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Database connected successfully");
        connection.release(); 
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1); // Stop server if DB connection fails
    }
})();

module.exports = db;
