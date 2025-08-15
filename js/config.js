// JavaScript específico para la página de configuración

// Configuraciones por defecto
const defaultSettings = {
    profile: {
        fullName: 'Administrador del Sistema',
        email: 'admin@globaltradepro.com',
        phone: '+593 2 123-4567',
        position: 'Administrador',
        company: 'GlobalTrade Pro',
        timezone: 'America/Guayaquil'
    },
    system: {
        language: 'es',
        dateFormat: 'dd/mm/yyyy',
        currency: 'USD',
        theme: 'dark',
        autoRefresh: true,
        animations: true,
        detailedNumbers: false
    },
    notifications: {
        emailNewShipments: true,
        emailDeliveries: true,
        emailQuotes: true,
        emailNewClients: false,
        browserNotifications: true,
        notificationSounds: false,
        reminders: true
    },
    security: {
        autoLock: true,
        activityLog: true,
        unknownIP: false
    },
    advanced: {
        debugMode: false,
        performanceMode: true,
        advancedAnalytics: false
    }
};

// Inicialización específica de la página de configuración
document.addEventListener('DOMContentLoaded', function() {
    initializeConfigPage();
    loadSettings();
});

function initializeConfigPage() {
    // Configurar eventos de las pestañas
    setupTabEvents();
    
    // Configurar eventos de formularios
    setupFormEvents();
    
    // Mostrar sección de perfil por defecto
    showConfigSection('profile');
}

function setupTabEvents() {
    const tabs = document.querySelectorAll('.config-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const section = this.onclick.toString().match(/'([^']+)'/)[1];
            showConfigSection(section);
        });
    });
}

function setupFormEvents() {
    // Eventos para inputs de texto
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    textInputs.forEach(input => {
        input.addEventListener('change', saveSettingValue);
    });
    
    // Eventos para selects
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', saveSettingValue);
    });
    
    // Eventos para checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveSettingValue);
    });
    
    // Eventos para radio buttons
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', saveSettingValue);
    });
}

