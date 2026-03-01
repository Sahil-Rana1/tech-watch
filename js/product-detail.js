import { products } from './data.js';
import { addToCart, toggleWishlist, getWishlist, updateWishlistUI } from './utils.js';

window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    if (!productId) { window.location.href = 'products.html'; return; }

    const product = products.find(p => p.id === productId);
    if (!product) {
        document.getElementById('loader').innerHTML = '<h2>Product not found.</h2> <a href="products.html" class="btn btn-primary mt-3">Back to Shop</a>';
        return;
    }
    renderProductDetail(product);
});

const renderProductDetail = (product) => {
    document.getElementById('loader').classList.add('d-none');
    document.getElementById('product-content').classList.remove('d-none');

    document.title = `${product.name} | TechWatch`;
    const wishlist = getWishlist();
    const isInWishlist = wishlist.some(item => item.id === product.id);

    document.getElementById('breadcrumb-current').innerText = product.name;
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-price').innerText = `₹${product.price.toLocaleString('en-IN')}`;
    document.getElementById('product-original-price').innerText = `₹${product.originalPrice.toLocaleString('en-IN')}`;
    document.getElementById('product-description').innerText = product.description;
    document.getElementById('main-product-img').src = product.image;
    document.getElementById('product-rating').innerText = `(${product.rating} / ${product.reviews} reviews)`;

    // Wishlist Button State
    const wishBtn = document.getElementById('add-to-wishlist-btn');
    wishBtn.setAttribute('data-id', product.id);
    if (isInWishlist) wishBtn.classList.add('active');
    wishBtn.onclick = () => toggleWishlist(product);

    const stockEl = document.getElementById('stock-status');
    if (product.stock > 0) {
        stockEl.innerText = `In Stock (${product.stock} units)`;
        stockEl.className = 'badge bg-success';
    } else {
        stockEl.innerText = 'Out of Stock';
        stockEl.className = 'badge bg-danger';
        document.getElementById('add-to-cart-btn').disabled = true;
    }

    const specBody = document.getElementById('spec-table-body');
    specBody.innerHTML = '';
    Object.entries(product.specs).forEach(([key, value]) => {
        specBody.insertAdjacentHTML('beforeend', `<tr><td class="fw-bold bg-light" style="width:30%">${key}</td><td>${value}</td></tr>`);
    });

    const qtyInput = document.getElementById('qty-input');
    document.getElementById('qty-plus').onclick = () => { if (qtyInput.value < product.stock) qtyInput.value++; };
    document.getElementById('qty-minus').onclick = () => { if (qtyInput.value > 1) qtyInput.value--; };

    document.getElementById('add-to-cart-btn').onclick = () => addToCart(product, parseInt(qtyInput.value));

    renderRelatedProducts(product);
};

const renderRelatedProducts = (currentProduct) => {
    const container = document.getElementById('related-products');
    const related = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
    if (!container) return;
    container.innerHTML = '';
    related.forEach(p => {
        container.insertAdjacentHTML('beforeend', `
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm">
                    <a href="product-detail.html?id=${p.id}"><img src="${p.image}" class="card-img-top" style="aspect-ratio:1/1;object-fit:cover"></a>
                    <div class="card-body p-2">
                        <h6 class="card-title fw-bold small mb-1 text-truncate">${p.name}</h6>
                        <span class="text-primary fw-bold small">₹${p.price.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        `);
    });
};
