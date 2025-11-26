// Ẩn/hiện mật khẩu
function togglePassword(id, element) {
    let input = document.getElementById(id);
    let icon = element.querySelector("i");
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bx-hide", "bx-show");
    } else {
        input.type = "password";
        icon.classList.replace("bx-show", "bx-hide");
    }
}

// Chuyển trang
function goToSignup() {
    window.location.href = "dangki.html";
}
function goToLogin() {
    window.location.href = "dangnhap.html";
}

// Đăng ký tài khoản
function signup() {
    let user = document.getElementById("signupUser").value;
    let pass = document.getElementById("signupPass").value;
    let confirm = document.getElementById("confirmPass").value; 

    if (user === "" || pass === "") {
        alert("Không để trống thông tin!");
        return;
    }
    if (pass !== confirm) {
        alert("Mật khẩu không khớp!");
        return;
    }

    localStorage.setItem("username", user);
    localStorage.setItem("password", pass);

    alert("Đăng ký thành công!");
    goToLogin();
}

// Đăng nhập
function login() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;
    let remember = document.getElementById("rememberMe").checked;

    let savedUser = localStorage.getItem("username");
    let savedPass = localStorage.getItem("password");

    if (user === savedUser && pass === savedPass) { // tạm thời lưu pass/ usname vào biến savedUser, savedPass -> Backend code thêm phần lưu vào mảng/ lưu file text riêng
        alert("Đăng nhập thành công!");
        if (remember) {
            localStorage.setItem("rememberUser", user);
            localStorage.setItem("rememberPass", pass);
        }
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }
}

// Tự động điền tài khoản đã lưu
window.onload = () => {
    if (localStorage.getItem("rememberUser")) {
        document.getElementById("loginUser").value = localStorage.getItem("rememberUser");
        document.getElementById("loginPass").value = localStorage.getItem("rememberPass");
        document.getElementById("rememberMe").checked = true;
    }
}