// Mostrar sección de configuración
function showConfigSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.config-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover clase active de todas las pestañas
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar la pestaña correspondiente
    const targetTab = document.querySelector(`[onclick*="${sectionName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Cargar configuraciones guardadas
function loadSettings() {
    const savedSettings = localStorage.getItem('globalTradeSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    
    // Cargar configuraciones en los elementos del formulario
    Object.keys(settings).forEach(category => {
        Object.keys(settings[category]).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[category][key];
                } else if (element.type === 'radio') {
                    if (element.value === settings[category][key]) {
                        element.checked = true;
                    }
                } else {
                    element.value = settings[category][key];
                }
            }
        });
    });
}

// Guardar valor de configuración individual
function saveSettingValue(event) {
    const element = event.target;
    const key = element.id;
    let value;
    
    if (element.type === 'checkbox') {
        value = element.checked;
    } else if (element.type === 'radio') {
        value = element.value;
    } else {
        value = element.value;
    }
    
    // Guardar en localStorage
    const savedSettings = localStorage.getItem('globalTradeSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    
    // Encontrar la categoría correcta
    let category = null;
    Object.keys(settings).forEach(cat => {
        if (settings[cat].hasOwnProperty(key)) {
            category = cat;
        }
    });
    
    if (category) {
        settings[category][key] = value;
        localStorage.setItem('globalTradeSettings', JSON.stringify(settings));
        
        showNotification(`✅ Configuración "${key}" guardada`, 'success');
        
        // Aplicar cambios inmediatamente si es necesario
        applySettingChange(key, value);
    }
}

// Aplicar cambios de configuración inmediatamente
function applySettingChange(key, value) {
    switch(key) {
        case 'theme':
            applyTheme(value);
            break;
        case 'language':
            showNotification('🌐 Idioma cambiado. Recarga la página para ver los cambios.', 'info');
            break;
        case 'animations':
            toggleAnimations(value);
            break;
        case 'autoRefresh':
            toggleAutoRefresh(value);
            break;
    }
}

function applyTheme(theme) {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    showNotification(`🎨 Tema ${theme === 'light' ? 'claro' : 'oscuro'} aplicado`, 'success');
}

function toggleAnimations(enabled) {
    document.body.style.setProperty('--animation-duration', enabled ? '0.3s' : '0s');
}

function toggleAutoRefresh(enabled) {
    if (enabled) {
        showNotification('📈 Actualización automática activada', 'success');
    } else {
        showNotification('⏸️ Actualización automática desactivada', 'info');
    }
}

// Guardar todas las configuraciones
function saveAllSettings() {
    showNotification('💾 Guardando todas las configuraciones...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Todas las configuraciones guardadas exitosamente', 'success');
    }, 1500);
}

// Restaurar configuraciones por defecto
function resetSettings() {
    showModal('confirmReset');
}

function confirmResetSettings() {
    localStorage.setItem('globalTradeSettings', JSON.stringify(defaultSettings));
    loadSettings();
    closeModal();
    showNotification('🔄 Configuraciones restauradas a valores por defecto', 'success');
}

// Funciones de perfil
function changeAvatar() {
    showNotification('📷 Función de cambio de avatar en desarrollo', 'info');
}

function removeAvatar() {
    const avatarPreview = document.getElementById('avatarPreview');
    avatarPreview.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23666'/><text x='50' y='60' text-anchor='middle' font-size='40' fill='white'>👤</text></svg>";
    showNotification('🗑️ Avatar eliminado', 'success');
}

// Funciones de seguridad
function changePassword() {
    showModal('changePassword');
}

function setup2FA() {
    showNotification('📱 Configuración de 2FA en desarrollo', 'info');
}

function viewSessions() {
    showModal('activeSessions');
}

// Funciones de integraciones
function connectService(service) {
    showNotification(`🔗 Conectando con ${service}...`, 'info');
    
    setTimeout(() => {
        showNotification(`✅ ${service} conectado exitosamente`, 'success');
        updateIntegrationStatus(service, 'connected');
    }, 2000);
}

function disconnectService(service) {
    showNotification(`🔌 Desconectando ${service}...`, 'info');
    
    setTimeout(() => {
        showNotification(`❌ ${service} desconectado`, 'info');
        updateIntegrationStatus(service, 'disconnected');
    }, 1500);
}

function updateIntegrationStatus(service, status) {
    // Actualizar el estado visual de la integración
    const integrationItems = document.querySelectorAll('.integration-item');
    integrationItems.forEach(item => {
        const serviceName = item.querySelector('.integration-name').textContent.toLowerCase();
        if (serviceName.includes(service.toLowerCase())) {
            const statusElement = item.querySelector('.integration-status');
            const button = item.querySelector('button');
            
            statusElement.className = `integration-status ${status}`;
            statusElement.textContent = status === 'connected' ? 'Conectado' : 'Desconectado';
            
            button.className = status === 'connected' ? 'btn-small disconnect' : 'btn-small connect';
            button.textContent = status === 'connected' ? 'Desconectar' : 'Conectar';
            button.onclick = status === 'connected' ? 
                () => disconnectService(service) : 
                () => connectService(service);
        }
    });
}

// Funciones de API
function copyApiKey(type) {
    const apiKey = type === 'main' ? 
        'gt_live_sk_1234567890abcdef1234567890abcdef' : 
        'gt_test_sk_abcdef1234567890abcdef1234567890';
    
    navigator.clipboard.writeText(apiKey).then(() => {
        showNotification('📋 API Key copiada al portapapeles', 'success');
    });
}

function regenerateApiKey(type) {
    showNotification(`🔄 Regenerando API Key ${type}...`, 'info');
    
    setTimeout(() => {
        showNotification(`✅ API Key ${type} regenerada exitosamente`, 'success');
    }, 2000);
}

function createApiKey() {
    showModal('createApiKey');
}

// Funciones avanzadas
function exportData() {
    showNotification('📤 Preparando exportación de datos...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Datos exportados exitosamente', 'success');
    }, 3000);
}

function importData() {
    showNotification('📥 Función de importación en desarrollo', 'info');
}

function createBackup() {
    showNotification('💾 Creando respaldo...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Respaldo creado exitosamente', 'success');
    }, 2500);
}

// Extender la función showModal para incluir modales específicos de configuración
const originalShowModal = window.showModal;
window.showModal = function(type, data = null) {
    switch(type) {
        case 'confirmReset':
            showResetModal();
            break;
        case 'changePassword':
            showPasswordModal();
            break;
        case 'activeSessions':
            showSessionsModal();
            break;
        case 'createApiKey':
            showApiKeyModal();
            break;
        default:
            if (originalShowModal) {
                originalShowModal(type, data);
            }
            break;
    }
};

function showResetModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = '🔄 Restaurar Configuraciones';
    modalBody.innerHTML = `
        <div class="modal-content-text">
            <p>¿Estás seguro de que quieres restaurar todas las configuraciones a sus valores por defecto?</p>
            <p><strong>Esta acción no se puede deshacer.</strong></p>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn-danger" onclick="confirmResetSettings()">🔄 Restaurar</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showPasswordModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = '🔐 Cambiar Contraseña';
    modalBody.innerHTML = `
        <form class="modal-form" onsubmit="updatePassword(event)">
            <div class="input-group">
                <label>Contraseña actual</label>
                <input type="password" name="currentPassword" required>
            </div>
            <div class="input-group">
                <label>Nueva contraseña</label>
                <input type="password" name="newPassword" required minlength="8">
            </div>
            <div class="input-group">
                <label>Confirmar nueva contraseña</label>
                <input type="password" name="confirmPassword" required minlength="8">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">🔐 Cambiar Contraseña</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
}

function showSessionsModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = '💻 Sesiones Activas';
    modalBody.innerHTML = `
        <div class="sessions-list">
            <div class="session-item current">
                <div class="session-info">
                    <div class="session-device">💻 Navegador Actual</div>
                    <div class="session-details">Chrome en Windows • 192.168.1.100</div>
                    <div class="session-time">Activa ahora</div>
                </div>
                <span class="session-badge current">Actual</span>
            </div>
            <div class="session-item">
                <div class="session-info">
                    <div class="session-device">📱 Móvil</div>
                    <div class="session-details">Safari en iPhone • 192.168.1.105</div>
                    <div class="session-time">Hace 2 horas</div>
                </div>
                <button class="btn-small danger" onclick="terminateSession('mobile')">Terminar</button>
            </div>
            <div class="session-item">
                <div class="session-info">
                    <div class="session-device">💻 Oficina</div>
                    <div class="session-details">Firefox en Linux • 10.0.0.50</div>
                    <div class="session-time">Ayer</div>
                </div>
                <button class="btn-small danger" onclick="terminateSession('office')">Terminar</button>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
            <button class="btn-danger" onclick="terminateAllSessions()">🚫 Terminar Todas</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showApiKeyModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = '🔑 Crear Nueva API Key';
    modalBody.innerHTML = `
        <form class="modal-form" onsubmit="generateApiKey(event)">
            <div class="input-group">
                <label>Nombre de la API Key</label>
                <input type="text" name="keyName" placeholder="Ej: Integración Mobile App" required>
            </div>
            <div class="input-group">
                <label>Tipo de acceso</label>
                <select name="accessType" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="read">Solo lectura</option>
                    <option value="write">Lectura y escritura</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <div class="input-group">
                <label>Fecha de expiración (opcional)</label>
                <input type="date" name="expirationDate">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">🔑 Crear API Key</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
}

function updatePassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    if (newPassword !== confirmPassword) {
        showNotification('❌ Las contraseñas no coinciden', 'error');
        return;
    }
    
    showNotification('🔐 Actualizando contraseña...', 'info');
    closeModal();
    
    setTimeout(() => {
        showNotification('✅ Contraseña actualizada exitosamente', 'success');
    }, 2000);
}

function terminateSession(sessionId) {
    showNotification(`🚫 Terminando sesión ${sessionId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Sesión terminada', 'success');
        // Aquí se actualizaría la lista de sesiones
    }, 1500);
}

