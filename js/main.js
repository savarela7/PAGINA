// Variables globales
let currentUser = { id: 'USR-001', name: 'Admin', role: 'Administrator' };

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    animateNumbers();
    initializeTooltips();
    initializeNavigation();
    initializeNotifications();
    initializeUserMenu();
    showWelcomeNotification();
});

// Crear partículas animadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Animación de números del dashboard
function animateNumbers() {
    const numbers = [
        { id: 'shipments', target: 1247, suffix: '', duration: 2000 },
        { id: 'countries', target: 89, suffix: '', duration: 1800 },
        { id: 'satisfaction', target: 98.5, suffix: '%', duration: 2200 },
        { id: 'delivery', target: 24, suffix: 'h', duration: 1600 }
    ];

    numbers.forEach(item => {
        const element = document.getElementById(item.id);
        if (!element) return;
        
        let current = 0;
        const increment = item.target / (item.duration / 50);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= item.target) {
                current = item.target;
                clearInterval(timer);
            }
            
            const displayValue = item.id === 'satisfaction' ? 
                (Math.floor(current * 10) / 10) : Math.floor(current);
            element.textContent = displayValue + item.suffix;
        }, 50);
    });
}

// Inicializar tooltips
function initializeTooltips() {
    const tooltip = document.getElementById('tooltip');
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltip.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const text = this.getAttribute('data-tooltip');
            tooltip.textContent = text;
            tooltip.style.opacity = '1';
            updateTooltipPosition(e);
        });
        
        element.addEventListener('mousemove', updateTooltipPosition);
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    });
    
    function updateTooltipPosition(e) {
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY - 40 + 'px';
    }
}

// Inicializar navegación
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover clase active de todos los elementos
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Agregar clase active al elemento clickeado
            this.parentElement.classList.add('active');
            
            // Actualizar breadcrumbs
            updateBreadcrumbs(this.querySelector('.nav-text').textContent);
        });
    });
}

// Actualizar breadcrumbs
function updateBreadcrumbs(pageName) {
    const breadcrumbItem = document.querySelector('.breadcrumb-item');
    if (breadcrumbItem) {
        breadcrumbItem.textContent = `🏠 ${pageName}`;
    }
}

// Mostrar notificación de bienvenida
function showWelcomeNotification() {
    setTimeout(() => {
        showNotification('¡Bienvenido a GlobalTrade Pro! 🌐', 'success');
    }, 1000);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #00ff88, #00cc6a)',
        error: 'linear-gradient(135deg, #ff4757, #cc3a47)',
        warning: 'linear-gradient(135deg, #ffa502, #cc8400)',
        info: 'linear-gradient(135deg, #00f5ff, #0099cc)'
    };
    return colors[type] || colors.info;
}

