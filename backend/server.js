const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URLs || "*" }
});

connectDB();
app.use(cors());
app.use(express.json());
app.locals.io = io;

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tasks', taskRoutes);


io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    // Join a personal user room for direct notifications
    socket.on('joinUser', (userId) => {
        if (userId) {
            socket.join(userId.toString());
            console.log(`Socket ${socket.id} joined user room ${userId}`);
        }
    });

    socket.on('joinCourse', (courseId) => {
        if (courseId) {
            socket.join(courseId);
            console.log(`Socket ${socket.id} joined course ${courseId}`);
        }
    });

    socket.on('leaveCourse', (courseId) => {
        if (courseId) {
            socket.leave(courseId);
            console.log(`Socket ${socket.id} left course ${courseId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

