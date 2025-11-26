// auth.js

// 1. Chức năng ĐĂNG KÝ
function signup() {
    const user = document.getElementById('signupUser').value;
    const pass = document.getElementById('signupPass').value;
    const confirm = document.getElementById('confirmPass').value;

    if (!user || !pass || !confirm) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    if (pass !== confirm) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
    }

    // Lưu vào LocalStorage (Giả lập Database)
    // Lưu ý: Đây chỉ là demo, thực tế không nên lưu pass chưa mã hóa
    const newUser = { username: user, password: pass };
    localStorage.setItem('foodsaver_user', JSON.stringify(newUser));

    alert("Đăng ký thành công! Hãy đăng nhập.");
    window.location.href = 'dangnhap.html';
}

// 2. Chức năng ĐĂNG NHẬP
function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    // Lấy dữ liệu từ LocalStorage
    const storedUser = JSON.parse(localStorage.getItem('foodsaver_user'));

    if (!storedUser) {
        alert("Tài khoản không tồn tại. Vui lòng đăng ký!");
        return;
    }

    if (user === storedUser.username && pass === storedUser.password) {
        // Lưu trạng thái "Đang đăng nhập"
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', user); // Lưu tên người dùng hiện tại
        
        alert("Đăng nhập thành công!");
        window.location.href = 'index.html'; // Chuyển sang trang chính
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

// 3. Các hàm phụ trợ
function goToLogin() {
    window.location.href = 'dangnhap.html';
}

function goToSignup() {
    window.location.href = 'dangki.html';
}

function togglePassword(inputId, iconSpan) {
    const input = document.getElementById(inputId || 'loginPass'); // Default cho trang login
    const icon = iconSpan ? iconSpan.querySelector('i') : document.getElementById('eye-icon');
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bx-hide", "bx-show");
    } else {
        input.type = "password";
        icon.classList.replace("bx-show", "bx-hide");
    }
}