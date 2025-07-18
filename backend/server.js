const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://chat-app-mern-j2if.vercel.app'],
    credentials: true,
  })
);

app.use(express.json());
connectDB();

app.get('/', (req, res) => {
  res.send('API is Running');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, console.log(`Server Started on Port ${PORT}`.blue.bold));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'https://chat-app-mern-j2if.vercel.app',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log('User connected: ' + userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.off('setup', () => {
    socket.leave(userData._id);
    console.log('User disconnected: ' + userData._id);
  });
});
