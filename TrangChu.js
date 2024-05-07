//--------------------slider-------------------------//
var swiper = new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});
var swiper2 = new Swiper(".mySwiper2", {
    loop: true,
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});


//---------------------Giỏ Hàng Trang Chủ--------------------//
document.addEventListener("DOMContentLoaded", () => {
    const cartItems = [];
    const cartTableBody = document.querySelector(".cart tbody");
    const cartItemCount = document.querySelector(".cart-icon span");
    const priceTotalElement = document.querySelector(".price-total .sale-price");
    const cartIcon = document.querySelector(".cart-icon");
    const cartSection = document.querySelector(".cart");
    const closeButton = cartSection.querySelector(".fa-times");
    const checkoutButton = cartSection.querySelector("button");

    // Xử lý sự kiện click vào nút "Mua ngay" trên trang chủ
    const buyNowButtonsHomePage = document.querySelectorAll(".hot-product-main-item button");
    buyNowButtonsHomePage.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const productContainer = button.closest(".hot-product-main-item");
            const productImage = productContainer.querySelector("img");
            const productName = productContainer.querySelector("h1").textContent.trim();
            const productPriceText = productContainer.querySelector(".sale-price").textContent;

            const productPrice = parseFloat(productPriceText.replace(/[^\d]/g, ''));

            const product = {
                id: productImage.src,
                name: productName,
                price: productPrice,
                image: productImage.src,
                quantity: 1
            };

            addToCart(product);
            renderCartItems();

            Swal.fire({
                icon: 'success',
                title: 'Thêm vào giỏ hàng thành công!',
                text: `${productName} đã được thêm vào giỏ hàng`,
                showConfirmButton: false,
                timer: 1500
            });
        });
    });

    // Xử lý sự kiện click vào nút "Chốt đơn"
    checkoutButton.addEventListener("click", () => {
        if (cartItems.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Giỏ hàng của bạn đang trống!',
                text: 'Hãy đi tìm sản phẩm để mua.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    toggleCartDisplay();
                }
            });
        } else {
            Swal.fire({
                title: 'Bạn có chắc muốn chốt đơn hàng?',
                text: "Hành động này sẽ chốt đơn hàng của bạn.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chốt đơn hàng',
                cancelButtonText: 'Không, hủy bỏ',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đơn hàng của bạn đã được chốt thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    toggleCartDisplay();
                    cartItems.length = 0;
                    renderCartItems();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Đã hủy bỏ chốt đơn hàng.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });

    // Xử lý sự kiện click vào biểu tượng giỏ hàng
    cartIcon.addEventListener("click", () => {
        toggleCartDisplay();
    });

    // Xử lý sự kiện click vào nút đóng giỏ hàng
    closeButton.addEventListener("click", () => {
        toggleCartDisplay();
    });

    // Hiển thị/ẩn giỏ hàng
    function toggleCartDisplay() {
        cartSection.style.display = (cartSection.style.display === "none" || cartSection.style.display === "") ? "block" : "none";
    }

    // Thêm sản phẩm vào giỏ hàng
    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cartItems.push(product);
        }
    }

    // Hiển thị các sản phẩm trong giỏ hàng
    function renderCartItems() {
        cartTableBody.innerHTML = "";
        cartItems.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td style="display: flex; align-items: center;">
                    <img style="width: 70px;" src="${item.image}" alt="${item.name}">
                    ${item.name}
                </td>
                <td><p class="sale-price">${formatCurrency(item.price)}đ</p></td>
                <td>
                    <input style="width: 50px; outline: none;" type="number" value="${item.quantity}" min="1">
                </td>
                <td style="cursor: pointer;">Xóa</td>
            `;
            cartTableBody.appendChild(row);

            // Xử lý sự kiện xóa sản phẩm
            row.querySelector("td:last-child").addEventListener("click", () => {
                confirmDelete(item);
            });

            // Xử lý sự kiện thay đổi số lượng sản phẩm
            row.querySelector("input").addEventListener("change", event => {
                updateCartItemQuantity(item, event.target.value);
            });
        });

        updateCartSummary();
    }

    // Xác nhận xóa sản phẩm
    function confirmDelete(item) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa sản phẩm này?',
            text: "Hành động này sẽ xóa sản phẩm khỏi giỏ hàng.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy bỏ',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                removeCartItem(item);
            }
        });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    function removeCartItem(itemToRemove) {
        const index = cartItems.findIndex(item => item.id === itemToRemove.id);
        if (index !== -1) {
            cartItems.splice(index, 1); // Xóa sản phẩm khỏi danh sách
            renderCartItems(); // Cập nhật giao diện giỏ hàng sau khi xóa

            // Hiển thị thông báo xóa thành công
            Swal.fire({
                icon: 'success',
                title: 'Đã xóa sản phẩm thành công!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }


    // Cập nhật số lượng sản phẩm trong giỏ hàng
    function updateCartItemQuantity(itemToUpdate, newQuantity) {
        const quantity = parseInt(newQuantity);
        if (quantity > 0) {
            const item = cartItems.find(item => item.id === itemToUpdate.id);
            if (item) {
                item.quantity = quantity;
                renderCartItems();
            }
        }
    }

    // Cập nhật tổng số lượng và tổng tiền
    function updateCartSummary() {
        let totalQuantity = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalQuantity += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        cartItemCount.textContent = totalQuantity;
        priceTotalElement.textContent = formatCurrency(totalPrice);
    }

    // Định dạng số tiền sang định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
});



//----------------------chi tiết sản phẩm----------------//
document.addEventListener("DOMContentLoaded", () => {
    const cartItems = [];
    const cartTableBody = document.querySelector(".cart tbody");
    const cartItemCount = document.querySelector(".cart-icon span");
    const priceTotalElement = document.querySelector(".price-total .sale-price");
    const addCartButton = document.querySelector(".main-btn");
    const quantityInput = document.querySelector(".quantity-input");
    const quantityMinusBtn = document.querySelector(".fa-minus");
    const quantityPlusBtn = document.querySelector(".fa-plus");
    const checkoutButton = document.querySelector(".checkout-button");
    const cartSection = document.querySelector(".cart");
    const cartIcon = document.querySelector(".cart-icon");
    const closeButton = document.querySelector(".fa-times");

    // Xử lý sự kiện click cho nút "Thêm vào giỏ hàng"
    addCartButton.addEventListener("click", () => {
        const productName = "PC Gaming - Sniper I3060 - BL 01"; // Tên sản phẩm
        const productPriceText = document.querySelector(".sale-price").textContent;
        const productPrice = parseFloat(productPriceText.replace(/\D/g, '')); // Lấy giá sản phẩm
        const quantity = parseInt(quantityInput.value); // Lấy số lượng từ input

        const product = {
            id: generateProductId(),
            name: productName,
            price: productPrice,
            image: "hinhanh/product1.jpg",
            quantity: quantity
        };

        if (isProductInCart(product)) {
            // Hiển thị thông báo sản phẩm đã có trong giỏ hàng
            Swal.fire({
                icon: 'warning',
                title: 'Sản phẩm đã có trong giỏ hàng!',
                text: `${productName} đã có trong giỏ hàng. Vui lòng kiểm tra lại.`,
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            addToCart(product); // Thêm sản phẩm vào giỏ hàng

            // Hiển thị thông báo thêm sản phẩm thành công
            Swal.fire({
                icon: 'success',
                title: 'Thêm vào giỏ hàng thành công!',
                text: `${productName} đã được thêm vào giỏ hàng`,
                showConfirmButton: false,
                timer: 1500
            });

            // Hiển thị sản phẩm trong giỏ hàng
            renderCartItem(product);

            updateCartSummary(); // Cập nhật lại tổng số lượng và tổng tiền
        }
    });

    // Đoạn mã xử lý sự kiện click cho nút "Chốt đơn hàng"
    checkoutButton.addEventListener("click", () => {
        if (cartItems.length === 0) {
            // Nếu giỏ hàng trống, hiển thị thông báo
            Swal.fire({
                icon: 'info',
                title: 'Giỏ hàng của bạn đang trống!',
                text: 'Hãy đi tìm sản phẩm để Thanh toán.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Đóng giỏ hàng sau khi hiển thị thông báo
                    toggleCartDisplay();
                }
            });
        } else {
            // Nếu giỏ hàng có sản phẩm, hiển thị bảng xác nhận chốt đơn
            Swal.fire({
                title: 'Bạn có chắc muốn chốt đơn hàng?',
                text: "Hành động này sẽ chốt đơn hàng của bạn.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chốt đơn hàng',
                cancelButtonText: 'Không, hủy bỏ',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Thực hiện chốt đơn hàng thành công
                    Swal.fire({
                        icon: 'success',
                        title: 'Đơn hàng của bạn đã được chốt thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Xác định sản phẩm vừa chốt đơn và xóa khỏi giỏ hàng
                    const lastOrderedProduct = cartItems.pop(); // Lấy sản phẩm cuối cùng trong giỏ hàng
                    renderCartItems(); // Cập nhật lại giao diện giỏ hàng sau khi xóa sản phẩm vừa chốt đơn
                    
                    // Đóng giỏ hàng sau khi chốt đơn
                    toggleCartDisplay(); // Đóng giỏ hàng sau khi hoàn thành chốt đơn
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Hủy bỏ chốt đơn, không làm gì
                    Swal.fire({
                        icon: 'info',
                        title: 'Đã hủy bỏ chốt đơn hàng.',
                        showConfirmButton: false,
                        timer: 1500
                    });

                }
            });
        }
    });


    // Hàm kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    function isProductInCart(product) {
        return cartItems.some(item => item.id === product.id);
    }

     // Hàm thêm sản phẩm vào giỏ hàng
    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cartItems.push(product);
        }
    }
    // Hàm hiển thị sản phẩm trong giỏ hàng
    function renderCartItem(product) {
        const cartItemRow = document.createElement("tr");
        cartItemRow.innerHTML = `
            <td style="display: flex; align-items: center;">
                <img style="width: 70px;" src="${product.image}" alt="${product.name}">
                ${product.name}
            </td>
            <td><p class="sale-price">${formatCurrency(product.price)}</p></td>
            <td><input style="width: 30px;outline: none;" type="number" value="${product.quantity}" min="1"></td>
            <td style="cursor: pointer;">Xóa</td>
        `;
        cartTableBody.appendChild(cartItemRow);

        // Xử lý sự kiện xóa sản phẩm
        cartItemRow.querySelector("td:last-child").addEventListener("click", () => {
            removeCartItem(product);
        });

        // Xử lý sự kiện thay đổi số lượng sản phẩm
        cartItemRow.querySelector("input").addEventListener("change", (event) => {
            const newQuantity = parseInt(event.target.value);
            updateCartItemQuantity(product, newQuantity);
        });
    }

    // Xử lý sự kiện click cho biểu tượng giỏ hàng
    cartIcon.addEventListener("click", () => {
        toggleCartDisplay();
    });

    // Xử lý sự kiện click cho nút đóng giỏ hàng
    closeButton.addEventListener("click", () => {
        toggleCartDisplay();
    });

    // Hàm hiển thị/ẩn giỏ hàng
    function toggleCartDisplay() {
        if (cartSection.style.display === "none" || cartSection.style.display === "") {
            openCart();
        } else {
            closeCart();
        }
    }

// Xóa sản phẩm khỏi giỏ hàng
function removeCartItem(product) {
    // Hiển thị cửa sổ xác nhận xóa sản phẩm
    Swal.fire({
        title: 'Bạn có chắc muốn xóa sản phẩm này?',
        text: "Hành động này sẽ xóa sản phẩm khỏi giỏ hàng.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy bỏ',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Nếu người dùng xác nhận xóa, tiến hành xóa sản phẩm
            const index = cartItems.findIndex(item => item.id === product.id);
            if (index !== -1) {
                cartItems.splice(index, 1);
                renderCartItems(); // Cập nhật giao diện giỏ hàng sau khi xóa
                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa sản phẩm thành công!',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Sau khi xóa thành công, tự động ẩn giỏ hàng
                toggleCartDisplay(); // Gọi hàm để ẩn giỏ hàng
            }
        }
    });
}


    // Cập nhật số lượng sản phẩm trong giỏ hàng
    function updateCartItemQuantity(product, newQuantity) {
        const item = cartItems.find(item => item.id === product.id);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            renderCartItems(); // Cập nhật giao diện giỏ hàng sau khi thay đổi số lượng
        }
    }
    // Hiển thị các sản phẩm trong giỏ hàng
    function renderCartItems() {
        cartTableBody.innerHTML = "";
        cartItems.forEach(item => {
            renderCartItem(item);
        });

        updateCartSummary(); // Cập nhật tổng số lượng và tổng tiền
    }

    // Cập nhật tổng số lượng và tổng tiền
    function updateCartSummary() {
        let totalQuantity = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalQuantity += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        cartItemCount.textContent = totalQuantity;
        priceTotalElement.textContent = formatCurrency(totalPrice);
    }

    // Định dạng số tiền sang định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    // Hàm tạo ID ngẫu nhiên cho sản phẩm
    function generateProductId() {
        return Math.floor(Math.random() * 1000);
    }
});




//-----------------click product image detail---------------//
document.addEventListener("DOMContentLoaded", () => {
    const thumbnailImages = document.querySelectorAll(".product-images-items img");
    const mainImage = document.querySelector(".main-image");

    // Gắn sự kiện click cho từng ảnh nhỏ
    thumbnailImages.forEach(thumbnail => {
        thumbnail.addEventListener("click", () => {
            // Lấy đường dẫn của ảnh nhỏ được click
            const imageUrl = thumbnail.src;

            // Thay đổi đường dẫn của ảnh chính (main-image)
            mainImage.src = imageUrl;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const productImages = document.querySelectorAll(".product-images-items img");
    const mainImage = document.querySelector(".main-image");

    // Lặp qua từng ảnh nhỏ và gắn sự kiện click
    productImages.forEach(image => {
        image.addEventListener("click", () => {
            // Loại bỏ lớp đã chọn từ tất cả các ảnh nhỏ
            productImages.forEach(img => {
                img.classList.remove("selected");
            });

            // Thêm lớp đã chọn cho ảnh được click
            image.classList.add("selected");

            // Thay đổi ảnh lớn bằng ảnh được click
            mainImage.src = image.src;
            mainImage.alt = image.alt;
        });
    });
});


//------------------input + - -----------------------//
document.addEventListener("DOMContentLoaded", () => {
    const minusButton = document.querySelector(".fa-minus");
    const plusButton = document.querySelector(".fa-plus");
    const quantityInput = document.querySelector(".quantity-input");

    // Xử lý sự kiện khi nhấn vào nút trừ
    minusButton.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    // Xử lý sự kiện khi nhấn vào nút cộng
    plusButton.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
});

const cartSection = document.querySelector(".cart");
const cartIcon = document.querySelector(".cart-icon");

cartIcon.addEventListener("click", () => {
    cartSection.classList.toggle("show");
});



//----------------------------- Hiển thị/ẩn giỏ hàng với hiệu ứng fadeIn và fadeOut-----------------//
function toggleCartDisplay() {
    const cartSection = document.querySelector(".cart");
    const isOpen = cartSection.style.display === "block";

    if (!isOpen) {
        cartSection.style.display = "block";
        cartSection.style.animation = "fadeIn 0.5s ease forwards"; // Kích hoạt fadeIn
    } else {
        cartSection.style.animation = "fadeOut 0.5s ease forwards"; // Kích hoạt fadeOut
        setTimeout(() => {
            cartSection.style.display = "none";
        }, 500); // Sau khi hoàn thành hiệu ứng, ẩn giỏ hàng
    }
}


//------------------------hiệu ứng chat------------------//

document.addEventListener("DOMContentLoaded", () => {
    const chatIcon = document.getElementById("openChat");
    const chatBox = document.getElementById("chatBox");
    const closeChatIcon = document.getElementById("closeChat");
    const userMessageInput = document.getElementById("userMessage");
    const chatContent = document.getElementById("chatContent");
    const sendMessageButton = document.getElementById("sendMessage");

    // Hiển thị khung chat khi click vào icon
    chatIcon.addEventListener("click", () => {
        chatBox.style.display = "block";
    });

    // Đóng khung chat khi click vào biểu tượng đóng
    closeChatIcon.addEventListener("click", () => {
        chatBox.style.display = "none";
    });

    // Xử lý sự kiện gửi tin nhắn
    sendMessageButton.addEventListener("click", () => {
        const userMessage = userMessageInput.value.trim();
        if (userMessage !== "") {
            // Hiển thị tin nhắn của người dùng trong khung chat
            const userMessageElement = document.createElement("div");
            userMessageElement.classList.add("chat-message", "user");
            userMessageElement.innerHTML = `<p><strong>Bạn:</strong> ${userMessage}</p>`;
            chatContent.appendChild(userMessageElement);

            // Gửi tin nhắn cho nhân viên và nhận phản hồi
            simulateAgentReply(userMessage);

            // Sau khi gửi tin nhắn, xóa nội dung trong ô nhập tin nhắn
            userMessageInput.value = "";

            // Cuộn xuống cuối khung chat sau khi gửi tin nhắn
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    });

    // Hàm mô phỏng phản hồi từ nhân viên
    function simulateAgentReply(userMessage) {
        // Mô phỏng một phản hồi ngẫu nhiên từ nhân viên
        const responses = [
            "Xin lỗi, tôi cần thêm thông tin về sản phẩm bạn quan tâm.",
            "Bạn có câu hỏi cụ thể về sản phẩm không?",
            "Dạ, sản phẩm ABC có đặc điểm A, B, C. Bạn cần thêm thông tin gì nữa?",
            "Chào bạn! Hãy để tôi giúp bạn với thông tin sản phẩm.",
        ];

        const randomIndex = Math.floor(Math.random() * responses.length);
        const agentMessage = responses[randomIndex];

        // Hiển thị tin nhắn từ nhân viên trong khung chat sau một khoảng thời gian ngẫu nhiên
        setTimeout(() => {
            const agentMessageElement = document.createElement("div");
            agentMessageElement.classList.add("chat-message", "agent");
            agentMessageElement.innerHTML = `<p><strong>Nhân viên:</strong> ${agentMessage}</p>`;
            chatContent.appendChild(agentMessageElement);

            // Cuộn xuống cuối khung chat sau khi nhận phản hồi từ nhân viên
            chatContent.scrollTop = chatContent.scrollHeight;
        }, Math.random() * 2000 + 1000); // Thời gian ngẫu nhiên từ 1 đến 3 giây
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const homeLink = document.getElementById("home-link");

    // Thêm sự kiện click vào tiêu đề "Trang Chủ"
    homeLink.addEventListener("click", () => {
        // Chuyển hướng người dùng về trang chủ của bạn
        window.location.href = "TrangChu.html"; // Thay đổi URL của trang web về trang chủ

        // Thêm lớp CSS để áp dụng màu sắc khi click
        homeLink.classList.add("clicked");

        // Sau khi click, loại bỏ lớp CSS sau một khoảng thời gian để trở về trạng thái ban đầu
        setTimeout(() => {
            homeLink.classList.remove("clicked");
        }, 500); // Thời gian 0.5 giây (500ms) để loại bỏ lớp CSS
    });
});

//--------------------------thông báo-------------------//
document.addEventListener("DOMContentLoaded", function () {
    function showNotification() {
        var notification = document.getElementById("notification");
        notification.style.display = "block"; // Hiển thị phần tử thông báo

        // Đặt lại bottom và right để hiển thị thông báo ở giữa góc bên phải
        notification.style.bottom = "300px";
        notification.style.right = "20px";
    }

    setTimeout(showNotification, 2000);

    window.addEventListener("load", function () {
        setTimeout(showNotification, 2000);
    });
});

function closeNotification() {
    var notification = document.getElementById("notification");
    notification.style.bottom = "-100px"; // Đẩy phần tử thông báo xuống lại vị trí ban đầu (ẩn đi)
}

//----------------------Email---------------------//
function isValidEmail(email) {
    // Kiểm tra định dạng email bằng regular expression
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function subscribeEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        // Hiển thị thông báo lỗi nếu định dạng email không hợp lệ
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng nhập đúng định dạng email!',
        });
        return;
    }

    // Xử lý logic đăng ký email (ở đây là mô phỏng)
    // Thay bằng hàm kiểm tra email đã đăng ký trên server và hiển thị kết quả tương ứng
    const isExistingEmail = checkExistingEmail(email);

    if (isExistingEmail) {
        // Hiển thị thông báo nếu email đã tồn tại
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Email này đã tồn tại!',
        });
    } else {
        // Hiển thị thông báo đăng ký thành công nếu email hợp lệ và chưa tồn tại
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Bạn đã đăng ký nhận tin khuyến mãi thành công!',
        });
    }

    // Reset input sau khi xử lý
    emailInput.value = '';
}

function checkExistingEmail(email) {
    // Hàm kiểm tra email đã tồn tại trên server
    // Ở đây chỉ mô phỏng, bạn cần thay bằng hàm gửi request kiểm tra lên server thực tế
    const existingEmails = ['datngao4107@gmail.com', 'user@example.com']; // Danh sách email đã đăng ký
    return existingEmails.includes(email);
}


//-----------------------------slider------------//

let slideIndex = 0;
const slider = document.querySelector('.slider');
const numVisibleSlides = 4; // Số lượng hình ảnh hiển thị ban đầu
const totalSlides = slider.children.length; // Tổng số hình ảnh trong slider

function moveSlider(direction) {
    slideIndex += direction;

    // Giới hạn slideIndex trong khoảng từ 0 đến (totalSlides - numVisibleSlides)
    slideIndex = Math.min(Math.max(slideIndex, 0), totalSlides - numVisibleSlides);

    const translateValue = -slideIndex * (100 / numVisibleSlides);
    slider.style.transform = `translateX(${translateValue}%)`;
}


