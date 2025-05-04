## Steps

### Step 1: Starting with HTML & CSS

- Layout
- Base for User and Bot message
- Form input, upload, buttons

### Step 2: Getting into JS

- First retrieving the prompt value
- Create form, input variable
- Function for handling submission

### Step 3: Handling User Message

- Create message element function
- After submitting, let's display user message in the chat list

### Step 4: Managing Bot Response

- Let's show the bot's message right after user's message
- Bot message with loading and "Just a second.." displays

### Step 5: Setting up Free Gemini API

- Make an API request, so wrapping the network request inside try catch block is essential for handling any errors
- Call Gemini API base on key

### Step 6: Adding Typing Animation Effect

- Typing Effect function: Make smooth response
- Scroll to Bottom: It scrolls with each new message

### Step 7: Implementing File Upload Functionality

- First add HTML classes and CSS for demo
- Then remove and add it by using logic in JS
- Handle display file (image, document) after uploading
- Handle cancel file
- Call Gemini API with file upload using base 64 data

### Step 8: Working on Stop Response Button

- Let's only show the "Stop Response" button when the bot is responding
- Stop generate response after clicking stop icon (add event listener)

### Step 9: Working on Delete Chats Button

- Delete chat after clicking delete icon (add event listener)

### Step 10: Adding Theme Toggle Functionality

- Add toggle theme function
- Save theme into localStorage for setting initial theme and keeping current theme after reloading web

### Step 11: Output of Gemini Chatbot
