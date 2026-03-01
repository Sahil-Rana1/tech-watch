import { products } from './data.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Basic Admin Check
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    initDashboard();
    renderProducts();
    renderOrders();
    initChart();
});

const initDashboard = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('total-orders-val').innerText = orders.length + 150;
    document.getElementById('total-products-val').innerText = products.length;
    const subtotal = orders.reduce((acc, curr) => acc + parseFloat(curr.total.replace('₹', '').replace(/,/g, '')), 0);
    document.getElementById('total-sales-val').innerText = `₹${(subtotal + 1200000).toLocaleString('en-IN')}`;
};

const renderProducts = () => {
    const body = document.getElementById('admin-products-body');
    if (!body) return;
    body.innerHTML = '';
    products.forEach(p => {
        body.insertAdjacentHTML('beforeend', `
            <tr>
                <td><div class="d-flex align-items-center"><img src="${p.image}" class="rounded-3 me-2" style="width:40px;height:40px;object-fit:cover"><span class="small fw-600">${p.name}</span></div></td>
                <td>${p.category}</td>
                <td class="fw-bold">₹${p.price.toLocaleString('en-IN')}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary p-1"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger p-1" onclick="this.closest('tr').remove()"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `);
    });
};

const renderOrders = () => {
    const body = document.getElementById('admin-orders-body');
    const recentList = document.getElementById('recent-orders-list');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (body) {
        body.innerHTML = '';
        orders.forEach(o => {
            body.insertAdjacentHTML('beforeend', `<tr><td>#${o.id}</td><td>Customer</td><td>${o.date}</td><td class="fw-bold">${o.total}</td><td><span class="badge bg-success">${o.status}</span></td></tr>`);
        });
    }
    if (recentList) {
        recentList.innerHTML = '';
        orders.slice(-5).reverse().forEach(o => {
            recentList.insertAdjacentHTML('beforeend', `
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <div><h6 class="mb-0 fw-bold small">Order #${o.id}</h6><small class="text-muted small">${o.date}</small></div>
                    <span class="fw-bold text-primary small">${o.total}</span>
                </div>
            `);
        });
    }
};

const initChart = () => {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Sales (₹)',
                data: [500000, 750000, 600000, 900000, 1100000, 1050000, 1250000],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.4
            }]
        }
    });
};
