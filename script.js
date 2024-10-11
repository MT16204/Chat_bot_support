const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn"); 
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector('.chatbot');
const chatToggler = document.querySelector(".chat-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyD2A8nai5GsvUvJGMbQf9ZL8ovvX-8FKxs"; 
const inputInitHeight = chatInput.scrollHeight;

// Hàm tạo tin nhắn và phân loại outgoing (người dùng) và incoming (bot)
const createChatLi = (message, className) => {
    const ChatLi = document.createElement("li");
    ChatLi.classList.add("chat", className);
    const Chatcontent = className === "outgoing" 
        ? `<p></p>`  
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    
    ChatLi.innerHTML = Chatcontent; 
    ChatLi.querySelector("p").textContent = message;
    return ChatLi;
}

// Hàm tạo phản hồi từ bot
const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
    };

    return fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.candidates[0].content.parts[0].text;
        })
        .catch((error) => {
            messageElement.textContent = "Xin lỗi! Dường như đã có một vài sự cố. Vui lòng thử lại sau!";
        })
        .finally(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
}

// Hàm xử lý tin nhắn người dùng
const handleChat = () => {
    userMessage = chatInput.value.trim();    
    if (!userMessage) return; 

    chatInput.value = " "; 
    chatInput.style.height = `${inputInitHeight}px`;

    // Thêm tin nhắn outgoing vào chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Giả lập độ trễ khi bot trả lời
    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 500);


}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 1000) {
        e.preventDefault();
        handleChat();
    }
});

// Các sự kiện khi nhấn nút gửi hoặc bật/tắt chatbot
sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));