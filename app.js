const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
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

app.use("/api/users", userRoutes);

const PORT = 8888;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
