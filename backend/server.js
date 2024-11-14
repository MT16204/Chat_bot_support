const fs = require ('fs');
const path = require('path');
const express = require('express');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Đường dẫn đến thư mục frontend
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

// Đường dẫn đến các file input.txt và output.txt
const inputFilePath = path.join(__dirname, '../data/inputdata/input.txt');
const outputFilePath = path.join(__dirname, '../data/outputdata/output.txt');

// Biến lưu trữ dữ liệu vấn đề từ file input.txt
let issuesData = {};

// Hàm để tải dữ liệu vấn đề từ file input.txt
const loadIssuesData = () => {
    try {
        const data = fs.readFileSync(inputFilePath, 'utf8');
        issuesData = JSON.parse(data); // Phân tích cấu trúc JSON
        console.log('Dữ liệu vấn đề đã được tải thành công:', issuesData);
    } catch (err) {
        console.error('Lỗi khi tải dữ liệu vấn đề:', err);
    }
};

// Gọi hàm để tải dữ liệu vấn đề khi khởi động server
loadIssuesData();

// Hàm xử lý logic của chatbot
const processMessage = (userMessage) => {
    userMessage = userMessage.toLowerCase();
    let intent = "Default";
    let botReply;

    // Kiểm tra nếu tin nhắn khớp với một vấn đề
    for (const [issue, responsesArray] of Object.entries(issuesData)) {
        if (userMessage.includes(issue)) {
            intent = "Issues";
            const randomIndex = Math.floor(Math.random() * responsesArray.length);
            botReply = responsesArray[randomIndex];
            return botReply; // Trả lời ngay khi tìm thấy vấn đề
        }
    }

    // Kiểm tra các ý định khác nếu không tìm thấy vấn đề cụ thể
    if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("xin chào") || userMessage.includes("chào")) {
        intent = "Greeting";
    } else if (userMessage.includes("bye") || userMessage.includes("goodbye") || userMessage.includes("tạm biệt")) {
        intent = "Farewell";
    } else if (userMessage.includes("cảm ơn") || userMessage.includes("thanks") || userMessage.includes("thank you")) {
        intent = "Thankyou";
    } else if (userMessage.includes("vấn đề")) {
        intent = "Problem";
    }

    // Chọn một câu trả lời ngẫu nhiên từ ý định
    const randomIndex = Math.floor(Math.random() * responses[intent].length);
    botReply = responses[intent][randomIndex];
    return botReply;
};

// Xử lý yêu cầu POST từ frontend
app.post('/chatbot', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    console.log('Tin nhắn từ người dùng:', userMessage);

    // Nhận phản hồi từ chatbot dựa trên đầu vào của người dùng
    const botReply = processMessage(userMessage);

    // Ghi phản hồi vào file output.txt
    fs.writeFile(outputFilePath, `Người dùng: ${userMessage}\nBot: ${botReply}\n\n`, (err) => {
        if (err) {
            console.error('Lỗi khi ghi vào file output:', err);
        }
    });

    // Trả phản hồi về frontend
    res.json({ reply: botReply });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
