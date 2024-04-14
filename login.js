const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_btn2 = document.querySelector("#sign-in-btn2");
const sign_up_btn2 = document.querySelector("#sign-up-btn2");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");

});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");

});

sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");

});
sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");

});

//--------------hiệu ứng đăng nhập--------------//
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-btn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // Đăng nhập với tài khoản và mật khẩu cố định
    const validUsername = "admin";
    const validPassword = "admin";

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();

        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;

        // Kiểm tra nếu tài khoản hoặc mật khẩu rỗng
        if (enteredUsername.trim() === "" || enteredPassword.trim() === "") {
            // Hiển thị thông báo lỗi nếu người dùng không nhập tài khoản hoặc mật khẩu
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Vui lòng nhập tài khoản và mật khẩu của bạn!',
                confirmButtonText: 'OK'
            });
        } else if (enteredUsername.length < 5 || enteredPassword.length < 5) {
            // Kiểm tra độ dài của tài khoản và mật khẩu
            // Hiển thị thông báo lỗi nếu tài khoản hoặc mật khẩu ngắn hơn 5 ký tự
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Tài khoản và mật khẩu cần ít nhất 5 ký tự!',
                confirmButtonText: 'OK'
            });
        } else if (enteredUsername === validUsername && enteredPassword === validPassword) {
            // Đăng nhập thành công
            Swal.fire({
                icon: 'success',
                title: 'Đăng nhập thành công!',
                showConfirmButton: false,
                timer: 1500 // Đóng thông báo sau 1.5 giây
            });

            // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
            setTimeout(() => {
                window.location.href = "TrangChu.html";
            }, 1500);
        } else {
            // Đăng nhập thất bại
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Tài khoản hoặc mật khẩu không chính xác!',
                confirmButtonText: 'OK'
            });
        }
    });
});





//--------------con mắt mật khẩu---------------//
const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
});

