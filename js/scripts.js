const urls = {
  participants: "https://mock-api.driven.com.br/api/v6/uol/participants",
  status: "https://mock-api.driven.com.br/api/v6/uol/status",
  messages: "https://mock-api.driven.com.br/api/v6/uol/messages",
};

let userName;
let lastUpdated;

function registerUser() {
  userName = prompt("Qual o seu lindo nome?");

  axios
    .post(urls.participants, { name: userName })
    .then((response) => {
      console.log("success", response);
    })
    .catch(() => {
      return registerUser();
    });
}

function checkStatus() {
  setInterval(() => {
    axios.post(urls.status, { name: userName });
  }, 5000);
}

function getMessages() {
  axios.get(urls.messages).then((response) => {
    const messages = response.data;

    if (!lastUpdated || messages[messages.length - 1].time > lastUpdated) {
      listMessages(messages);
    }

    lastUpdated = messages[messages.length - 1].time;
  });
}

function listMessages(messages) {
  const messagesEl = document.getElementById("messages");
  let text = "";
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.type === "status") {
      text += `<div class="message status"><span class="time">(${message.time})</span><b>${message.from}</b> ${message.text}</div>`;
    } else if (message.type === "message") {
      text += `<div class="message"><span class="time">(${message.time})</span><b>${message.from}</b> para <b>${message.to}:</b> ${message.text}</div>`;
    } else if (message.type === "private_message" && message.to == userName) {
      text += `<div class="message private"><span class="time">(${message.time})</span><b>${message.from}</b> reservadamente para <b>${message.to}:</b> ${message.text}</div>`;
    }
  }

  messagesEl.innerHTML = text;
  const lastMessage = document.querySelector("#messages").lastElementChild;
  lastMessage.scrollIntoView();
}

function sendMessage() {
  const textInput = document.querySelector('input[name="text"]');
  let sending = false;
  const data = {
    from: userName,
    to: "Todos",
    text: textInput.value,
    type: "message"
  }
  if (!sending) {
    sending = true;
    axios
      .post(urls.messages, data)
      .then((response) => {
        textInput.value = '';
        getMessages();
        sending = false;
      })
      .catch(() => {
        window.location.reload();
      });
  }
}

registerUser();
checkStatus();
getMessages();

setInterval(() => {
  getMessages();
}, 3000);