// Funciones para modales
function showModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const modalContent = getModalContent(type);
    modalTitle.textContent = modalContent.title;
    modalBody.innerHTML = modalContent.content;
    
    modal.style.display = 'block';
    
    // Cerrar modal al hacer clic fuera
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function getModalContent(type) {
    const content = {
        newShipment: {
            title: '📦 Nuevo Envío',
            content: `
                <form class="modal-form">
                    <div class="form-group">
                        <label>🏢 Cliente</label>
                        <select required>
                            <option value="">Seleccionar cliente</option>
                            <option value="client1">Importaciones Global S.A.</option>
                            <option value="client2">TechCorp Ecuador</option>
                            <option value="client3">Textiles Andinos Ltda.</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>📍 Origen</label>
                            <input type="text" placeholder="Ciudad, País" required>
                        </div>
                        <div class="form-group">
                            <label>🎯 Destino</label>
                            <input type="text" placeholder="Ciudad, País" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>🚚 Tipo de Transporte</label>
                            <select required>
                                <option value="">Seleccionar</option>
                                <option value="maritime">🚢 Marítimo</option>
                                <option value="aerial">✈️ Aéreo</option>
                                <option value="terrestrial">🚛 Terrestre</option>
                                <option value="multimodal">🌐 Multimodal</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>⚖️ Peso (kg)</label>
                            <input type="number" placeholder="0.00" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>📝 Descripción de la Carga</label>
                        <textarea placeholder="Descripción detallada..." rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                        <button type="submit" class="btn-primary">Crear Envío</button>
                    </div>
                </form>
            `
        },
        newClient: {
            title: '👥 Nuevo Cliente',
            content: `
                <form class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>🏢 Nombre/Razón Social</label>
                            <input type="text" placeholder="Ej: Importaciones Global S.A." required>
                        </div>
                        <div class="form-group">
                            <label>🏷️ Tipo de Cliente</label>
                            <select required>
                                <option value="">Seleccionar tipo</option>
                                <option value="corporativo">🏢 Corporativo</option>
                                <option value="pyme">🏪 PYME</option>
                                <option value="individual">👤 Individual</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>📧 Email</label>
                            <input type="email" placeholder="contacto@empresa.com" required>
                        </div>
                        <div class="form-group">
                            <label>📞 Teléfono</label>
                            <input type="tel" placeholder="+593 99 123 4567" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>🌍 País</label>
                        <select required>
                            <option value="">Seleccionar país</option>
                            <option value="ecuador">🇪🇨 Ecuador</option>
                            <option value="colombia">🇨🇴 Colombia</option>
                            <option value="peru">🇵🇪 Perú</option>
                            <option value="brazil">🇧🇷 Brasil</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                        <button type="submit" class="btn-primary">Registrar Cliente</button>
                    </div>
                </form>
            `
        },
        quickQuote: {
            title: '💰 Cotización Rápida',
            content: `
                <form class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>📍 Desde</label>
                            <input type="text" placeholder="Ciudad de origen" required>
                        </div>
                        <div class="form-group">
                            <label>🎯 Hasta</label>
                            <input type="text" placeholder="Ciudad de destino" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>⚖️ Peso (kg)</label>
                            <input type="number" placeholder="0.00" required>
                        </div>
                        <div class="form-group">
                            <label>📦 Dimensiones (cm)</label>
                            <input type="text" placeholder="L x A x H" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>🚚 Tipo de Servicio</label>
                        <div class="service-options">
                            <label class="service-option">
                                <input type="radio" name="service" value="standard">
                                <span>📦 Estándar (5-7 días)</span>
                            </label>
                            <label class="service-option">
                                <input type="radio" name="service" value="express">
                                <span>⚡ Express (2-3 días)</span>
                            </label>
                            <label class="service-option">
                                <input type="radio" name="service" value="overnight">
                                <span>🚀 Overnight (24h)</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                        <button type="submit" class="btn-primary">Calcular Cotización</button>
                    </div>
                </form>
            `
        }
    };
    
    return content[type] || { title: 'Modal', content: 'Contenido no disponible' };
}

// Funciones para tracking
function trackShipment(code) {
    showNotification(`🔍 Rastreando envío ${code}...`, 'info');
    // Simular redirección a página de seguimiento
    setTimeout(() => {
        window.location.href = 'pages/seguimiento.html?code=' + code;
    }, 1000);
}

function viewReport(code) {
    showNotification(`📄 Generando reporte para ${code}...`, 'info');
    // Simular generación de reporte
    setTimeout(() => {
        showNotification(`✅ Reporte de ${code} generado exitosamente`, 'success');
    }, 2000);
}

function updateStatus(code) {
    showNotification(`✏️ Abriendo editor para ${code}...`, 'info');
}

