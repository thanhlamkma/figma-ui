const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");

// API Setup
// Replace with your own API key
const API_KEY = "Your-API-Key";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const chatHistory = [];
const userData = {
  message: "",
  file: {},
};

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

  // Add user message and file data to chat history
  chatHistory.push({
    role: "user",
    parts: [
      {
        text: userData.message,
      },
      ...(userData.file.data
        ? [
            {
              inline_data: (({ fileName, isImage, ...rest }) => rest)(
                userData.file
              ),
            },
          ]
        : []),
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

    chatHistory.push({
      role: "model",
      parts: [
        {
          text: responseText,
        },
      ],
    });

    console.log(chatHistory);
  } catch (error) {
    console.log(error);
  } finally {
    userData.file = {}; // Clear the file data after response
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage) return;

  // Clear the input field and file data after submission
  promptInput.value = "";
  fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");

  // Store user message in userData object
  userData.message = userMessage;

  // Generate user message HTML with optional file attachment
  const userMsgHTML = `<p class="message-text"></p>${
    userData.file.data
      ? userData.file.isImage
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="${userData.file.fileName}" class="img-attachment" />`
        : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${userData.file.fileName}</p>`
      : ""
  }`;
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

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (e) => {
    fileInput.value = ""; // Clear the file input
    const base64String = e.target.result.split(",")[1];
    fileUploadWrapper.querySelector(".file-preview").src = e.target.result;
    fileUploadWrapper.classList.add(
      "active",
      isImage ? "img-attached" : "file-attached"
    );

    // Store file data in userData object
    userData.file = {
      fileName: file.name,
      data: base64String,
      mime_type: file.type,
      isImage,
    };
  };
});

// Cancel file upload
document.querySelector("#cancel-file-btn").addEventListener("click", () => {
  userData.file = {}; // Clear the file data
  fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");
});

promptForm.addEventListener("submit", handleFormSubmit);
promptForm
  .querySelector("#add-file-btn")
  .addEventListener("click", () => fileInput.click());
