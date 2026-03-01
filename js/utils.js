// Theme Management
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
    const nav = document.querySelector('nav');
    if (nav) {
        if (theme === 'dark') {
            nav.classList.add('navbar-dark');
        } else {
            nav.classList.remove('navbar-dark');
        }
    }
};

const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
};

// Cart & Wishlist Logic
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const getWishlist = () => JSON.parse(localStorage.getItem('wishlist')) || [];

const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
};

const saveWishlist = (wishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
};

// Toggle Wishlist
const toggleWishlist = (product) => {
    let wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);

    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist(wishlist);
        showToast(`Removed from wishlist`, 'info');
        updateWishlistUI(product.id, false);
        return false;
    } else {
        wishlist.push(product);
        saveWishlist(wishlist);
        showToast(`Added to wishlist!`);
        updateWishlistUI(product.id, true);
        return true;
    }
};

const updateWishlistUI = (productId, isActive) => {
    const btns = document.querySelectorAll(`.btn-wishlist[data-id="${productId}"]`);
    btns.forEach(btn => {
        if (isActive) btn.classList.add('active');
        else btn.classList.remove('active');
    });
};

const addToCart = (product, quantity = 1) => {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    saveCart(cart);
    showToast(`${product.name} added to cart!`);
};

const updateCartCount = () => {
    const count = getCart().reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(b => b.innerText = count);
};

const updateWishlistCount = () => {
    const count = getWishlist().length;
    const badges = document.querySelectorAll('#wishlist-count');
    badges.forEach(b => b.innerText = count);
};

// UI Components
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        div.style.zIndex = '1100';
        document.body.appendChild(div);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'primary' : type === 'info' ? 'info' : 'danger'} border-0 show m-2`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

const initScrollToTop = () => {
    const btn = document.getElementById('btn-back-to-top');
    if (!btn) return;
    window.onscroll = () => {
        const scrolled = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
        if (scrolled) btn.classList.add('show');
        else btn.classList.remove('show');
    };
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Navbar & Footer Rendering
const renderNavbar = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const nav = `
    <nav class="navbar navbar-expand-lg sticky-top border-bottom">
        <div class="container">
            <a class="navbar-brand" href="index.html">TECHWATCH</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="products.html">Shop</a></li>
                    <li class="nav-item"><a class="nav-link" href="mobiles.html">Mobiles</a></li>
                    <li class="nav-item"><a class="nav-link" href="laptops.html">Laptops</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" onclick="handleAdminLink(event)">Admin</a></li>
                </ul>
                <div class="d-flex align-items-center gap-1">
                    <button class="btn btn-link nav-link position-relative" onclick="location.href='wishlist.html'">
                        <i class="bi bi-heart"></i>
                        <span id="wishlist-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
                    </button>
                    <button class="btn btn-link nav-link position-relative me-2" onclick="location.href='cart.html'">
                        <i class="bi bi-cart3"></i>
                        <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">0</span>
                    </button>
                    <button id="theme-toggle" class="btn btn-link nav-link me-2">
                        <i class="bi bi-moon-fill"></i>
                    </button>
                    ${user ? `
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle rounded-pill px-3" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-person-circle me-1"></i> ${user.name.split(' ')[0]}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Profile</a></li>
                                <li><a class="dropdown-item" href="wishlist.html"><i class="bi bi-heart me-2"></i>Wishlist</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser(event)"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                            </ul>
                        </div>
                    ` : `
                        <a href="login.html" class="btn btn-outline-primary rounded-pill px-4">Login</a>
                    `}
                </div>
            </div>
        </div>
    </nav>
    <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100"></div>
    <button type="button" class="btn btn-primary" id="btn-back-to-top" title="Go to top">
        <i class="bi bi-arrow-up"></i>
    </button>
    `;
    document.body.insertAdjacentHTML('afterbegin', nav);
};

const renderFooter = () => {
    const footer = `
    <footer class="mt-5">
        <div class="container py-5">
            <div class="row g-4">
                <div class="col-lg-4 mb-4">
                    <h4 class="fw-bold text-primary mb-3">TECHWATCH</h4>
                    <p class="text-muted">Premium electronics store delivering quality and performance. Join 10k+ happy customers across the country.</p>
                </div>
                <div class="col-6 col-lg-2">
                    <h6 class="fw-bold mb-3">Shop</h6>
                    <ul class="list-unstyled text-muted small">
                        <li class="mb-2"><a href="laptops.html" class="text-reset text-decoration-none">Laptops</a></li>
                        <li class="mb-2"><a href="mobiles.html" class="text-reset text-decoration-none">Mobiles</a></li>
                    </ul>
                </div>
                <div class="col-6 col-lg-2">
                    <h6 class="fw-bold mb-3">Support</h6>
                    <ul class="list-unstyled text-muted small">
                        <li class="mb-2"><a href="#" class="text-reset text-decoration-none">Contact Us</a></li>
                        <li class="mb-2"><a href="#" class="text-reset text-decoration-none">Shipping Policy</a></li>
                        <li class="mb-2"><a href="#" class="text-reset text-decoration-none">Return Policy</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h6 class="fw-bold mb-3">Newsletter</h6>
                    <div class="input-group">
                        <input type="email" class="form-control" placeholder="Your email">
                        <button class="btn btn-primary px-4">Subscribe</button>
                    </div>
                </div>
            </div>
            <hr class="my-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <small class="text-muted">&copy; 2026 TechWatch Electronics. All rights reserved.</small>
                <div class="d-flex gap-3">
                    <a href="#" class="text-muted fs-5"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="text-muted fs-5"><i class="bi bi-twitter-x"></i></a>
                    <a href="#" class="text-muted fs-5"><i class="bi bi-facebook"></i></a>
                </div>
            </div>
        </div>
    </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footer);
};

// Global Actions
window.logoutUser = (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};

window.handleAdminLink = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // Simulation: Admin email is 'admin@techwatch.com'
    if (user && user.email === 'admin@techwatch.com') {
        window.location.href = 'admin.html';
    } else {
        showToast('Please login with admin credentials!', 'danger');
        setTimeout(() => window.location.href = 'login.html', 1000);
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initTheme();
    initScrollToTop();
    updateCartCount();
    updateWishlistCount();
});

export { addToCart, toggleWishlist, showToast, getCart, saveCart, getWishlist, saveWishlist, updateWishlistUI };