// Estilos CSS adicionales para modales
const modalStyles = `
    .modal-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-group label {
        font-weight: 600;
        color: #00f5ff;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.8rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 1rem;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #00f5ff;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
    }
    
    .service-options {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .service-option {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.8rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .service-option:hover {
        background: rgba(0, 245, 255, 0.1);
        border-color: #00f5ff;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }
    
    .btn-primary,
    .btn-secondary {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #00f5ff, #0099cc);
        color: white;
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-primary:hover,
    .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 245, 255, 0.3);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);


// Inicializar sistema de notificaciones
function initializeNotifications() {
    const notificationIcon = document.querySelector('.notifications');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', toggleNotificationsPanel);
        
        // Crear panel de notificaciones si no existe
        if (!document.getElementById('notificationsPanel')) {
            createNotificationsPanel();
        }
        
        // Simular notificaciones en tiempo real
        setInterval(addRandomNotification, 30000); // Cada 30 segundos
    }
}

// Crear panel de notificaciones
function createNotificationsPanel() {
    const panel = document.createElement('div');
    panel.id = 'notificationsPanel';
    panel.className = 'notifications-panel';
    panel.innerHTML = `
        <div class="notifications-header">
            <h3>🔔 Notificaciones</h3>
            <button class="close-notifications" onclick="closeNotificationsPanel()">×</button>
        </div>
        <div class="notifications-content">
            <div class="notification-item unread">
                <div class="notification-icon">📦</div>
                <div class="notification-content">
                    <div class="notification-title">Nuevo envío creado</div>
                    <div class="notification-text">GTX-2024-005 ha sido registrado exitosamente</div>
                    <div class="notification-time">Hace 5 minutos</div>
                </div>
            </div>
            <div class="notification-item unread">
                <div class="notification-icon">✅</div>
                <div class="notification-content">
                    <div class="notification-title">Entrega completada</div>
                    <div class="notification-text">GTX-2024-002 entregado en Quito</div>
                    <div class="notification-time">Hace 1 hora</div>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">💰</div>
                <div class="notification-content">
                    <div class="notification-title">Nueva cotización</div>
                    <div class="notification-text">Solicitud de cotización COT-2024-015</div>
                    <div class="notification-time">Hace 2 horas</div>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">👥</div>
                <div class="notification-content">
                    <div class="notification-title">Nuevo cliente registrado</div>
                    <div class="notification-text">Distribuidora Sur se ha registrado</div>
                    <div class="notification-time">Hace 3 horas</div>
                </div>
            </div>
        </div>
        <div class="notifications-footer">
            <button class="btn-secondary" onclick="markAllAsRead()">Marcar todas como leídas</button>
            <button class="btn-primary" onclick="viewAllNotifications()">Ver todas</button>
        </div>
    `;
    document.body.appendChild(panel);
}

// Mostrar/ocultar panel de notificaciones
function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    const userMenu = document.getElementById('userMenu');
    
    // Cerrar menú de usuario si está abierto
    if (userMenu && userMenu.style.display === 'block') {
        userMenu.style.display = 'none';
    }
    
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
        // Actualizar contador de notificaciones
        updateNotificationBadge();
    }
}

function closeNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    panel.style.display = 'none';
}

// Agregar notificación aleatoria
function addRandomNotification() {
    const notifications = [
        { icon: '📦', title: 'Nuevo envío', text: 'GTX-2024-' + Math.floor(Math.random() * 1000) + ' registrado' },
        { icon: '✅', title: 'Entrega completada', text: 'Envío entregado exitosamente' },
        { icon: '💰', title: 'Nueva cotización', text: 'Solicitud de cotización recibida' },
        { icon: '⚠️', title: 'Alerta de retraso', text: 'Envío con posible retraso' },
        { icon: '📊', title: 'Reporte generado', text: 'Reporte mensual disponible' }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    // Incrementar contador
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
        badge.style.display = 'block';
    }
    
    // Mostrar notificación toast
    showNotification(`${randomNotification.icon} ${randomNotification.title}: ${randomNotification.text}`, 'info');
}

// Actualizar contador de notificaciones
function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Marcar todas las notificaciones como leídas
function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    updateNotificationBadge();
    showNotification('✅ Todas las notificaciones marcadas como leídas', 'success');
}

// Ver todas las notificaciones
function viewAllNotifications() {
    showNotification('📋 Abriendo panel completo de notificaciones...', 'info');
    closeNotificationsPanel();
}

// Inicializar menú de usuario
function initializeUserMenu() {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', toggleUserMenu);
        
        // Crear menú de usuario si no existe
        if (!document.getElementById('userMenu')) {
            createUserMenu();
        }
    }
}

// Crear menú de usuario
function createUserMenu() {
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <div class="user-info">
                <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%2300f5ff'/><text x='50' y='60' text-anchor='middle' font-size='40' fill='white'>👤</text></svg>" alt="Avatar" class="user-menu-avatar">
                <div class="user-details">
                    <div class="user-menu-name">Administrador</div>
                    <div class="user-menu-role">Administrator</div>
                    <div class="user-menu-email">admin@globaltradepro.com</div>
                </div>
            </div>
        </div>
        <div class="user-menu-content">
            <div class="menu-section">
                <div class="menu-item" onclick="viewProfile()">
                    <span class="menu-icon">👤</span>
                    <span class="menu-text">Mi Perfil</span>
                </div>
                <div class="menu-item" onclick="viewSettings()">
                    <span class="menu-icon">⚙️</span>
                    <span class="menu-text">Configuración</span>
                </div>
                <div class="menu-item" onclick="viewNotifications()">
                    <span class="menu-icon">🔔</span>
                    <span class="menu-text">Notificaciones</span>
                    <span class="menu-badge">3</span>
                </div>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-section">
                <div class="menu-item" onclick="viewHelp()">
                    <span class="menu-icon">❓</span>
                    <span class="menu-text">Ayuda y Soporte</span>
                </div>
                <div class="menu-item" onclick="viewDocs()">
                    <span class="menu-icon">📚</span>
                    <span class="menu-text">Documentación</span>
                </div>
                <div class="menu-item" onclick="reportBug()">
                    <span class="menu-icon">🐛</span>
                    <span class="menu-text">Reportar Problema</span>
                </div>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-section">
                <div class="menu-item" onclick="switchAccount()">
                    <span class="menu-icon">🔄</span>
                    <span class="menu-text">Cambiar Cuenta</span>
                </div>
                <div class="menu-item logout" onclick="logout()">
                    <span class="menu-icon">🚪</span>
                    <span class="menu-text">Cerrar Sesión</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(menu);
}

// Mostrar/ocultar menú de usuario
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    const notificationsPanel = document.getElementById('notificationsPanel');
    
    // Cerrar panel de notificaciones si está abierto
    if (notificationsPanel && notificationsPanel.style.display === 'block') {
        notificationsPanel.style.display = 'none';
    }
    
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Funciones del menú de usuario
function viewProfile() {
    window.location.href = 'pages/configuracion.html';
    closeUserMenu();
}

function viewSettings() {
    window.location.href = 'pages/configuracion.html';
    closeUserMenu();
}

function viewNotifications() {
    toggleNotificationsPanel();
    closeUserMenu();
}

function viewHelp() {
    showNotification('❓ Abriendo centro de ayuda...', 'info');
    closeUserMenu();
}

function viewDocs() {
    showNotification('📚 Abriendo documentación...', 'info');
    closeUserMenu();
}

function reportBug() {
    showNotification('🐛 Abriendo formulario de reporte...', 'info');
    closeUserMenu();
}

function switchAccount() {
    showNotification('🔄 Función de cambio de cuenta en desarrollo', 'info');
    closeUserMenu();
}

function logout() {
    showNotification('🚪 Cerrando sesión...', 'info');
    setTimeout(() => {
        showNotification('✅ Sesión cerrada exitosamente', 'success');
    }, 1500);
    closeUserMenu();
}

function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.style.display = 'none';
}

// Cerrar menús al hacer clic fuera
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const userProfile = document.querySelector('.user-profile');
    const notifications = document.querySelector('.notifications');
    
    // Cerrar menú de usuario si se hace clic fuera
    if (userMenu && userMenu.style.display === 'block' && 
        !userProfile.contains(event.target) && 
        !userMenu.contains(event.target)) {
        userMenu.style.display = 'none';
    }
    
    // Cerrar panel de notificaciones si se hace clic fuera
    if (notificationsPanel && notificationsPanel.style.display === 'block' && 
        !notifications.contains(event.target) && 
        !notificationsPanel.contains(event.target)) {
        notificationsPanel.style.display = 'none';
    }
});

// Estilos CSS para notificaciones y menú de usuario
const userInterfaceStyles = `
    /* Estilos para panel de notificaciones */
    .notifications-panel {
        position: fixed;
        top: 70px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: none;
        overflow: hidden;
    }
    
    .notifications-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 245, 255, 0.1);
    }
    
    .notifications-header h3 {
        margin: 0;
        color: #00f5ff;
        font-size: 1.1rem;
    }
    
    .close-notifications {
        background: none;
        border: none;
        color: #ccc;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .close-notifications:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .notifications-content {
        max-height: 300px;
        overflow-y: auto;
        padding: 0.5rem 0;
    }
    
    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .notification-item:hover {
        background: rgba(0, 245, 255, 0.05);
    }
    
    .notification-item.unread {
        background: rgba(0, 245, 255, 0.1);
    }
    
    .notification-item.unread::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #00f5ff;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        min-width: 24px;
        text-align: center;
    }
    
    .notification-title {
        font-weight: 600;
        color: white;
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
    }
    
    .notification-text {
        color: #ccc;
        font-size: 0.8rem;
        margin-bottom: 0.3rem;
        line-height: 1.3;
    }
    
    .notification-time {
        color: #888;
        font-size: 0.7rem;
    }
    
    .notifications-footer {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.3);
    }
    
    .notifications-footer button {
        flex: 1;
        padding: 0.5rem;
        font-size: 0.8rem;
    }
    
    /* Estilos para menú de usuario */
    .user-menu {
        position: fixed;
        top: 70px;
        right: 20px;
        width: 280px;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: none;
        overflow: hidden;
    }
    
    .user-menu-header {
        padding: 1.5rem;
        background: rgba(0, 245, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .user-menu-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid rgba(0, 245, 255, 0.5);
    }
    
    .user-menu-name {
        font-weight: 600;
        color: white;
        margin-bottom: 0.2rem;
    }
    
    .user-menu-role {
        font-size: 0.8rem;
        color: #00f5ff;
        margin-bottom: 0.2rem;
    }
    
    .user-menu-email {
        font-size: 0.7rem;
        color: #888;
    }
    
    .user-menu-content {
        padding: 0.5rem 0;
    }
    
    .menu-section {
        padding: 0.5rem 0;
    }
    
    .menu-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .menu-item:hover {
        background: rgba(0, 245, 255, 0.1);
    }
    
    .menu-item.logout:hover {
        background: rgba(255, 71, 87, 0.1);
        color: #ff4757;
    }
    
    .menu-icon {
        font-size: 1.1rem;
        min-width: 20px;
        text-align: center;
    }
    
    .menu-text {
        flex: 1;
        font-size: 0.9rem;
        color: #ccc;
    }
    
    .menu-badge {
        background: #ff6b35;
        color: white;
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
    }
    
    .menu-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 0.5rem 1.5rem;
    }
    
    /* Responsivo */
    @media (max-width: 768px) {
        .notifications-panel,
        .user-menu {
            right: 10px;
            width: calc(100vw - 20px);
            max-width: 350px;
        }
    }
    
    /* Animaciones */
    .notifications-panel,
    .user-menu {
        animation: slideInFromTop 0.3s ease-out;
    }
    
    @keyframes slideInFromTop {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Agregar estilos de interfaz de usuario
const userInterfaceStyleSheet = document.createElement('style');
userInterfaceStyleSheet.textContent = userInterfaceStyles;
document.head.appendChild(userInterfaceStyleSheet);