function terminateAllSessions() {
    showNotification('🚫 Terminando todas las sesiones...', 'info');
    closeModal();
    
    setTimeout(() => {
        showNotification('✅ Todas las sesiones terminadas', 'success');
    }, 2000);
}

function generateApiKey(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const keyName = formData.get('keyName');
    
    showNotification(`🔑 Generando API Key "${keyName}"...`, 'info');
    closeModal();
    
    setTimeout(() => {
        showNotification('✅ API Key creada exitosamente', 'success');
    }, 2000);
}

// Estilos CSS adicionales para configuración
const configStyles = `
    .config-navigation {
        margin-bottom: 2rem;
    }
    
    .config-tabs {
        display: flex;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 0.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
        overflow-x: auto;
    }
    
    .config-tab {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.2rem;
        border: none;
        border-radius: 10px;
        background: transparent;
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        font-size: 0.9rem;
    }
    
    .config-tab.active,
    .config-tab:hover {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
    }
    
    .tab-icon {
        font-size: 1.1rem;
    }
    
    .config-section {
        display: none;
    }
    
    .config-section.active {
        display: block;
    }
    
    .section-header {
        margin-bottom: 2rem;
    }
    
    .section-header h3 {
        color: #00f5ff;
        margin-bottom: 0.5rem;
    }
    
    .section-header p {
        color: #ccc;
    }
    
    .config-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
    }
    
    .config-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .config-card h4 {
        color: #00f5ff;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .config-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .input-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #ccc;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .input-group input,
    .input-group select {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 0.9rem;
    }
    
    .input-group input:focus,
    .input-group select:focus {
        outline: none;
        border-color: #00f5ff;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
    }
    
    .avatar-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .current-avatar img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid rgba(0, 245, 255, 0.3);
    }
    
    .avatar-controls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .theme-selection {
        margin-top: 1rem;
    }
    
    .theme-options {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .theme-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }
    
    .theme-option input[type="radio"] {
        display: none;
    }
    
    .theme-preview {
        display: flex;
        width: 60px;
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .theme-option input[type="radio"]:checked + .theme-preview {
        border-color: #00f5ff;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
    }
    
    .theme-color {
        flex: 1;
    }
    
    .settings-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .setting-title {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .setting-desc {
        font-size: 0.8rem;
        color: #888;
    }
    
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.2);
        transition: 0.3s;
        border-radius: 24px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: #00f5ff;
    }
    
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    
    .security-actions,
    .advanced-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .security-btn,
    .advanced-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }
    
    .security-btn:hover,
    .advanced-btn:hover {
        border-color: #00f5ff;
        background: rgba(0, 245, 255, 0.1);
    }
    
    .btn-icon {
        font-size: 1.5rem;
        min-width: 30px;
        text-align: center;
    }
    
    .btn-title {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .btn-desc {
        font-size: 0.8rem;
        color: #888;
    }
    
    .integrations-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .integration-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .integration-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .integration-icon {
        font-size: 1.5rem;
        min-width: 30px;
        text-align: center;
    }
    
    .integration-name {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .integration-status {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-weight: 500;
    }
    
    .integration-status.connected {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
    }
    
    .integration-status.disconnected {
        background: rgba(255, 255, 255, 0.2);
        color: #888;
    }
    
    .btn-small.connect {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
    }
    
    .btn-small.disconnect {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
    }
    
    .api-keys {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .api-key-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .api-name {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .api-key {
        font-family: monospace;
        font-size: 0.8rem;
        color: #888;
    }
    
    .api-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    /* Estilos para modales específicos */
    .sessions-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .session-item.current {
        border: 1px solid rgba(0, 245, 255, 0.3);
    }
    
    .session-device {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .session-details {
        font-size: 0.8rem;
        color: #888;
        margin-bottom: 0.2rem;
    }
    
    .session-time {
        font-size: 0.7rem;
        color: #666;
    }
    
    .session-badge {
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 500;
    }
    
    .session-badge.current {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
    }
    
    .btn-small.danger {
        background: rgba(255, 71, 87, 0.2);
        color: #ff4757;
    }
    
    .btn-danger {
        background: linear-gradient(135deg, #ff4757, #ff3742);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-danger:hover {
        background: linear-gradient(135deg, #ff3742, #ff2838);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
    }
    
    @media (max-width: 768px) {
        .config-tabs {
            flex-wrap: wrap;
        }
        
        .config-grid {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .avatar-section {
            flex-direction: column;
            text-align: center;
        }
        
        .theme-options {
            justify-content: center;
        }
        
        .integration-item,
        .session-item,
        .api-key-item {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .api-actions {
            justify-content: center;
        }
    }
`;

// Agregar estilos específicos de configuración
const configStyleSheet = document.createElement('style');
configStyleSheet.textContent = configStyles;
document.head.appendChild(configStyleSheet);

