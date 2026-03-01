import { getCart, saveCart, showToast } from './utils.js';

const renderCart = () => {
    const cart = getCart();
    const body = document.getElementById('cart-items-body');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!body) return;
    body.innerHTML = '';

    if (cart.length === 0) {
        emptyMsg.classList.remove('d-none');
        body.parentElement.parentElement.classList.add('d-none');
        checkoutBtn.classList.add('disabled');
        updateSummary(0);
        return;
    }

    emptyMsg.classList.add('d-none');
    body.parentElement.parentElement.classList.remove('d-none');
    checkoutBtn.classList.remove('disabled');

    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="rounded-3 me-3" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0 fw-bold small">${item.name}</h6>
                        <small class="text-muted small">${item.category}</small>
                    </div>
                </div>
            </td>
            <td class="small">₹${item.price.toLocaleString('en-IN')}</td>
            <td>
                <div class="input-group input-group-sm" style="width: 80px;">
                    <button class="btn btn-outline-secondary btn-qty-minus" data-id="${item.id}">-</button>
                    <input type="text" class="form-control text-center bg-white px-0" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary btn-qty-plus" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="small"><span class="fw-bold">₹${itemTotal.toLocaleString('en-IN')}</span></td>
            <td><button class="btn btn-link text-danger btn-remove p-0" data-id="${item.id}"><i class="bi bi-trash"></i></button></td>
        `;
        body.appendChild(tr);
    });
    updateSummary(subtotal);
    attachEventListeners();
};

const updateSummary = (subtotal) => {
    const tax = subtotal * 0.12;
    const shipping = subtotal > 10000 ? 0 : 500;
    const total = subtotal + tax + shipping;
    document.getElementById('cart-subtotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('cart-tax').innerText = `₹${tax.toLocaleString('en-IN')}`;
    document.getElementById('cart-shipping').innerText = shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`;
    document.getElementById('cart-total').innerText = `₹${total.toLocaleString('en-IN')}`;
};

const attachEventListeners = () => {
    document.querySelectorAll('.btn-qty-plus').forEach(btn => btn.onclick = () => {
        let cart = getCart();
        const item = cart.find(i => i.id === parseInt(btn.dataset.id));
        if (item) { item.quantity++; saveCart(cart); renderCart(); }
    });
    document.querySelectorAll('.btn-qty-minus').forEach(btn => btn.onclick = () => {
        let cart = getCart();
        const item = cart.find(i => i.id === parseInt(btn.dataset.id));
        if (item && item.quantity > 1) { item.quantity--; saveCart(cart); renderCart(); }
    });
    document.querySelectorAll('.btn-remove').forEach(btn => btn.onclick = () => {
        let cart = getCart().filter(i => i.id !== parseInt(btn.dataset.id));
        saveCart(cart); renderCart();
        showToast('Item removed', 'danger');
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('apply-coupon').addEventListener('click', () => {
        const code = document.getElementById('coupon-code').value.toUpperCase();
        if (code === 'TECH10') showToast('Coupon Applied! (Simulation Only)');
        else showToast('Invalid Code', 'danger');
    });
});
