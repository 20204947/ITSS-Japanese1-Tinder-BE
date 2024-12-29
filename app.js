const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./models/message"); // Import model Message

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(express.json());
// Cấu hình CORS
app.use(
    cors({
        origin: "http://localhost:5173", // Địa chỉ frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
        credentials: true, // Cho phép gửi cookie qua cross-origin
    })
);
app.options(
    "*",
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
// Cấu hình session
app.use(
    session({
        secret: "secret-key", // Chuỗi bí mật để mã hóa session
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Đặt true nếu sử dụng HTTPS
    })
);

// Cấu hình Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // URL frontend
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Lắng nghe sự kiện gửi tin nhắn
    socket.on("sendMessage", async (data) => {
        try {
            // Lưu tin nhắn vào cơ sở dữ liệu
            const newMessage = await Message.create({
                matchingID: data.matchingID,
                from: data.from,
                time: data.time,
                context: data.context,
            });

            // Gửi tin nhắn đến phòng theo matchingID
            io.to(data.matchingID).emit("receiveMessage", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // Tham gia vào phòng theo matchingID
    socket.on("joinRoom", (matchingID) => {
        socket.join(matchingID);
        console.log(`User ${socket.id} joined room ${matchingID}`);
    });

    // Rời phòng theo matchingID
    socket.on("leaveRoom", (matchingID) => {
        socket.leave(matchingID);
        console.log(`User ${socket.id} left room ${matchingID}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.use("/api/users", userRoutes);

const PORT = 8888;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});