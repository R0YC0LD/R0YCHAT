const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let onlineUsers = {};

io.on('connection', (socket) => {
  socket.on('login', (username) => {
    socket.username = username;
    onlineUsers[username] = socket.id;
    io.emit('userList', Object.keys(onlineUsers));
  });

  socket.on('message', ({ to, message }) => {
    const targetSocketId = onlineUsers[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('message', {
        from: socket.username,
        message,
      });
    }
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.username];
    io.emit('userList', Object.keys(onlineUsers));
  });
});

http.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor.');
});
