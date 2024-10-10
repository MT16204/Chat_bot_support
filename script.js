const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn"); 
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector('.chatbot');
const chatToggler = document.querySelector(".chat-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
let chatHistory = []; // Mảng lưu trữ tin nhắn

const API_KEY = "sk-8ALBImoqDCKONc1IGoleXURTlayiFM3Rz-0aDYcV7vT3BlbkFJCBFxU4ZnoS1OIuzJIBCABPq1zsnK73WgaLGjm1h5sA"; 

// Hàm cuộn xuống cuối hộp chat
const scrollToBottom = () => {
    chatbox.scrollTo({
        top: chatbox.scrollHeight,
        behavior: "smooth" // Cuộn mượt
    });
}

// Hàm tạo tin nhắn và phân loại outgoing (người dùng) và incoming (bot)
const createChatLi = (message, className) => {
    const ChatLi = document.createElement("li");
    ChatLi.classList.add("chat", className);
    const Chatcontent = className === "outgoing" 
        ? `<p>${message}</p>`  
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    
    ChatLi.innerHTML = Chatcontent; 
    ChatLi.querySelector("p").textContent = message;
    return ChatLi;
}

// Hàm tạo phản hồi từ bot
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent = "Xin lỗi! Dường như đã có một vài sự cố. Vui lòng thử lại sau!";
        })
        .finally(() => {
            // Cuộn xuống cuối khi bot phản hồi
            scrollToBottom();
        });
}

// Hàm xử lý tin nhắn người dùng
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return; // Không gửi nếu không có nội dung
    chatInput.value = ""; // Xóa nội dung trong ô nhập sau khi gửi
    
    // Thêm tin nhắn outgoing vào chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatHistory.push(userMessage); // Lưu tin nhắn vào lịch sử
    scrollToBottom(); // Cuộn xuống cuối khi tin nhắn của người dùng được thêm

    // Giả lập độ trễ khi bot trả lời
    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        scrollToBottom(); // Cuộn xuống cuối khi tin nhắn placeholder được thêm

        // Gửi tin nhắn đến API và nhận phản hồi
        generateResponse(incomingChatLi);
    }, 1000); // Giả lập độ trễ
}

// Các sự kiện khi nhấn nút gửi hoặc bật/tắt chatbot
sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
    // Không khôi phục trạng thái nếu chưa mở trước đó
    if (document.body.classList.contains("show-chatbot") && chatbox.innerHTML === "") {
        // Nếu chatbox trống, chỉ cần hiển thị
        chatHistory.forEach(msg => {
            chatbox.appendChild(createChatLi(msg, "outgoing"));
        });
    }
});
chatBotCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
    // Không xóa nội dung, chỉ cần đóng chatbot
});
