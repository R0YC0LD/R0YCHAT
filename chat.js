// Kullanıcıların listelenmesi
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

// Kullanıcıdan gelen mesaj
socket.on('message', ({ from, message }) => {
  if (from === currentChatUser) {
    addMessage(from, message);
  }
});

// Sohbet geçmişi yüklendiğinde
socket.on('chatHistory', (messages) => {
  messages.forEach(msg => {
    addMessage(msg.from, msg.message);
  });
});

function addMessage(sender, msg) {
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = `${sender}: ${msg}`;
  document.getElementById('chatMessages').appendChild(div);
}

document.getElementById('sendBtn').onclick = () => {
  const msg = document.getElementById('messageInput').value;
  if (msg && currentChatUser) {
    socket.emit('message', { to: currentChatUser, message: msg });
    addMessage('SEN', msg);
    document.getElementById('messageInput').value = '';
  }
};
