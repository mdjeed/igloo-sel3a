var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var span = document.getElementById("closeModal");
var addProductBtn = document.getElementById("addProductBtn");
var productList = document.getElementById("productList");
var sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");
var categoryDropdown = document.getElementById("categoryDropdown");
var newCategoryInput = document.getElementById("newCategory");

// تحميل التصنيفات من localStorage أو استخدام التصنيفات المبدئية
var categories = JSON.parse(localStorage.getItem("categories")) || ["سلعة الكونتوار","pate","المتبقي", "اغراض", "مشتقات الحليب", "اغراض البوظة", "ملون", "بيري", "شوكلاتات", "مكسرات"];

// تحميل التصنيفات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    loadCategories();
    loadProducts(); // تحميل المنتجات المحفوظة عند تحميل الصفحة
});

// عرض النافذة المنبثقة
btn.onclick = function() {
    modal.style.display = "flex";
}

// إغلاق النافذة المنبثقة
span.onclick = function() {
    modal.style.display = "none";
}

// إغلاق النافذة المنبثقة عند النقر خارجها
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// إضافة منتج جديد
addProductBtn.onclick = function() {
    var productName = document.getElementById("productName").value;
    var selectedCategory = categoryDropdown.value;
    var newCategory = newCategoryInput.value;

    var category = newCategory ? newCategory : selectedCategory;

    if (productName && category) {
        addProduct(productName, category, 0);
        saveProduct(productName, category, 0); // حفظ المنتج الجديد
        if (newCategory) {
            categories.push(newCategory);
            saveCategories(); // حفظ التصنيفات الجديدة
            loadCategories();
        }
        document.getElementById("productName").value = "";
        newCategoryInput.value = "";
        modal.style.display = "none";
    }
}

// إضافة منتج إلى قائمة العرض تحت التصنيف المناسب
function addProduct(name, category, quantity) {
    var categoryDiv = document.getElementById(category);

    if (!categoryDiv) {
        categoryDiv = document.createElement("div");
        categoryDiv.id = category;
        categoryDiv.className = "category-section";
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        productList.appendChild(categoryDiv);
    }

    var productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.innerHTML = `
        <input type="checkbox" class="product-checkbox">
        <span>${name}</span>
        <div class="quantity-control">
            <button class="quantity-btn" onclick="changeQuantity(this, -1)">&#9660;</button>
            <span class="quantity">${quantity}</span>
            <button class="quantity-btn" onclick="changeQuantity(this, 1)">&#9650;</button>
        </div>
    `;

    productItem.onclick = function(event) {
        if (event.target.tagName !== "INPUT") {
            var checkbox = this.querySelector(".product-checkbox");
            checkbox.checked = !checkbox.checked;
        }
    };

    categoryDiv.appendChild(productItem);
}

// تغيير الكمية
function changeQuantity(button, delta) {
    var quantitySpan = button.parentNode.querySelector(".quantity");
    var quantity = parseInt(quantitySpan.textContent) + delta;
    if (quantity >= 0) {
        quantitySpan.textContent = quantity;
    }
}

// حفظ المنتج في localStorage
function saveProduct(name, category, quantity) {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    products.push({ name: name, category: category, quantity: quantity });
    localStorage.setItem("products", JSON.stringify(products));
}

// حفظ التصنيفات في localStorage
function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

// تحميل التصنيفات من localStorage
function loadCategories() {
    categoryDropdown.innerHTML = "";
    categories.forEach(function(category) {
        var option = document.createElement("option");
        option.text = category;
        option.value = category;
        categoryDropdown.appendChild(option);
    });
}

// تحميل المنتجات من localStorage عند تحميل الصفحة
function loadProducts() {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach(function(product) {
        addProduct(product.name, product.category, product.quantity);
    });
}

function toggleCheckbox(element) {
    var checkbox = element.querySelector(".product-checkbox");
    checkbox.checked = !checkbox.checked;
}

// إرسال أسماء المنتجات المختارة عبر واتساب
sendWhatsAppBtn.onclick = function() {
    var selectedProducts = [];
    var checkboxes = document.querySelectorAll(".product-checkbox");
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var quantity = checkbox.parentNode.querySelector(".quantity").textContent;
            var name = checkbox.nextElementSibling.textContent;
            if (quantity > 0) {
                selectedProducts.push(`${name} (${quantity})`);
            } else {
                selectedProducts.push(`${name}`);
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
