import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Admin Credentials Mock: admin@techwatch.com / admin123

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Allow hardcoded admin login
            if (email === 'admin@techwatch.com' && password === 'admin123') {
                const adminUser = { name: 'Admin User', email: email, isAdmin: true };
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                showToast('Welcome Admin!');
                setTimeout(() => window.location.href = 'admin.html', 1000);
                return;
            }

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showToast(`Welcome back, ${user.name}!`);
                setTimeout(() => window.location.href = 'index.html', 1000);
            } else {
                showToast('Invalid email or password', 'danger');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.email === email)) {
                showToast('Email already registered', 'danger');
                return;
            }

            const newUser = { name, email, password, isAdmin: email === 'admin@techwatch.com' };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            showToast('Registration successful!');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }
});
