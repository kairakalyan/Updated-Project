// Default product list (used if no localStorage exists yet)
const defaultProducts = [
  { id: 0, image: 'https://m.media-amazon.com/images/I/719RiDAGXtL._SL1500_.jpg', title: 'Smart Watch1', price: 10 },
  { id: 1, image: 'https://m.media-amazon.com/images/I/61JtVmcxb0L._SL1080_.jpg', title: 'Smart Watch2', price: 20 },
  { id: 2, image: 'https://m.media-amazon.com/images/I/61QMdK2FrXL._SL1500_.jpg', title: 'GW 57', price: 30 },
];

// Load products from localStorage or use default
let products = JSON.parse(localStorage.getItem("storeProducts")) || defaultProducts;
localStorage.setItem("storeProducts", JSON.stringify(products));

// Search functionality
document.getElementById('searchBar').addEventListener('keyup', (e) => {
  const searchData = e.target.value.toLowerCase();
  const filtered = products.filter(item => item.title.toLowerCase().includes(searchData));
  displayItems(filtered);
});

// Display products
function displayItems(items) {
  document.getElementById('root').innerHTML = items.map((item) => `
    <div class="col-md-4 mb-4">
      <div class="card shadow-sm">
        <a href="#"><img src="${item.image}" class="card-img-top" alt="${item.title}"></a>
        <div class="card-body text-center">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text fw-bold">₹ ${item.price}.00</p>
          <button class="btn btn-primary" onclick="addToCart(${item.id})">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Cart setup
let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

// Add to cart
function addToCart(id) {
  const selected = products.find(p => p.id === id);
  if (selected) {
    cart.push({ ...selected });
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    displayCart();
  }
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
  displayCart();
}

// Show cart preview
function displayCart() {
  let total = 0;
  document.getElementById("count").innerText = cart.length;

  if (cart.length === 0) {
    document.getElementById('cartItem').innerHTML = "<p class='text-center text-muted'>Your cart is empty</p>";
    document.getElementById("total").innerHTML = "₹ 0.00";
    document.getElementById("checkout")?.remove();
    return;
  }

  document.getElementById("cartItem").innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="d-flex align-items-center border-bottom py-2">
        <img src="${item.image}" class="cart-img me-3" style="width: 50px; height: 50px;">
        <div class="flex-grow-1">
          <p class="mb-0 fw-semibold">${item.title}</p>
          <p class="text-muted mb-0">₹ ${item.price}.00</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  }).join('');

  document.getElementById("total").innerHTML = "₹ " + total + ".00";

  if (!document.getElementById("checkout")) {
    const footer = document.querySelector(".card-footer");
    const checkoutBtn = document.createElement("div");
    checkoutBtn.id = "checkout";
    checkoutBtn.innerHTML = `
      <button class="btn btn-success w-100 mt-3" onclick="checkout()">
        <i class="fa-solid fa-credit-card"></i> Checkout
      </button>
    `;
    footer.appendChild(checkoutBtn);
  }
}

// Go to cart page
function checkout() {
  window.location.href = "cart.html";
}

// Load on page start
window.onload = () => {
  displayItems(products);
  displayCart();
};
