Local AI Chatbot UI
A lightweight, local-first chatbot interface built with React that connects directly to a locally running Ollama instance. This allows you to chat with LLMs (like Llama 3 or DeepSeek Coder) without sending your data to the cloud.

This version is specifically tailored for Coders, featuring syntax highlighting for code blocks and a dark theme.

🚀 Features
Local AI: Connects to Ollama running on your machine.

Streaming Responses: AI responses appear in real-time, token-by-token.

Syntax Highlighting: Beautifully formatted code blocks using react-syntax-highlighter.

Markdown Support: Renders rich text, bold, italics, and lists.

Coder-Focused Theme: Dark mode interface inspired by VS Code.

Auto-Scroll: Automatically scrolls to the bottom as the AI types.

📋 Prerequisites
Before running this project, ensure you have the following installed:

Node.js (v16 or higher)

Ollama: Download and install Ollama

An LLM Model: Pull a model suitable for coding (e.g., DeepSeek Coder V2 or Llama 3) via terminal:

Bash
ollama pull deepseek-coder-v2:lite
🛠️ Installation & Setup
Clone or create the project directory:

Bash
npx create-react-app local-ai-chatbot
cd local-ai-chatbot
Install the required dependencies:

Bash
npm install ollama react-markdown react-syntax-highlighter
Replace src/App.js:
Copy the code provided in the "Coder Edition" section and paste it into your src/App.js file.

Run the application:

Bash
npm start
⚙️ Configuration
By default, the application connects to localhost:11434 (Ollama's default port).

To change the model used, edit the handleSubmit function in App.js:

JavaScript
const response = await ollama.chat({
  model: 'deepseek-coder-v2:lite', // Change this to your pulled model name
  messages: [...chatLog, userMessage],
  stream: true,
});
🖥️ Usage
Ensure Ollama is running in the background.

Type your question or coding prompt into the text area.

Press Enter to send (or Shift+Enter for a new line).

The AI will respond in real-time.

📂 Project Structure
Plaintext
src/
├── App.js        # Main application logic and UI
├── index.css     # Global styles
└── index.js      # React entry point
🛑 Troubleshooting
Error: ENOENT: no such file or directory, open '.../package.json': You are in the wrong folder in your terminal. Use cd to navigate into your project folder.

AI Not Responding: Ensure Ollama is running and you have pulled the model (ollama pull <model-name>) specified in App.js.

Slow Responses: Large models require significant RAM and GPU power. Use ...:lite or smaller quantized models if performance is poor.
