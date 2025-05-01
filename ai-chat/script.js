const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");

// API Setup
// Replace with your own API key
const API_KEY = "OWN_API_KEY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

const createMsgElement = (content, ...classes) => {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", ...classes);
  msgDiv.innerHTML = content;
  return msgDiv;
};

// Scroll to the bottom of the chat container
const scrollToBottom = () => {
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
};

// Simulate typing effect for bot response
const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = ""; // Clear the text element
  const words = text.split(" ");
  let wordIndex = 0;

  const typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent +=
        (wordIndex === 0 ? "" : " ") + words[wordIndex++];
      botMsgDiv.classList.remove("loading"); // Remove loading class
      scrollToBottom(); // Scroll to the bottom of the chat container
    } else {
      clearInterval(typingInterval); // Stop typing effect
    }
  }, 40);
};

// Make the API call and generate the bot's response
const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");

  // Add user message to chat history
  chatHistory.push({
    role: "user",
    parts: [
      {
        text: userMessage,
      },
    ],
  });

  try {
    // Send the chat history to get a response
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Something went wrong!");
    }

    // Process the response text and display it
    const responseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .trim();

    typingEffect(responseText, textElement, botMsgDiv);
  } catch (error) {
    console.log(error);
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  userMessage = promptInput.value.trim();
  if (!userMessage) return;

  promptInput.value = "";

  // Generate user message HTML and add in the chat container
  const userMsgHTML = '<p class="message-text"></p>';
  const userMsgDiv = createMsgElement(userMsgHTML, "user-message");
  userMsgDiv.querySelector(".message-text").textContent = userMessage;
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();

  setTimeout(() => {
    // Generate bot message HTML and add in the chat container in 600ms
    const botMsgHTML =
      '<img src="gemini.svg" alt="Gemini icon" class="avatar" /><p class="message-text">Just a second..</p>';
    const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 600);
};

promptForm.addEventListener("submit", handleFormSubmit);
