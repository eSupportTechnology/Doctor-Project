const express = require("express");
const { sendMessage, checkBalance } = require("../middleware/smsGateway");
const router = express.Router();

// Route to send SMS
router.post("/send-sms", async (req, res) => {
    const { apiKey, numberList, message, sourceAddress } = req.body;

    try {
        const result = await sendMessage(apiKey, numberList, message, sourceAddress);
        res.json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to check balance
router.get("/check-balance", async (req, res) => {
    const { apiKey } = req.query;

    try {
        const result = await checkBalance(apiKey);
        res.json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
