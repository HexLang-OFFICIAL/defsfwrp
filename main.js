let pipeline;
let history = "";

async function loadSelectedModel() {
  const selected = document.getElementById('model-select').value;
  logBot(`Loading ${selected}...`);

  try {
    pipeline = await window.transformers.pipeline("text-generation", selected);
    logBot(`Model ${selected} ready. Say something!`);
  } catch (err) {
    console.error("MODEL LOAD ERROR:", err);
    logBot("❌ Failed to load model: " + err.message);
  }
}


function logUser(text) {
  const chatLog = document.getElementById('chat-log');
  chatLog.innerHTML += `<div class="user"><strong>You:</strong> ${text}</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;
}

function logBot(text) {
  const chatLog = document.getElementById('chat-log');
  chatLog.innerHTML += `<div class="bot"><strong>AI:</strong> ${text}</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function chat() {
  const inputBox = document.getElementById('user-input');
  const userText = inputBox.value.trim();
  if (!userText || !pipeline) return;

  inputBox.value = '';
  logUser(userText);

  history += `User: ${userText}\nAI:`;

  try {
    const output = await pipeline(history, {
      max_new_tokens: 60,
      temperature: 0.8,
      top_k: 50,
      do_sample: true
    });

    const generated = output[0].generated_text;
    const newText = generated.substring(history.length).trim().split("\n")[0];
    history += ` ${newText}\n`;

    logBot(newText);
  } catch (err) {
    logBot("Error: " + err.message);
  }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch((err) => console.error('Service Worker failed:', err));
}
