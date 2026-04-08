// Initialize default products if none exist
if (!localStorage.getItem('products')) {
  const defaultProducts = [
    { id: 1, name: 'Rice 1kg', category: 'Groceries', price: 2.50, stock: 100 },
    { id: 2, name: 'Cola 500ml', category: 'Drinks', price: 1.20, stock: 200 },
    { id: 3, name: 'Chips', category: 'Snacks', price: 1.00, stock: 150 }
  ];
  localStorage.setItem('products', JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem('products'));

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('product-list')) return;

  renderProducts(products);

  // Filters
  document.getElementById('apply-filters').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const maxPrice = parseFloat(document.getElementById('price-filter').value) || Infinity;

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) &&
      (category === '' || p.category === category) &&
      p.price <= maxPrice
    );

    renderProducts(filtered);
  });
});

function renderProducts(productList) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  if (productList.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  productList.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>Category: ${p.category}</p>
      <p>Price: $${p.price.toFixed(2)}</p>
      <p>Stock: ${p.stock}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

// Global function for cart.js
window.addToCart = function(productId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'customer') {
    alert('Please login as a customer to add items to cart.');
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  cart[productId] = (cart[productId] || 0) + 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
};