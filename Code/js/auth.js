document.addEventListener('DOMContentLoaded', () => {

  /* =====================
     INITIAL SETUP
     ===================== */

  // Create default admin if not exists
  if (!localStorage.getItem('users')) {
    const users = [
      { username: 'admin', password: 'admin123', role: 'admin' }
    ];
    localStorage.setItem('users', JSON.stringify(users));
  }

  const authLink = document.getElementById('auth-link');
  const logoutBtn = document.getElementById('logout-btn');

  /* =====================
     AUTH LINK UPDATE
     ===================== */
  function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
      if (authLink) {
        authLink.innerHTML = `<a href="#">${currentUser.username} (Logout)</a>`;
        authLink.addEventListener('click', logout);
      }
      if (logoutBtn) logoutBtn.addEventListener('click', logout);
    } else {
      if (authLink) authLink.innerHTML = `<a href="login.html">Login</a>`;
    }
  }

  /* =====================
     LOGIN
     ===================== */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('login-role').value;
      const users = JSON.parse(localStorage.getItem('users')) || [];

      const user = users.find(
        u => u.username === username &&
             u.password === password &&
             u.role === role
      );

      const msg = document.getElementById('login-message');

      if (!user) {
        msg.style.color = 'red';
        msg.textContent = 'Invalid credentials or role.';
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      msg.style.color = 'green';
      msg.textContent = 'Login successful!';

      setTimeout(() => {
        window.location.href = user.role === 'admin'
          ? 'admin.html'
          : 'index.html';
      }, 800);
    });
  }

  /* =====================
     REGISTER
     ===================== */
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const username = document.getElementById('reg-username').value;
      const password = document.getElementById('reg-password').value;
      const role = document.getElementById('register-role').value;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const msg = document.getElementById('register-message');

      // ❌ Prevent admin registration
      if (role === 'admin') {
        msg.style.color = 'red';
        msg.textContent = 'Admin accounts cannot be registered.';
        return;
      }

      if (users.some(u => u.username === username)) {
        msg.style.color = 'red';
        msg.textContent = 'Username already exists.';
        return;
      }

      users.push({ username, password, role: 'customer' });
      localStorage.setItem('users', JSON.stringify(users));

      msg.style.color = 'green';
      msg.textContent = 'Registration successful. Redirecting...';

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });
  }

  /* =====================
     LOGOUT
     ===================== */
  function logout(e) {
    e?.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }

  updateAuthUI();
});
