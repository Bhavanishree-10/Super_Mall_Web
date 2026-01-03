// File: js/admin.js
import { FULL_DATA } from './data.js';
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- 1. Security Check ---
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "shreeadmin@gmail.com") {
        alert("Access Denied. Admins Only.");
        window.location.href = "index.html";
    } else {
        initAdminPanel();
    }
});

let chartsInitialized = false;

function initAdminPanel() {
    loadDashboardTable();
    loadShopManagement();
    updateGlobalStats();
}

// --- 2. Navigation Logic ---
window.switchView = (viewId) => {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    
    // Show selected
    document.getElementById(viewId).classList.add('active');
    
    // Highlight sidebar (simple matching)
    if(viewId === 'dashboard') document.querySelectorAll('.menu-item')[0].classList.add('active');
    if(viewId === 'analytics') {
        document.querySelectorAll('.menu-item')[1].classList.add('active');
        if(!chartsInitialized) initCharts(); // Load charts only once
    }
    if(viewId === 'shop-mgmt') document.querySelectorAll('.menu-item')[2].classList.add('active');
};

window.logoutUser = () => {
    signOut(auth).then(() => window.location.href = "index.html");
};

// --- 3. Dashboard Logic ---
function loadDashboardTable() {
    const tableBody = document.getElementById('adminTable');
    tableBody.innerHTML = '';

    Object.values(FULL_DATA).forEach(shop => {
        // Calculate Metrics
        let revenue = shop.products.reduce((acc, p) => acc + (p.price * 5), 0);
        let performance = revenue > 50000 ? "Excellent" : "Average";
        let badgeClass = revenue > 50000 ? "status-good" : "status-bad";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${shop.name}</strong></td>
            <td>${shop.cat.toUpperCase()}</td>
            <td>${shop.products.length}</td>
            <td>₹${revenue.toLocaleString()}</td>
            <td><span class="status-badge ${badgeClass}">${performance}</span></td>
        `;
        
        // Add Click Event for Drill-Down
        row.addEventListener('click', () => openShopDetail(shop));
        tableBody.appendChild(row);
    });
}

function updateGlobalStats() {
    const shops = Object.values(FULL_DATA);
    const totalRev = shops.reduce((acc, s) => acc + s.products.reduce((a, p) => a + (p.price * 5), 0), 0);
    
    document.getElementById('totalShops').innerText = shops.length;
    document.getElementById('totalRev').innerText = "₹" + totalRev.toLocaleString();
    document.getElementById('taxRev').innerText = "₹" + Math.floor(totalRev * 0.18).toLocaleString();
}

// --- 4. Drill-Down Detail Logic ---
function openShopDetail(shop) {
    // Fill Info
    document.getElementById('detailName').innerText = shop.name;
    document.getElementById('detailCat').innerText = shop.cat.toUpperCase();
    document.getElementById('detailCount').innerText = shop.products.length;
    
    let shopTotal = 0;
    const prodTable = document.getElementById('detailProductTable');
    prodTable.innerHTML = '';

    shop.products.forEach(prod => {
        let sold = Math.floor(Math.random() * 20) + 1; // Simulate random sales
        let total = prod.price * sold;
        shopTotal += total;

        prodTable.innerHTML += `
            <tr>
                <td>${prod.name}</td>
                <td>₹${prod.price}</td>
                <td>${sold}</td>
                <td><strong>₹${total.toLocaleString()}</strong></td>
            </tr>
        `;
    });

    document.getElementById('detailRev').innerText = "₹" + shopTotal.toLocaleString();
    
    // Switch View
    switchView('shop-detail');
}

// --- 5. Shop Management Logic ---
function loadShopManagement() {
    const table = document.getElementById('shopMgmtTable');
    table.innerHTML = '';
    
    Object.values(FULL_DATA).forEach((shop, index) => {
        table.innerHTML += `
            <tr>
                <td>#SHP-${1000 + index}</td>
                <td>${shop.name}</td>
                <td><span class="status-badge status-good">Active Owner</span></td>
                <td>
                    <button style="color:red; background:none; border:none; cursor:pointer;" onclick="alert('Delete feature coming soon')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// --- 6. Analytics Charts (Chart.js) ---
function initCharts() {
    chartsInitialized = true;
    
    // Chart 1: Revenue Trends
    new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Mall Revenue (in Lakhs)',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#4F46E5',
                tension: 0.4
            }]
        }
    });

    // Chart 2: Category Distribution
    new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: {
            labels: ['Fashion', 'Tech', 'Food', 'Luxury'],
            datasets: [{
                data: [40, 25, 20, 15],
                backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
            }]
        }
    });

    // Chart 3: Peak Hours
    new Chart(document.getElementById('trafficChart'), {
        type: 'bar',
        data: {
            labels: ['10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
            datasets: [{
                label: 'Footfall Traffic',
                data: [100, 400, 350, 600, 900, 800, 300],
                backgroundColor: '#8B5CF6'
            }]
        }
    });
}
window.logoutUser = () => {
    signOut(auth).then(() => {
        // Use 'replace' to prevent going back
        window.location.replace("index.html");
    });
};