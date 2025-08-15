// JavaScript específico para la página de clientes

// Datos de ejemplo de clientes
const clientsData = [
    {
        id: 'CLI-001',
        name: 'Importaciones Global S.A.',
        type: 'corporativo',
        country: 'ecuador',
        email: 'contacto@global.com',
        phone: '+593 2 123-4567',
        shipments: 47,
        status: 'active',
        avatar: '🏢'
    },
    {
        id: 'CLI-002',
        name: 'TechCorp Ecuador',
        type: 'pyme',
        country: 'colombia',
        email: 'info@techcorp.co',
        phone: '+57 1 987-6543',
        shipments: 23,
        status: 'active',
        avatar: '🏪'
    },
    {
        id: 'CLI-003',
        name: 'Textiles Andinos Ltda.',
        type: 'individual',
        country: 'peru',
        email: 'ventas@textiles.pe',
        phone: '+51 1 456-7890',
        shipments: 12,
        status: 'pending',
        avatar: '👤'
    },
    {
        id: 'CLI-004',
        name: 'Electrónicos del Futuro',
        type: 'corporativo',
        country: 'brazil',
        email: 'ventas@electronicosf.br',
        phone: '+55 11 2345-6789',
        shipments: 89,
        status: 'active',
        avatar: '🏢'
    },
    {
        id: 'CLI-005',
        name: 'Distribuidora Norte',
        type: 'pyme',
        country: 'mexico',
        email: 'contacto@distnorte.mx',
        phone: '+52 55 3456-7890',
        shipments: 34,
        status: 'inactive',
        avatar: '🏪'
    }
];

// Inicialización específica de la página de clientes
document.addEventListener('DOMContentLoaded', function() {
    generateClientCards();
    updateClientStats();
});

