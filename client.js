const socket = io();
let currentUser = '';
let currentChatUser = '';

document.getElementById('loginBtn').onclick = () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) return;
  currentUser = username;
  socket.emit('login', username);

  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('chatContainer').style.display = 'flex';
};

socket.on('userList', (users) => {
  const list = document.getElementById('userList');
  list.innerHTML = '';
  users.forEach((user) => {
    if (user !== currentUser) {
      const li = document.createElement('li');
      li.textContent = user;
      li.onclick = () => {
        currentChatUser = user;
        document.getElementById('chatMessages').innerHTML = `<p>${user} ile sohbet başlatıldı</p>`;
      };
      list.appendChild(li);
    }
  });
});

document.getElementById('sendBtn').onclick = () => {
  const msg = document.getElementById('messageInput').value;
  if (msg && currentChatUser) {
    socket.emit('message', { to: currentChatUser, message: msg });
    addMessage('SEN', msg);
    document.getElementById('messageInput').value = '';
  }
};

socket.on('message', ({ from, message }) => {
  if (from === currentChatUser) {
    addMessage(from, message);
  }
});

function addMessage(sender, msg) {
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = `${sender}: ${msg}`;
  document.getElementById('chatMessages').appendChild(div);
}
const socket = io(); // Socket.io bağlantısı
let currentUser = '';
let currentChatUser = '';
