const axios = require("axios");

// Send SMS Function
async function sendMessage(apiKey, numberList, message, sourceAddress) {
    const list = numberList.join(",");
    const pushNotificationUrl = "https://xx/xx";
    const url = `https://e-sms.dialog.lk/api/v1/message-via-url/create/url-campaign?esmsqk=${apiKey}&list=${list}&source_address=${sourceAddress}&message=${encodeURIComponent(message)}&push_notification_url=${encodeURIComponent(pushNotificationUrl)}`;
    
    try {
        const response = await axios.get(url);

        switch (response.data.trim()) {
            case "1": return "Success";
            case "2001": return "Error occurred during campaign creation";
            case "2002": return "Bad request";
            case "2003": return "Empty number list";
            case "2004": return "Empty message body";
            case "2005": return "Invalid number list format";
            case "2006": return "Not eligible to send messages via GET requests";
            case "2007": return "Invalid key";
            case "2008": return "Not enough money in the user's wallet";
            case "2009": return "No valid numbers found after removal of mask blocked numbers";
            case "2010": return "Not eligible to consume packaging";
            case "2011": return "Transactional error";
            default: return `Unknown response: ${response.data}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Check Balance Function
async function checkBalance(apiKey) {
    const url = `https://e-sms.dialog.lk/api/v1/message-via-url/check/balance?esmsqk=${apiKey}`;

    try {
        const response = await axios.get(url);
        const [status, balance] = response.data.split("|");

        switch (status.trim()) {
            case "1": return `Success - Balance: ${balance}`;
            case "2001": return "Error occurred during campaign creation";
            case "2002": return "Bad request";
            case "2006": return "Not eligible to send messages via GET requests";
            case "2007": return "Invalid key";
            default: return "Unknown response or error";
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

module.exports = { sendMessage, checkBalance };
