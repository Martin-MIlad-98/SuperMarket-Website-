document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'admin') {
    alert('Admin access only!');
    window.location.href = 'index.html';
    return;
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Load data
  renderProductsTable();
  renderInventoryTable();
  renderAdminOrders();
  renderUsersTable();

  // Product form
  document.getElementById('product-form').addEventListener('submit', e => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: document.getElementById('prod-name').value,
      category: document.getElementById('prod-category').value,
      price: parseFloat(document.getElementById('prod-price').value),
      stock: parseInt(document.getElementById('prod-stock').value)
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductsTable();
    renderInventoryTable();
    document.getElementById('product-form').reset();
  });
});

function renderProductsTable() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const table = document.getElementById('product-table');
  table.innerHTML = `
    <table>
      <thead>
        <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>
              <button onclick="editProduct(${p.id})">Edit</button>
              <button onclick="deleteProduct(${p.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderInventoryTable() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const table = document.getElementById('inventory-table');
  table.innerHTML = `
    <table>
      <thead>
        <tr><th>Product</th><th>Current Stock</th><th>Update</th></tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>${p.stock}</td>
            <td>
              <input type="number" id="stock-${p.id}" value="${p.stock}" min="0" />
              <button onclick="updateStock(${p.id})">Update</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAdminOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const container = document.getElementById('admin-orders-list');
  if (orders.length === 0) {
    container.innerHTML = '<p>No orders.</p>';
    return;
  }

  let html = '<div class="admin-orders">';
  orders.forEach(order => {
    html += `
      <div class="order-card">
        <h3>Order #${order.id} by ${order.customerId}</h3>
        <p>Status: 
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </p>
        <p>Total: $${order.total.toFixed(2)}</p>
        <ul>
          ${order.items.map(i => `<li>${i.name} x${i.quantity}</li>`).join('')}
        </ul>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderUsersTable() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const table = document.getElementById('users-table');
  table.innerHTML = `
    <table>
      <thead>
        <tr><th>Username</th><th>Role</th></tr>
      </thead>
      <tbody>
        ${users.filter(u => u.role === 'customer').map(u => `
          <tr>
            <td>${u.username}</td>
            <td>${u.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Make functions global for inline onclick
window.editProduct = (id) => alert('Edit feature can be extended.');
window.deleteProduct = (id) => {
  if (!confirm('Delete this product?')) return;
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(products));
  renderProductsTable();
  renderInventoryTable();
};

window.updateStock = (id) => {
  const newStock = parseInt(document.getElementById(`stock-${id}`).value);
  if (isNaN(newStock) || newStock < 0) return;
  let products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);
  if (product) {
    product.stock = newStock;
    localStorage.setItem('products', JSON.stringify(products));
    renderInventoryTable();
    alert('Stock updated.');
  }
};

window.updateOrderStatus = (orderId, newStatus) => {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders));
    renderAdminOrders();
  }
};