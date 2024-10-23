const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector('.chatbot');
const chatToggler = document.querySelector(".chat-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

// Hàm tạo tin nhắn và phân loại outgoing (người dùng) và incoming (bot)
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Hàm tạo phản hồi từ bot, gửi yêu cầu đến backend
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: userMessage, // Đảm bảo userMessage đã được gán giá trị
        }),
    };

    // Gửi yêu cầu tới backend
    return fetch("http://localhost:3000/chatbot", requestOptions)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            messageElement.textContent = data.reply; // Gán phản hồi của bot
        })
        .catch((error) => {
            console.error('Error:', error);
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

    chatInput.value = "";
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

// Sự kiện khi người dùng nhập tin nhắn và nhấn Enter hoặc nút gửi
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));