// Filtrar clientes
function filterClients() {
    const searchTerm = document.getElementById('clientSearch').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const countryFilter = document.getElementById('countryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const tableRows = document.querySelectorAll('#clientsTableBody tr');
    
    tableRows.forEach(row => {
        const clientName = row.querySelector('strong').textContent.toLowerCase();
        const clientType = row.getAttribute('data-type');
        const clientCountry = row.getAttribute('data-country');
        const clientStatus = row.getAttribute('data-status');
        
        const matchesSearch = clientName.includes(searchTerm);
        const matchesType = !typeFilter || clientType === typeFilter;
        const matchesCountry = !countryFilter || clientCountry === countryFilter;
        const matchesStatus = !statusFilter || clientStatus === statusFilter;
        
        if (matchesSearch && matchesType && matchesCountry && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // También filtrar las tarjetas si están visibles
    if (document.getElementById('cardsView').style.display !== 'none') {
        filterClientCards(searchTerm, typeFilter, countryFilter, statusFilter);
    }
}

// Filtrar tarjetas de clientes
function filterClientCards(searchTerm, typeFilter, countryFilter, statusFilter) {
    const cards = document.querySelectorAll('.client-card');
    
    cards.forEach(card => {
        const clientName = card.querySelector('.card-title').textContent.toLowerCase();
        const clientType = card.getAttribute('data-type');
        const clientCountry = card.getAttribute('data-country');
        const clientStatus = card.getAttribute('data-status');
        
        const matchesSearch = clientName.includes(searchTerm);
        const matchesType = !typeFilter || clientType === typeFilter;
        const matchesCountry = !countryFilter || clientCountry === countryFilter;
        const matchesStatus = !statusFilter || clientStatus === statusFilter;
        
        if (matchesSearch && matchesType && matchesCountry && matchesStatus) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Cambiar vista entre tabla y tarjetas
function switchView(viewType) {
    const tableView = document.getElementById('tableView');
    const cardsView = document.getElementById('cardsView');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Remover clase active de todos los botones
    viewButtons.forEach(btn => btn.classList.remove('active'));
    
    if (viewType === 'table') {
        tableView.style.display = 'block';
        cardsView.style.display = 'none';
        document.querySelector('.view-btn[onclick="switchView(\'table\')"]').classList.add('active');
    } else {
        tableView.style.display = 'none';
        cardsView.style.display = 'block';
        document.querySelector('.view-btn[onclick="switchView(\'cards\')"]').classList.add('active');
        generateClientCards();
    }
}

// Generar tarjetas de clientes
function generateClientCards() {
    const cardsGrid = document.getElementById('clientsCardsGrid');
    if (!cardsGrid) return;
    
    cardsGrid.innerHTML = '';
    
    clientsData.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.setAttribute('data-type', client.type);
        card.setAttribute('data-country', client.country);
        card.setAttribute('data-status', client.status);
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-avatar">${client.avatar}</div>
                <div class="card-status">
                    <span class="status ${client.status}">${getStatusIcon(client.status)} ${getStatusText(client.status)}</span>
                </div>
            </div>
            <div class="card-body">
                <h4 class="card-title">${client.name}</h4>
                <div class="card-id">ID: ${client.id}</div>
                <div class="card-details">
                    <div class="detail-item">
                        <span class="detail-label">Tipo:</span>
                        <span class="type-badge ${client.type}">${getTypeIcon(client.type)} ${getTypeText(client.type)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">País:</span>
                        <span>${getCountryFlag(client.country)} ${getCountryName(client.country)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Envíos:</span>
                        <span class="shipment-count">${client.shipments}</span>
                    </div>
                </div>
                <div class="card-contact">
                    <div>📧 ${client.email}</div>
                    <div>📞 ${client.phone}</div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-small view" onclick="viewClient('${client.id}')">👁️ Ver</button>
                <button class="btn-small edit" onclick="editClient('${client.id}')">✏️ Editar</button>
                <button class="btn-small history" onclick="clientHistory('${client.id}')">📋 Historial</button>
            </div>
        `;
        
        cardsGrid.appendChild(card);
    });
}

// Funciones auxiliares para obtener textos e iconos
function getStatusIcon(status) {
    const icons = {
        active: '✅',
        inactive: '⏸️',
        pending: '⏳'
    };
    return icons[status] || '❓';
}

function getStatusText(status) {
    const texts = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente'
    };
    return texts[status] || 'Desconocido';
}

function getTypeIcon(type) {
    const icons = {
        corporativo: '🏢',
        pyme: '🏪',
        individual: '👤',
        government: '🏛️'
    };
    return icons[type] || '❓';
}

function getTypeText(type) {
    const texts = {
        corporativo: 'Corporativo',
        pyme: 'PYME',
        individual: 'Individual',
        government: 'Gubernamental'
    };
    return texts[type] || 'Desconocido';
}

function getCountryFlag(country) {
    const flags = {
        ecuador: '🇪🇨',
        colombia: '🇨🇴',
        peru: '🇵🇪',
        brazil: '🇧🇷',
        mexico: '🇲🇽',
        chile: '🇨🇱',
        argentina: '🇦🇷'
    };
    return flags[country] || '🌍';
}

function getCountryName(country) {
    const names = {
        ecuador: 'Ecuador',
        colombia: 'Colombia',
        peru: 'Perú',
        brazil: 'Brasil',
        mexico: 'México',
        chile: 'Chile',
        argentina: 'Argentina'
    };
    return names[country] || 'Desconocido';
}

// Actualizar estadísticas de clientes
function updateClientStats() {
    const totalClients = clientsData.length;
    const activeClients = clientsData.filter(c => c.status === 'active').length;
    const corporateClients = clientsData.filter(c => c.type === 'corporativo').length;
    const countries = [...new Set(clientsData.map(c => c.country))].length;
    
    // Actualizar los números en las tarjetas de estadísticas
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.client-stats .stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = totalClients;
            statNumbers[1].textContent = activeClients;
            statNumbers[2].textContent = corporateClients;
            statNumbers[3].textContent = countries;
        }
    }, 500);
}

// Funciones de acciones de clientes
function viewClient(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    
    showModal('viewClient', client);
    showNotification(`👁️ Visualizando perfil de ${client.name}`, 'info');
}

function editClient(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    
    showModal('editClient', client);
    showNotification(`✏️ Editando cliente ${client.name}`, 'info');
}

function clientHistory(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    
    showModal('clientHistory', client);
    showNotification(`📋 Cargando historial de ${client.name}`, 'info');
}

function exportClients() {
    showNotification('📤 Exportando lista de clientes...', 'info');
    
    // Simular exportación
    setTimeout(() => {
        showNotification('✅ Lista de clientes exportada exitosamente', 'success');
    }, 2000);
}

// Extender la función showModal para incluir modales específicos de clientes
const originalShowModal = window.showModal;
window.showModal = function(type, data = null) {
    if (type === 'viewClient' || type === 'editClient' || type === 'clientHistory') {
        showClientModal(type, data);
    } else {
        originalShowModal(type);
    }
};

function showClientModal(type, client) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const modalContent = getClientModalContent(type, client);
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

function getClientModalContent(type, client) {
    const content = {
        viewClient: {
            title: `👁️ Perfil de ${client.name}`,
            content: `
                <div class="client-profile">
                    <div class="profile-header">
                        <div class="profile-avatar">${client.avatar}</div>
                        <div class="profile-info">
                            <h3>${client.name}</h3>
                            <div class="profile-id">ID: ${client.id}</div>
                            <span class="status ${client.status}">${getStatusIcon(client.status)} ${getStatusText(client.status)}</span>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <div class="detail-section">
                            <h4>📋 Información General</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Tipo de Cliente:</label>
                                    <span class="type-badge ${client.type}">${getTypeIcon(client.type)} ${getTypeText(client.type)}</span>
                                </div>
                                <div class="detail-item">
                                    <label>País:</label>
                                    <span>${getCountryFlag(client.country)} ${getCountryName(client.country)}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Total de Envíos:</label>
                                    <span class="shipment-count">${client.shipments}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>📞 Información de Contacto</h4>
                            <div class="contact-info">
                                <div class="contact-item">
                                    <span class="contact-icon">📧</span>
                                    <span>${client.email}</span>
                                </div>
                                <div class="contact-item">
                                    <span class="contact-icon">📞</span>
                                    <span>${client.phone}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>📊 Estadísticas</h4>
                            <div class="stats-mini">
                                <div class="stat-mini">
                                    <div class="stat-mini-number">${client.shipments}</div>
                                    <div class="stat-mini-label">Envíos Totales</div>
                                </div>
                                <div class="stat-mini">
                                    <div class="stat-mini-number">${Math.floor(Math.random() * 50) + 10}</div>
                                    <div class="stat-mini-label">Este Año</div>
                                </div>
                                <div class="stat-mini">
                                    <div class="stat-mini-number">${Math.floor(Math.random() * 10) + 1}</div>
                                    <div class="stat-mini-label">Este Mes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn-primary" onclick="editClient('${client.id}'); closeModal();">✏️ Editar Cliente</button>
                        <button class="btn-secondary" onclick="clientHistory('${client.id}'); closeModal();">📋 Ver Historial</button>
                        <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
                    </div>
                </div>
            `
        },
        editClient: {
            title: `✏️ Editar ${client.name}`,
            content: `
                <form class="modal-form" onsubmit="saveClient(event, '${client.id}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label>🏢 Nombre/Razón Social</label>
                            <input type="text" value="${client.name}" required>
                        </div>
                        <div class="form-group">
                            <label>🏷️ Tipo de Cliente</label>
                            <select required>
                                <option value="corporativo" ${client.type === 'corporativo' ? 'selected' : ''}>🏢 Corporativo</option>
                                <option value="pyme" ${client.type === 'pyme' ? 'selected' : ''}>🏪 PYME</option>
                                <option value="individual" ${client.type === 'individual' ? 'selected' : ''}>👤 Individual</option>
                                <option value="government" ${client.type === 'government' ? 'selected' : ''}>🏛️ Gubernamental</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>📧 Email</label>
                            <input type="email" value="${client.email}" required>
                        </div>
                        <div class="form-group">
                            <label>📞 Teléfono</label>
                            <input type="tel" value="${client.phone}" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>🌍 País</label>
                            <select required>
                                <option value="ecuador" ${client.country === 'ecuador' ? 'selected' : ''}>🇪🇨 Ecuador</option>
                                <option value="colombia" ${client.country === 'colombia' ? 'selected' : ''}>🇨🇴 Colombia</option>
                                <option value="peru" ${client.country === 'peru' ? 'selected' : ''}>🇵🇪 Perú</option>
                                <option value="brazil" ${client.country === 'brazil' ? 'selected' : ''}>🇧🇷 Brasil</option>
                                <option value="mexico" ${client.country === 'mexico' ? 'selected' : ''}>🇲🇽 México</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>📊 Estado</label>
                            <select required>
                                <option value="active" ${client.status === 'active' ? 'selected' : ''}>✅ Activo</option>
                                <option value="inactive" ${client.status === 'inactive' ? 'selected' : ''}>⏸️ Inactivo</option>
                                <option value="pending" ${client.status === 'pending' ? 'selected' : ''}>⏳ Pendiente</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                        <button type="submit" class="btn-primary">💾 Guardar Cambios</button>
                    </div>
                </form>
            `
        },
        clientHistory: {
            title: `📋 Historial de ${client.name}`,
            content: `
                <div class="client-history">
                    <div class="history-stats">
                        <div class="history-stat">
                            <div class="history-stat-number">${client.shipments}</div>
                            <div class="history-stat-label">Envíos Totales</div>
                        </div>
                        <div class="history-stat">
                            <div class="history-stat-number">$${(client.shipments * 1250).toLocaleString()}</div>
                            <div class="history-stat-label">Facturación Total</div>
                        </div>
                        <div class="history-stat">
                            <div class="history-stat-number">${Math.floor(client.shipments * 0.95)}</div>
                            <div class="history-stat-label">Entregas Exitosas</div>
                        </div>
                    </div>
                    
                    <div class="history-timeline">
                        <h4>📅 Actividad Reciente</h4>
                        <div class="timeline">
                            <div class="timeline-item">
                                <div class="timeline-date">15 Dic 2024</div>
                                <div class="timeline-content">
                                    <div class="timeline-title">📦 Nuevo envío creado</div>
                                    <div class="timeline-desc">Envío GTX-2024-${String(Math.floor(Math.random() * 100)).padStart(3, '0')} - Shanghai → Guayaquil</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">10 Dic 2024</div>
                                <div class="timeline-content">
                                    <div class="timeline-title">✅ Envío entregado</div>
                                    <div class="timeline-desc">Entrega exitosa del envío GTX-2024-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">05 Dic 2024</div>
                                <div class="timeline-content">
                                    <div class="timeline-title">💰 Cotización solicitada</div>
                                    <div class="timeline-desc">Solicitud de cotización para envío multimodal</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">01 Dic 2024</div>
                                <div class="timeline-content">
                                    <div class="timeline-title">📋 Información actualizada</div>
                                    <div class="timeline-desc">Actualización de datos de contacto</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="history-actions">
                        <button class="btn-primary" onclick="generateClientReport('${client.id}')">📄 Generar Reporte</button>
                        <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
                    </div>
                </div>
            `
        }
    };
    
    return content[type] || { title: 'Modal', content: 'Contenido no disponible' };
}

function saveClient(event, clientId) {
    event.preventDefault();
    showNotification(`💾 Guardando cambios para cliente ${clientId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Cliente actualizado exitosamente', 'success');
        closeModal();
    }, 1500);
}

function generateClientReport(clientId) {
    showNotification(`📄 Generando reporte para cliente ${clientId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Reporte generado exitosamente', 'success');
    }, 2000);
}

// Estilos CSS adicionales para clientes
const clientStyles = `
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 2rem;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .page-title-section h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(45deg, #00f5ff, #ff6b35);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .page-title-section p {
        color: #ccc;
        font-size: 1.1rem;
    }
    
    .page-actions {
        display: flex;
        gap: 1rem;
    }
    
    .filters-section {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .search-bar {
        margin-bottom: 1rem;
    }
    
    .search-bar input {
        width: 100%;
        padding: 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 1rem;
    }
    
    .filter-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .filter-options select {
        padding: 0.8rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 0.9rem;
    }
    
    .client-stats {
        margin-bottom: 2rem;
    }
    
    .view-options {
        display: flex;
        gap: 0.5rem;
    }
    
    .view-btn {
        padding: 0.5rem 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .view-btn.active,
    .view-btn:hover {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
        border-color: #00f5ff;
    }
    
    .client-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .client-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 245, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    
    .client-id {
        font-size: 0.8rem;
        color: #888;
    }
    
    .type-badge {
        padding: 0.2rem 0.6rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .type-badge.corporativo {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
    }
    
    .type-badge.pyme {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
    }
    
    .type-badge.individual {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
    }
    
    .type-badge.government {
        background: rgba(156, 39, 176, 0.2);
        color: #9c27b0;
    }
    
    .shipment-count {
        font-weight: bold;
        color: #00f5ff;
    }
    
    .clients-cards {
        margin-top: 1rem;
    }
    
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }
    
    .client-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
        transition: all 0.3s ease;
    }
    
    .client-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 245, 255, 0.2);
        border-color: rgba(0, 245, 255, 0.5);
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .card-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(0, 245, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }
    
    .card-title {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: #00f5ff;
    }
    
    .card-details {
        margin: 1rem 0;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .detail-label {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .card-contact {
        margin: 1rem 0;
        font-size: 0.9rem;
        color: #ccc;
    }
    
    .card-contact div {
        margin-bottom: 0.3rem;
    }
    
    .card-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .breadcrumb-separator {
        margin: 0 0.5rem;
        color: #666;
    }
    
    .breadcrumb-item a {
        color: #00f5ff;
        text-decoration: none;
    }
    
    .breadcrumb-item a:hover {
        text-decoration: underline;
    }
    
    /* Estilos para modales de cliente */
    .client-profile {
        max-width: 600px;
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(0, 245, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
    }
    
    .profile-info h3 {
        margin-bottom: 0.5rem;
        color: #00f5ff;
    }
    
    .detail-section {
        margin-bottom: 2rem;
    }
    
    .detail-section h4 {
        color: #00f5ff;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 245, 255, 0.3);
        padding-bottom: 0.5rem;
    }
    
    .detail-grid {
        display: grid;
        gap: 1rem;
    }
    
    .detail-grid .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
    }
    
    .detail-grid .detail-item label {
        font-weight: 500;
        color: #ccc;
    }
    
    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .contact-icon {
        font-size: 1.2rem;
    }
    
    .stats-mini {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    
    .stat-mini {
        text-align: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .stat-mini-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: #00f5ff;
        margin-bottom: 0.3rem;
    }
    
    .stat-mini-label {
        font-size: 0.8rem;
        color: #ccc;
    }
    
    .profile-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Historial de cliente */
    .client-history {
        max-width: 700px;
    }
    
    .history-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .history-stat {
        text-align: center;
        padding: 1.5rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .history-stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #00f5ff;
        margin-bottom: 0.5rem;
    }
    
    .history-stat-label {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .timeline {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .timeline-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .timeline-date {
        min-width: 100px;
        font-size: 0.9rem;
        color: #888;
        font-weight: 500;
    }
    
    .timeline-content {
        flex: 1;
    }
    
    .timeline-title {
        font-weight: 600;
        color: #00f5ff;
        margin-bottom: 0.3rem;
    }
    
    .timeline-desc {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .history-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
`;

// Agregar estilos específicos de clientes
const clientStyleSheet = document.createElement('style');
clientStyleSheet.textContent = clientStyles;
document.head.appendChild(clientStyleSheet);

