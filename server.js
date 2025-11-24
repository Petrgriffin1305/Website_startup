const express = require('express');
const cors = require('cors');
const app = express();

// Middleware để đọc dữ liệu JSON từ client gửi lên
app.use(express.json());
app.use(cors());

// --- GIẢ LẬP DATABASE ---
// Thay vì dùng MongoDB, ta dùng một mảng để lưu user
const users = []; 

// 1. API ĐĂNG KÝ
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate dữ liệu
    if (!username || !password) {
        return res.status(400).json({ message: 'Thiếu username hoặc password' });
    }

    // Kiểm tra xem user đã tồn tại trong mảng chưa
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Lưu user vào mảng
    const newUser = {
        id: users.length + 1,
        username: username,
        password: password // Lưu ý: Thực tế không nên lưu pass thô thế này
    };
    
    users.push(newUser);

    console.log('Database hiện tại:', users); // In ra để bạn dễ theo dõi

    res.json({ message: 'Đăng ký thành công!', user: newUser });
});

// 2. API ĐĂNG NHẬP
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Tìm user trong mảng
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Nếu tìm thấy
        res.json({ 
            message: 'Đăng nhập thành công!', 
            token: 'fake-jwt-token-123456', // Giả lập trả về token
            userInfo: user 
        });
    } else {
        // Không tìm thấy
        res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
});

// 3. API LẤY DANH SÁCH USER (Để test xem dữ liệu đang có gì)
app.get('/users', (req, res) => {
    res.json(users);
});

// Chạy server
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});