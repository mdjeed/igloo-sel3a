// الحصول على العناصر
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var span = document.getElementById("closeModal");
var addProductBtn = document.getElementById("addProductBtn");
var productList = document.getElementById("productList");
var sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");

// تحميل المنتجات المحفوظة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadProducts);

// عندما ينقر المستخدم على الدائرة
btn.onclick = function() {
    modal.style.display = "flex"; // إظهار النافذة المنبثقة
}

// عندما ينقر المستخدم على زر الإغلاق
span.onclick = function() {
    modal.style.display = "none"; // إخفاء النافذة المنبثقة
}

// عندما ينقر المستخدم في أي مكان خارج النافذة المنبثقة
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"; // إخفاء النافذة المنبثقة
    }
}

// إضافة منتج جديد
addProductBtn.onclick = function() {
    var productName = document.getElementById("productName").value;
    if (productName) {
        addProduct(productName);
        saveProduct(productName);
        document.getElementById("productName").value = ""; // تفريغ الحقل
        modal.style.display = "none"; // إخفاء النافذة المنبثقة
    }
}

function toggleCheckbox(element) {
    var checkbox = element.querySelector(".product-checkbox");
    checkbox.checked = !checkbox.checked;
}

// إضافة منتج إلى قائمة العرض
function addProduct(name, quantity = 0) {
    var productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.innerHTML = `
        <input type="checkbox" class="product-checkbox">
        <span class="product-name">${name}</span>
        <div class="quantity-control">
            <button class="quantity-btn" onclick="changeQuantity(this, -1)">&#9660;</button>
            <span class="quantity">${quantity}</span>
            <button class="quantity-btn" onclick="changeQuantity(this, 1)">&#9650;</button>
        </div>
    `;

    productItem.onclick = function(event) {
        if (event.target.tagName !== "INPUT" && !event.target.classList.contains("quantity-btn")) {
            var checkbox = this.querySelector(".product-checkbox");
            checkbox.checked = !checkbox.checked;
        }
    };
    productList.appendChild(productItem);
}

// تعديل الكمية
function changeQuantity(button, change) {
    var quantityElement = button.parentNode.querySelector(".quantity");
    var quantity = parseInt(quantityElement.textContent);
    quantity = Math.max(0, quantity + change); // لا تسمح بالعدد السالب
    quantityElement.textContent = quantity;
}

// حفظ المنتج في localStorage
function saveProduct(name) {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    products.push({ name: name, quantity: 0 });
    localStorage.setItem("products", JSON.stringify(products));
}

// تحميل المنتجات المحفوظة من localStorage
function loadProducts() {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach(function(product) {
        addProduct(product.name, product.quantity);
    });
}

// إرسال أسماء المنتجات المختارة عبر واتساب
sendWhatsAppBtn.onclick = function() {
    var selectedProducts = [];
    var checkboxes = document.querySelectorAll(".product-checkbox");
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var productName = checkbox.nextElementSibling.textContent;
            var quantity = checkbox.parentNode.querySelector(".quantity").textContent;
            if (quantity > 0) {
                selectedProducts.push(`${productName} (${quantity})`);
            } else {
                selectedProducts.push(productName);
            }
        }
    });
    if (selectedProducts.length > 0) {
        var message = "السلع الناقصة: " + selectedProducts.join(", ");
        var whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert("يرجى اختيار المنتجات لإرسالها عبر واتساب.");
    }
}