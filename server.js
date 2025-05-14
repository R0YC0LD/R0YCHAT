const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB bağlantı URI'niz
const mongoURI = 'mongodb+srv://onur2442:onur2442@chatapp.cvshkxd.mongodb.net/?retryWrites=true&w=majority&appName=chatapp';

// MongoDB'ye bağlan
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch((err) => {
    console.log('MongoDB connection error: ', err);
  });

app.get('/', (req, res) => {
  res.send('MongoDB ile Bağlantı Başarıyla Kuruldu!');
});

// WebSocket bağlantısı (Socket.IO)
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
let onlineUsers = [];  // Aktif kullanıcıları tutacak

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Yeni kullanıcı bağlandığında, tüm kullanıcılara listeyi gönder
  socket.on('login', (username) => {
    socket.username = username; // Kullanıcı adını sakla
    onlineUsers.push(username);
    io.emit('userList', onlineUsers);  // Tüm kullanıcılara listeyi gönder
  });

  // Kullanıcı bağlantısını keserse, listeyi güncelle
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user !== socket.username);
    io.emit('userList', onlineUsers);
    console.log('User disconnected');
  });

  // Mesaj gönderme işlemi
  socket.on('message', async ({ to, message }) => {
    // Veritabanına kaydet
    const newMessage = new Message({ from: socket.username, to, message });
    await newMessage.save();

    // Mesajı diğer kullanıcılara ilet
    const recipientSocket = getUserSocketByUsername(to);
    if (recipientSocket) {
      recipientSocket.emit('message', { from: socket.username, message });
    }
  });

  // Kullanıcıdan alınan mesajları veritabanına kaydet
  function getUserSocketByUsername(username) {
    return Object.values(io.sockets.sockets).find(socket => socket.username === username);
  }

  // Kullanıcı bağlandığında sohbet geçmişini gönder
  socket.on('login', (username) => {
    Message.find({ $or: [{ from: username }, { to: username }] })
      .sort({ timestamp: 1 })
      .exec((err, messages) => {
        if (err) console.log(err);
        socket.emit('chatHistory', messages);
      });
  });
});
