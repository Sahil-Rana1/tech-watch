import { products, categories } from './data.js';
import { addToCart, toggleWishlist, getWishlist } from './utils.js';

window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;

let currentProducts = [...products];
let viewMode = 'grid';
let filters = {
    search: '',
    category: 'All',
    brand: [],
    price: 200000,
    sort: 'default'
};

const renderProducts = () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (currentProducts.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><h3>No products found.</h3></div>';
        return;
    }

    const wishlist = getWishlist();

    currentProducts.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const colClass = viewMode === 'grid' ? 'col-6 col-sm-6 col-md-4 col-lg-4' : 'col-12';
        const cardClass = viewMode === 'grid' ? '' : 'flex-row align-items-center p-2';

        const col = document.createElement('div');
        col.className = colClass;
        col.innerHTML = `
            <div class="card h-100 ${cardClass} border-0 shadow-sm">
                <div class="position-relative">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="aspect-ratio: 1/1; object-fit: cover;">
                    </a>
                    <button class="btn btn-wishlist position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle shadow-sm ${isInWishlist ? 'active' : ''}" 
                            data-id="${product.id}" onclick='toggleWishlist(${JSON.stringify(product)})'>
                        <i class="bi bi-heart"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted small">${product.category}</small>
                        <small class="text-warning small"><i class="bi bi-star-fill"></i> ${product.rating}</small>
                    </div>
                    <h6 class="card-title fw-bold" style="height: 2.5rem; overflow: hidden; line-height: 1.25;">${product.name}</h6>
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <span class="fs-5 fw-bold text-primary">₹${product.price.toLocaleString('en-IN')}</span>
                        <span class="text-muted text-decoration-line-through small">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <button onclick='addToCart(${JSON.stringify(product)})' class="btn btn-primary btn-sm w-100 rounded-pill">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });

    const countEl = document.getElementById('product-count');
    if (countEl) countEl.innerText = currentProducts.length;
};

const showSkeletons = () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        grid.insertAdjacentHTML('beforeend', `
            <div class="col-6 col-sm-6 col-md-4 col-lg-4">
                <div class="card h-100 skeleton-card border-0">
                    <div class="skeleton" style="height: 180px;"></div>
                    <div class="card-body">
                        <div class="skeleton mb-2" style="height: 15px; width: 40%;"></div>
                        <div class="skeleton mb-3" style="height: 20px; width: 80%;"></div>
                        <div class="skeleton" style="height: 35px; width: 100%;"></div>
                    </div>
                </div>
            </div>
        `);
    }
};

const applyFilters = () => {
    showSkeletons();
    setTimeout(() => {
        currentProducts = products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchCat = filters.category === 'All' || p.category === filters.category;
            const matchBrand = filters.brand.length === 0 || filters.brand.includes(p.brand);
            const matchPrice = p.price <= filters.price;
            return matchSearch && matchCat && matchBrand && matchPrice;
        });

        if (filters.sort === 'price-low') currentProducts.sort((a, b) => a.price - b.price);
        else if (filters.sort === 'price-high') currentProducts.sort((a, b) => b.price - a.price);
        else if (filters.sort === 'rating') currentProducts.sort((a, b) => b.rating - a.rating);

        renderProducts();
    }, 400);
};

const initFilters = () => {
    const catSelect = document.getElementById('category-filter');
    if (catSelect) {
        categories.forEach(cat => {
            if (cat !== 'All') {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.innerText = cat;
                catSelect.appendChild(opt);
            }
        });
        catSelect.addEventListener('change', (e) => { filters.category = e.target.value; applyFilters(); });
    }

    const brandContainer = document.getElementById('brand-filters');
    if (brandContainer) {
        const brands = [...new Set(products.map(p => p.brand))];
        brands.forEach(brand => {
            const div = document.createElement('div');
            div.className = 'form-check mb-1';
            div.innerHTML = `
                <input class="form-check-input brand-checkbox" type="checkbox" value="${brand}" id="brand-${brand}">
                <label class="form-check-label small" for="brand-${brand}">${brand}</label>
            `;
            brandContainer.appendChild(div);
        });
        document.querySelectorAll('.brand-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                filters.brand = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(c => c.value);
                applyFilters();
            });
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', (e) => { filters.search = e.target.value; applyFilters(); });

    const priceSlider = document.getElementById('price-filter');
    if (priceSlider) {
        priceSlider.max = 200000;
        priceSlider.value = 200000;
        priceSlider.addEventListener('input', (e) => {
            filters.price = e.target.value;
            document.getElementById('price-val').innerText = `₹${parseInt(e.target.value).toLocaleString('en-IN')}`;
            applyFilters();
        });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.addEventListener('change', (e) => { filters.sort = e.target.value; applyFilters(); });

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', () => {
        filters = { search: '', category: 'All', brand: [], price: 200000, sort: 'default' };
        location.reload();
    });

    const gView = document.getElementById('grid-view');
    const lView = document.getElementById('list-view');
    if (gView && lView) {
        gView.onclick = () => { viewMode = 'grid'; gView.classList.add('active'); lView.classList.remove('active'); renderProducts(); };
        lView.onclick = () => { viewMode = 'list'; lView.classList.add('active'); gView.classList.remove('active'); renderProducts(); };
    }

    // Auto-Category based on filename
    const path = window.location.pathname;
    if (path.includes('laptops.html')) filters.category = 'Laptops';
    else if (path.includes('mobiles.html')) filters.category = 'Smartphones';

    // URL Param
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
        filters.category = catParam;
        if (catSelect) catSelect.value = catParam;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    applyFilters();
});
