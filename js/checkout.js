import { getCart, saveCart, showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    if (cart.length === 0) { window.location.href = 'cart.html'; return; }
    renderSummary(cart);

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
        placeOrder();
    });
});

const renderSummary = (cart) => {
    const container = document.getElementById('checkout-items');
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        container.insertAdjacentHTML('beforeend', `
            <div class="d-flex align-items-center mb-3 text-start">
                <div class="position-relative me-3">
                    <img src="${item.image}" class="rounded-3 border" style="width: 50px; height: 50px; object-fit: cover;">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style="font-size: 0.65rem;">
                        ${item.quantity}
                    </span>
                </div>
                <div class="flex-grow-1 overflow-hidden">
                    <h6 class="mb-0 small fw-bold text-truncate">${item.name}</h6>
                    <small class="text-muted">₹${item.price.toLocaleString('en-IN')}</small>
                </div>
                <div class="text-end ps-2">
                    <span class="fw-bold small">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
            </div>
        `);
    });
    const tax = subtotal * 0.12;
    const shipping = subtotal > 10000 ? 0 : 500;
    const total = subtotal + tax + shipping;

    container.insertAdjacentHTML('afterend', `
        <div class="cart-summary-breakdown py-3 border-top border-bottom mt-3">
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted small">Subtotal</span>
                <span class="small">₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted small">Tax (GST 12%)</span>
                <span class="small">₹${tax.toLocaleString('en-IN')}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted small">Shipping</span>
                <span class="small">${shipping === 0 ? '<span class="text-success fw-bold">Free</span>' : '₹' + shipping.toLocaleString('en-IN')}</span>
            </div>
        </div>
    `);

    document.getElementById('checkout-total').innerText = `₹${total.toLocaleString('en-IN')}`;
};

const placeOrder = () => {
    const orderId = Math.floor(Math.random() * 900000) + 100000;
    document.getElementById('order-id').innerText = orderId;
    const cart = getCart();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
        id: orderId,
        date: new Date().toLocaleDateString(),
        items: cart,
        total: document.getElementById('checkout-total').innerText,
        status: 'Processing'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    saveCart([]);
    new bootstrap.Modal(document.getElementById('successModal')).show();
};
