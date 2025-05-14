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
