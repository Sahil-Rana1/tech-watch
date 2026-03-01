import { getWishlist, toggleWishlist, addToCart, showToast } from './utils.js';

window.addToCart = addToCart;
window.toggleWishlist = (product) => {
    toggleWishlist(product);
    renderWishlist(); // Refresh grid
};

const renderWishlist = () => {
    const wishlist = getWishlist();
    const container = document.getElementById('wishlist-container');
    const emptyMsg = document.getElementById('empty-wishlist');
    if (!container) return;
    container.innerHTML = '';

    if (wishlist.length === 0) {
        emptyMsg.classList.remove('d-none');
        return;
    }

    emptyMsg.classList.add('d-none');
    
    wishlist.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-sm-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <button class="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm p-1" style="z-index:10" onclick='toggleWishlist(${JSON.stringify(product)})'>
                    <i class="bi bi-x-lg"></i>
                </button>
                <a href="product-detail.html?id=${product.id}"><img src="${product.image}" class="card-img-top" style="aspect-ratio:1/1;object-fit:cover"></a>
                <div class="card-body text-center p-2">
                    <h6 class="card-title fw-bold small text-truncate">${product.name}</h6>
                    <p class="text-primary fw-bold mb-2">₹${product.price.toLocaleString('en-IN')}</p>
                    <button onclick='addToCart(${JSON.stringify(product)})' class="btn btn-outline-primary btn-sm w-100 rounded-pill">Add to Cart</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
});
