document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('cart-items')) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'customer') {
    document.getElementById('cart-items').innerHTML = '<p>Please login to view cart.</p>';
    return;
  }

  renderCart();
  document.getElementById('checkout-btn').addEventListener('click', checkout);
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const cartItemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  let total = 0;
  let html = '';

  for (const [id, qty] of Object.entries(cart)) {
    const product = products.find(p => p.id == id);
    if (!product) continue;
    const itemTotal = product.price * qty;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <span>${product.name} x${qty}</span>
        <span>$${itemTotal.toFixed(2)}
          <button onclick="updateQuantity(${id}, ${qty - 1})">-</button>
          <button onclick="updateQuantity(${id}, ${qty + 1})">+</button>
          <button onclick="removeItem(${id})">Remove</button>
        </span>
      </div>
    `;
  }

  if (html === '') {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = 'Total: $0.00';
    return;
  }

  cartItemsEl.innerHTML = html;
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

window.updateQuantity = function(productId, qty) {
  if (qty <= 0) {
    removeItem(productId);
    return;
  }
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  cart[productId] = qty;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
};

window.removeItem = function(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  delete cart[productId];
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
};

function checkout() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const products = JSON.parse(localStorage.getItem('products')) || [];

  if (Object.keys(cart).length === 0) {
    alert('Cart is empty.');
    return;
  }

  // Check stock
  for (const [id, qty] of Object.entries(cart)) {
    const product = products.find(p => p.id == id);
    if (!product || product.stock < qty) {
      alert(`Not enough stock for ${product?.name || 'item'}.`);
      return;
    }
  }

  // Create order
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderItems = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(p => p.id == id);
    return { productId: id, name: p.name, price: p.price, quantity: qty };
  });

  const newOrder = {
    id: Date.now(),
    customerId: currentUser.username,
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'Pending',
    date: new Date().toLocaleString()
  };

  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem('cart');

  // Deduct stock
  products.forEach(p => {
    if (cart[p.id]) {
      p.stock -= cart[p.id];
    }
  });
  localStorage.setItem('products', JSON.stringify(products));

  document.getElementById('cart-message').innerHTML = '<p style="color:green;">Order placed successfully!</p>';
  renderCart();
}