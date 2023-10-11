const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Define Mongo URI
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/boombox";

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB with error: ${err}`);
});

// Socket.io connection and WebRTC signaling logic
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle 'offer' event
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', data);
  });

  // Handle 'answer' event
  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', data);
  });

  // Handle 'ice-candidate' event
  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🌎 ==> API Server now listening on PORT ${PORT}!`);
});
