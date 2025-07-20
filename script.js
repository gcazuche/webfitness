document.addEventListener('DOMContentLoaded', () => {

    const initialOrders = [
        { id: 'WF2025-001', customer: 'Carlos Pereira', product: 'Elevação Pélvica', status: 'recebido' },
        { id: 'WF2025-002', customer: 'Ana Beatriz', product: 'Elevação Pélvica', status: 'enviado' },
        { id: 'WF2025-003', customer: 'Marcos Rocha', product: 'Elevação Pélvica', status: 'transporte' },
        { id: 'WF2025-004', customer: 'Juliana Costa', product: 'Elevação Pélvica', status: 'entregue' },
    ];

    function initializeData() {
        if (!localStorage.getItem('webFitnessOrders')) {
            localStorage.setItem('webFitnessOrders', JSON.stringify(initialOrders));
        }
    }
    initializeData();

    const adminTrigger = document.getElementById('admin-trigger');
    const adminModal = document.getElementById('admin-login-modal');
    const closeLoginModalBtn = document.querySelector('.close-modal-login');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    if (adminTrigger) {
        adminTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            adminModal.style.display = 'flex';
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'webfitness' && password === '123123fit') {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                loginError.textContent = 'Usuário ou senha inválidos.';
                loginError.style.display = 'block';
            }
        });
    }

    if (document.getElementById('admin-dashboard') && sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = 'index.html'; 
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('isAdminLoggedIn');
            window.location.href = 'index.html';
        });
    }

    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard) {
        const orderListContainer = document.getElementById('order-list');
        let orders = JSON.parse(localStorage.getItem('webFitnessOrders'));

        function renderDashboard() {
            orderListContainer.innerHTML = ''; 
            orders.forEach(order => {
                const row = document.createElement('div');
                row.className = 'order-row';
                row.innerHTML = `
                    <div class="row-item">${order.id}</div>
                    <div class="row-item">${order.customer}</div>
                    <div class="row-item">${order.product}</div>
                    <div class="row-item">
                        <select class="status-select" data-order-id="${order.id}" data-status="${order.status}">
                            <option value="recebido" ${order.status === 'recebido' ? 'selected' : ''}>Pedido Recebido</option>
                            <option value="enviado" ${order.status === 'enviado' ? 'selected' : ''}>Enviado</option>
                            <option value="transporte" ${order.status === 'transporte' ? 'selected' : ''}>Em Transporte</option>
                            <option value="entregue" ${order.status === 'entregue' ? 'selected' : ''}>Entregue</option>
                        </select>
                    </div>
                `;
                orderListContainer.appendChild(row);
            });
        }
        
        orderListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const orderId = e.target.dataset.orderId;
                const newStatus = e.target.value;
                
                const orderToUpdate = orders.find(o => o.id === orderId);
                if (orderToUpdate) {
                    orderToUpdate.status = newStatus;
                    e.target.dataset.status = newStatus; 
                    localStorage.setItem('webFitnessOrders', JSON.stringify(orders));
                }
            }
        });

        renderDashboard();
    }

    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
        const resultCodeInput = document.getElementById('order-code');
        const resultContainer = document.getElementById('tracking-result');

        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = resultCodeInput.value.trim().toUpperCase();
            if (!code) return;
            
            const orders = JSON.parse(localStorage.getItem('webFitnessOrders'));
            const order = orders.find(o => o.id.toUpperCase() === code);

            resultContainer.style.display = 'block';

            if (order) {
                const statuses = ['recebido', 'enviado', 'transporte', 'entregue'];
                const currentStatusIndex = statuses.indexOf(order.status);

                resultContainer.innerHTML = `
                    <div class="order-details-header">
                        <h3>Status do Pedido: #${order.id}</h3>
                        <p><strong>Produto:</strong> ${order.product}</p>
                    </div>
                    <ul class="progress-bar">
                        <li class="progress-step ${currentStatusIndex >= 0 ? 'active' : ''} ${currentStatusIndex === 0 ? 'active-current' : ''}">Recebido</li>
                        <li class="progress-step ${currentStatusIndex >= 1 ? 'active' : ''} ${currentStatusIndex === 1 ? 'active-current' : ''}">Enviado</li>
                        <li class="progress-step ${currentStatusIndex >= 2 ? 'active' : ''} ${currentStatusIndex === 2 ? 'active-current' : ''}">Em Transporte</li>
                        <li class="progress-step ${currentStatusIndex >= 3 ? 'active' : ''} ${currentStatusIndex === 3 ? 'active-current' : ''}">Entregue</li>
                    </ul>
                `;
            } else {
                resultContainer.innerHTML = `<p class="order-not-found">Pedido não encontrado. Verifique o código e tente novamente.</p>`;
            }
        });
    }

    const slider = document.querySelector('.slider');
    if (slider) { 
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        setInterval(() => showSlide(currentSlide + 1), 7000); 
    }

    const modal = document.getElementById('product-modal');
    if (modal) {
        const detailButtons = document.querySelectorAll('.btn-details');
        const closeModalBtn = document.querySelector('.close-modal');
        const modalImg = document.getElementById('modal-img');
        const modalName = document.getElementById('modal-name');
        const modalSpecs = document.getElementById('modal-specs');
        const modalColors = document.getElementById('modal-colors');
        const modalContactBtn = document.getElementById('modal-contact-btn');

        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.product-card');
                const name = card.dataset.name, img = card.dataset.img, specs = card.dataset.specs, colors = card.dataset.colors;
                modalName.textContent = name;
                modalImg.src = img;
                modalImg.alt = name;
                modalSpecs.textContent = specs;
                modalColors.textContent = colors;
                modalContactBtn.href = `contato.html?produto=${encodeURIComponent(name)}`;
                modal.style.display = 'flex';
            });
        });
        function closeModal() { modal.style.display = 'none'; }
        closeModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    }

});

const menuTrigger = document.getElementById('mobile-menu-trigger');
const nav = document.querySelector('header nav');

if (menuTrigger && nav) {
    menuTrigger.addEventListener('click', () => {
        nav.classList.toggle('menu-active');
        const icon = menuTrigger.querySelector('i');
        // Muda o ícone de 'barras' para 'X' e vice-versa
        if (nav.classList.contains('menu-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}