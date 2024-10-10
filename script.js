const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn"); 
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector('.chatbot');
const chatToggler = document.querySelector(".chat-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");


let userMessage;

const API_KEY = "sk-8ALBImoqDCKONc1IGoleXURTlayiFM3Rz-0aDYcV7vT3BlbkFJCBFxU4ZnoS1OIuzJIBCABPq1zsnK73WgaLGjm1h5sA"; 

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

    fetch("https://api.openai.com/v1/completions", requestOptions)
    .then(res => res.json())
    .then(data => {
        messageElement.textContent = data.choices[0].message.content;
    })
        .catch((error) => {
            messageElement.textContent = "Xin lỗi! Dường như đã có một vài sự cố. Vui lòng thử lại sau!";
            
        }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); 
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return; 
    chatInput.value = "";
    
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    

    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming")
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 1000); 
}

sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));



