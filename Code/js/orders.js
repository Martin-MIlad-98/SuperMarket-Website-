document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('orders-list')) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'customer') {
    document.getElementById('orders-list').innerHTML = '<p>Please login to view orders.</p>';
    return;
  }

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const userOrders = orders.filter(o => o.customerId === currentUser.username);

  if (userOrders.length === 0) {
    document.getElementById('orders-list').innerHTML = '<p>No orders yet.</p>';
    return;
  }

  let html = '<div class="order-list">';
  userOrders.forEach(order => {
    html += `
      <div class="order-item">
        <h3>Order #${order.id} - ${order.date}</h3>
        <p>Status: <strong>${order.status}</strong></p>
        <p>Total: $${order.total.toFixed(2)}</p>
        <ul>
          ${order.items.map(i => `<li>${i.name} x${i.quantity} ($${(i.price * i.quantity).toFixed(2)})</li>`).join('')}
        </ul>
      </div>
    `;
  });
  html += '</div>';

  document.getElementById('orders-list').innerHTML = html;
});