import { products, categories } from './data.js';
import { addToCart, toggleWishlist, getWishlist, updateWishlistUI } from './utils.js';

window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;

// Countdown Timer
const countdown = () => {
    const saleDate = new Date();
    saleDate.setDate(saleDate.getDate() + 3);
    const update = () => {
        const now = new Date().getTime();
        const distance = saleDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.innerText = [days, hours, minutes, seconds][i].toString().padStart(2, '0');
        });
    };
    update();
    setInterval(update, 1000);
};

// Render Categories
const renderCategories = () => {
    const container = document.getElementById('category-list');
    if (!container) return;

    const categoryIcons = {
        "Laptops": "bi-laptop", "Smartphones": "bi-phone", "Smartwatches": "bi-watch",
        "Headphones": "bi-headphones", "Accessories": "bi-keyboard", "Gaming": "bi-controller"
    };

    categories.filter(c => c !== "All").forEach(cat => {
        const col = document.createElement('div');
        col.className = 'col-4 col-md-2';
        col.innerHTML = `
            <a href="products.html?category=${cat}" class="text-decoration-none">
                <div class="card text-center p-3 border-0 shadow-sm h-100">
                    <i class="bi ${categoryIcons[cat] || 'bi-device-ssd'} fs-2 text-primary mb-2"></i>
                    <h6 class="text-dark fw-bold small mb-0">${cat}</h6>
                </div>
            </a>
        `;
        container.appendChild(col);
    });
};

// Render Featured Products (2 per row on mobile)
const renderFeatured = () => {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.className += " featured-grid"; // Add class for CSS
    const featured = products.filter(p => p.featured).slice(0, 6);
    const wishlist = getWishlist();

    featured.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const col = document.createElement('div');
        col.className = 'col-featured col-sm-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                ${product.trending ? '<span class="badge-trending">TRENDING</span>' : ''}
                <div class="position-relative">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="aspect-ratio: 1/1; object-fit: cover;">
                    </a>
                    <button class="btn btn-wishlist position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle shadow-sm ${isInWishlist ? 'active' : ''}" 
                            data-id="${product.id}" onclick='toggleWishlist(${JSON.stringify(product)})'>
                        <i class="bi bi-heart"></i>
                    </button>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted">${product.category}</small>
                        <small class="text-warning"><i class="bi bi-star-fill"></i> ${product.rating}</small>
                    </div>
                    <h6 class="card-title fw-bold flex-grow-1">${product.name}</h6>
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <span class="fs-5 fw-bold text-primary">₹${product.price.toLocaleString('en-IN')}</span>
                        <span class="text-muted text-decoration-line-through small">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <button onclick='addToCart(${JSON.stringify(product)})' class="btn btn-primary w-100 rounded-pill">Add to Cart</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
};

// Render Trending
const renderTrendingCarousel = () => {
    const container = document.getElementById('trending-carousel-inner');
    if (!container) return;
    const trending = products.filter(p => p.trending);
    trending.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card border-0 bg-transparent">
                        <div class="row g-0 align-items-center">
                            <div class="col-md-6 text-center text-md-start">
                                <span class="badge bg-danger mb-2">HOT TREND</span>
                                <h1 class="display-5 fw-bold mb-3">${product.name}</h1>
                                <p class="text-muted mb-4">${product.description}</p>
                                <div class="mb-4">
                                    <span class="display-6 fw-bold text-primary">₹${product.price.toLocaleString('en-IN')}</span>
                                    <span class="ms-2 text-muted text-decoration-line-through">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div class="d-flex gap-2 justify-content-center justify-content-md-start">
                                    <a href="product-detail.html?id=${product.id}" class="btn btn-primary btn-lg px-4 rounded-pill">Shop Now</a>
                                    <button onclick='toggleWishlist(${JSON.stringify(product)})' class="btn btn-outline-primary btn-lg px-4 rounded-pill">Wishlist</button>
                                </div>
                            </div>
                            <div class="col-md-6 mt-4 mt-md-0">
                                <img src="${product.image}" class="img-fluid rounded-4 shadow" alt="${product.name}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    countdown();
    renderCategories();
    renderFeatured();
    renderTrendingCarousel();
});
