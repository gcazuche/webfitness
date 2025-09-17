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

    const menuTrigger = document.getElementById('mobile-menu-trigger');
    const nav = document.querySelector('header nav');
    if (menuTrigger && nav) {
        menuTrigger.addEventListener('click', () => {
            nav.classList.toggle('menu-active');
            const icon = menuTrigger.querySelector('i');
            if (nav.classList.contains('menu-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    const modal = document.getElementById('product-modal');
    if (modal) {
        const detailButtons = document.querySelectorAll('.btn-details');
        const closeModalBtn = document.querySelector('.close-modal');
        const modalImg = document.getElementById('modal-img');
        const modalName = document.getElementById('modal-name');
        const modalPrice = document.getElementById('modal-price');
        const modalSpecs = document.getElementById('modal-specs');
        const modalColorsContainer = document.getElementById('modal-colors');
        const modalContactBtn = document.getElementById('modal-contact-btn');

        const colorMap = {
            'preto': '#000000', 'branco': '#FFFFFF', 'vermelho': '#e74c3c',
            'amarelo': '#f1c40f', 'verde': '#2ecc71', 'cinza': '#bdc3c7',
            'azul': '#2980b9', 'laranja': '#e67e22', 'roxo': '#8e44ad',
            'rosa': '#e84393'
        };

        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.product-card');
                const name = card.dataset.name, 
                      img = card.dataset.img, 
                      specs = card.dataset.specs, 
                      colors = card.dataset.colors,
                      price = card.dataset.price; 

                if (!name || name === "Em-Breve") return;

                modalName.textContent = name;
                modalImg.src = img;
                modalImg.alt = name;
                modalContactBtn.href = `contato.html?produto=${encodeURIComponent(name)}`;
                
                if (price) {
                    modalPrice.textContent = price;
                    modalPrice.style.display = 'block';
                } else {
                    modalPrice.style.display = 'none';
                }

                modalSpecs.innerHTML = '';
                const specsList = specs.split('|').map(s => s.trim());
                specsList.forEach(specText => {
                    const p = document.createElement('p');
                    p.textContent = specText;
                    modalSpecs.appendChild(p);
                });

                modalColorsContainer.innerHTML = '';
                const colorsList = colors.split(',').map(c => c.trim().toLowerCase());
                
                colorsList.forEach(colorName => {
                    const colorCode = colorMap[colorName];
                    if (colorCode) {
                        const bubble = document.createElement('div');
                        bubble.className = 'color-bubble';
                        bubble.style.backgroundColor = colorCode;
                        bubble.title = colorName.charAt(0).toUpperCase() + colorName.slice(1);
                        if (colorName === 'branco') bubble.style.border = '1px solid #ddd';
                        modalColorsContainer.appendChild(bubble);
                    }
                });

                modal.style.display = 'flex';
            });
        });

        function closeModal() { modal.style.display = 'none'; }
        closeModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    }
});