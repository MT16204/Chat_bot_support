const fs = require ('fs');
const path = require('path');
const express = require('express');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT;


app.use(express.json());

// Sửa đường dẫn đến thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Các câu trả lời dựa trên ý định (intent)
const responses = {
    Greeting: [
        "Chào bạn! Tôi có thể giúp gì được cho bạn?",
    ],

    Thankyou: [
        "Cảm ơn bạn! Rất vui khi có thể giúp được bạn.",
    ],

    Farewell: [
        "Tạm biệt! Chúc bạn một ngày tốt lành.",
    ],
    Default: [
        "Xin thứ lỗi, tôi không thể xử lý yêu cầu của bạn.",
    ],

    Problem:[
        "Bạn có thể cung cấp thêm cho tôi về vấn đề của bạn được không?",
    ]
};

// Path to input.txt and output.txt files
const inputFilePath = path.join(__dirname, '../data/inputdata/input.txt');
const outputFilePath = path.join(__dirname, '../data/outputdata/output.txt');

// Variable to store issues data from input.txt
let issuesData = {};

// Function to load issues from input.txt
const loadIssuesData = () => {
    try {
        const data = fs.readFileSync(inputFilePath, 'utf8');
        issuesData = JSON.parse(data); // Parse the JSON-like structure
        console.log('Issues data loaded successfully:', issuesData);
    } catch (err) {
        console.error('Error loading issues data:', err);
    }
};

// Call the function to load issues data on server start
loadIssuesData();

// Function to process chatbot logic
const processMessage = (userMessage) => {
    userMessage = userMessage.toLowerCase();
    let intent = "Default";
    let botReply;

    // Check if the message matches an issue
    for (const [issue, responsesArray] of Object.entries(issuesData)) {
        if (userMessage.includes(issue)) {
            intent = "Issues";
            const randomIndex = Math.floor(Math.random() * responsesArray.length);
            botReply = responsesArray[randomIndex];
            return botReply; // Return early when an issue is found
        }
    }

    // Check other intents if no specific issue was found
    if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("xin chào") || userMessage.includes("chào")) {
        intent = "Greeting";
    } else if (userMessage.includes("bye") || userMessage.includes("goodbye") || userMessage.includes("tạm biệt")) {
        intent = "Farewell";
    } else if (userMessage.includes("cảm ơn") || userMessage.includes("thanks") || userMessage.includes("thank you")) {
        intent = "Thankyou";
    } else if (userMessage.includes("vấn đề")) {
        intent = "Problem";
    }

    // Pick a random response from the intent
    const randomIndex = Math.floor(Math.random() * responses[intent].length);
    botReply = responses[intent][randomIndex];
    return botReply;
};

// Handle POST request from frontend
app.post('/chatbot', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    console.log('User Message:', userMessage);

    // Get chatbot reply based on user input
    const botReply = processMessage(userMessage);

    // Write the response to output.txt
    fs.writeFile(outputFilePath, `User: ${userMessage}\nBot: ${botReply}\n\n`, (err) => {
        if (err) {
            console.error('Error writing to output file:', err);
        }
    });

    // Return the response to the frontend
    res.json({ reply: botReply });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
