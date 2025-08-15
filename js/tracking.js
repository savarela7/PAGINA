// JavaScript específico para la página de seguimiento

// Datos de ejemplo de envíos
const shipmentsData = [
    {
        id: 'GTX-2024-001',
        client: 'Importaciones Global S.A.',
        origin: '🇨🇳 Shanghai, China',
        destination: '🇪🇨 Guayaquil, Ecuador',
        status: 'in-transit',
        progress: 65,
        eta: '15 Dic 2024',
        weight: '2,500 kg',
        transport: 'maritime'
    },
    {
        id: 'GTX-2024-003',
        client: 'Textiles Andinos Ltda.',
        origin: '🇵🇪 Lima, Perú',
        destination: '🇨🇴 Bogotá, Colombia',
        status: 'processing',
        progress: 25,
        eta: '18 Dic 2024',
        weight: '1,200 kg',
        transport: 'terrestrial'
    },
    {
        id: 'GTX-2024-004',
        client: 'TechCorp Ecuador',
        origin: '🇺🇸 Miami, USA',
        destination: '🇪🇨 Quito, Ecuador',
        status: 'customs',
        progress: 85,
        eta: '20 Dic 2024',
        weight: '850 kg',
        transport: 'aerial'
    }
];

// Inicialización específica de la página de seguimiento
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
    setupTrackingForm();
});

function initializeTracking() {
    // Verificar si hay un código de seguimiento en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const trackingCode = urlParams.get('code');
    
    if (trackingCode) {
        document.getElementById('trackingCode').value = trackingCode;
        setTimeout(() => {
            trackShipment();
        }, 500);
    }
}

function setupTrackingForm() {
    const trackingInput = document.getElementById('trackingCode');
    
    // Formatear automáticamente el código de seguimiento
    trackingInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase();
        // Formato: GTX-2024-XXX
        if (value.length > 3 && !value.includes('-')) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        if (value.length > 8 && value.split('-').length === 2) {
            const parts = value.split('-');
            value = parts[0] + '-' + parts[1].slice(0, 4) + '-' + parts[1].slice(4);
        }
        e.target.value = value;
    });
    
    // Permitir rastreo con Enter
    trackingInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            trackShipment();
        }
    });
}

// Función principal de rastreo
function trackShipment() {
    const trackingCode = document.getElementById('trackingCode').value;
    const transportType = document.getElementById('transportType').value;
    const btnText = document.getElementById('trackBtnText');
    
    if (!trackingCode) {
        showNotification('⚠️ Por favor ingresa un código de seguimiento', 'warning');
        return;
    }
    
    btnText.innerHTML = '<span class="loading-spinner"></span>Rastreando...';
    
    // Simular búsqueda
    setTimeout(() => {
        const shipment = findShipment(trackingCode);
        if (shipment) {
            displayTrackingResult(shipment);
            showNotification(`✅ Envío ${trackingCode} encontrado`, 'success');
        } else {
            showNotification(`❌ No se encontró el envío ${trackingCode}`, 'error');
        }
        btnText.textContent = '🎯 Rastrear';
    }, 2000);
}

function findShipment(code) {
    return shipmentsData.find(s => s.id === code) || {
        id: code,
        client: 'Cliente Ejemplo',
        origin: '🌍 Origen',
        destination: '🎯 Destino',
        status: 'in-transit',
        progress: Math.floor(Math.random() * 100),
        eta: '25 Dic 2024',
        weight: '1,000 kg',
        transport: 'multimodal'
    };
}

function displayTrackingResult(shipment) {
    const resultSection = document.getElementById('trackingResult');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const shipmentStatus = document.getElementById('shipmentStatus');
    
    resultSection.style.display = 'block';
    
    // Actualizar barra de progreso
    progressFill.style.width = shipment.progress + '%';
    
    // Generar pasos del seguimiento
    const steps = generateTrackingSteps(shipment.transport);
    const currentStep = Math.floor((shipment.progress / 100) * steps.length);
    
    let statusHTML = `
        <div class="shipment-info">
            <div class="info-header">
                <h4>📦 ${shipment.id}</h4>
                <span class="status ${shipment.status}">${getStatusIcon(shipment.status)} ${getStatusText(shipment.status)}</span>
            </div>
            <div class="route-display">
                <div class="route-point">
                    <span class="route-icon">📍</span>
                    <span>${shipment.origin}</span>
                </div>
                <div class="route-arrow">→</div>
                <div class="route-point">
                    <span class="route-icon">🎯</span>
                    <span>${shipment.destination}</span>
                </div>
            </div>
            <div class="shipment-meta">
                <div class="meta-item">
                    <span>👥 Cliente:</span>
                    <span>${shipment.client}</span>
                </div>
                <div class="meta-item">
                    <span>📅 ETA:</span>
                    <span>${shipment.eta}</span>
                </div>
                <div class="meta-item">
                    <span>⚖️ Peso:</span>
                    <span>${shipment.weight}</span>
                </div>
            </div>
        </div>
        
        <div class="tracking-timeline">
            <h4>📋 Historial de Seguimiento</h4>
            <div class="timeline">
    `;
    
    steps.forEach((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const stepClass = isCompleted ? 'completed' : (isCurrent ? 'current' : 'pending');
        
        statusHTML += `
            <div class="timeline-step ${stepClass}">
                <div class="step-icon">${step.icon}</div>
                <div class="step-content">
                    <div class="step-title">${step.title}</div>
                    <div class="step-desc">${step.description}</div>
                    <div class="step-time">${generateStepTime(index, isCompleted, isCurrent)}</div>
                </div>
            </div>
        `;
    });
    
    statusHTML += `
            </div>
        </div>
        
        <div class="tracking-actions">
            <button class="btn-primary" onclick="showShipmentDetails('${shipment.id}')">📋 Ver Detalles Completos</button>
            <button class="btn-secondary" onclick="generateTrackingReport('${shipment.id}')">📄 Generar Reporte</button>
            <button class="btn-secondary" onclick="shareTracking('${shipment.id}')">📤 Compartir</button>
        </div>
    `;
    
    shipmentStatus.innerHTML = statusHTML;
    
    // Actualizar mapa
    updateTrackingMap(shipment);
    
    // Scroll suave al resultado
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function generateTrackingSteps(transport) {
    const steps = {
        maritime: [
            { icon: '🏭', title: 'Recogida en origen', description: 'Mercancía recogida del almacén' },
            { icon: '🚛', title: 'Transporte a puerto', description: 'Traslado al puerto de embarque' },
            { icon: '📋', title: 'Documentación aduanera', description: 'Proceso de documentos de exportación' },
            { icon: '📦', title: 'Carga en contenedor', description: 'Mercancía cargada en contenedor' },
            { icon: '🚢', title: 'Zarpe del buque', description: 'Buque ha zarpado del puerto origen' },
            { icon: '🌊', title: 'Navegación oceánica', description: 'En tránsito marítimo' },
            { icon: '⚓', title: 'Llegada a puerto destino', description: 'Buque arribó al puerto destino' },
            { icon: '🏢', title: 'Proceso de desaduanaje', description: 'Trámites aduaneros en destino' },
            { icon: '🚚', title: 'Entrega final', description: 'Entrega en dirección final' }
        ],
        aerial: [
            { icon: '📦', title: 'Recepción de carga', description: 'Carga recibida en aeropuerto' },
            { icon: '📋', title: 'Verificación documentos', description: 'Revisión de documentación' },
            { icon: '🏢', title: 'Check-in aeroportuario', description: 'Registro en sistema aeroportuario' },
            { icon: '✈️', title: 'Carga en aeronave', description: 'Mercancía cargada en avión' },
            { icon: '🛫', title: 'Despegue', description: 'Vuelo ha despegado' },
            { icon: '🌤️', title: 'Vuelo en curso', description: 'En tránsito aéreo' },
            { icon: '🛬', title: 'Aterrizaje', description: 'Vuelo aterrizó en destino' },
            { icon: '🏢', title: 'Descarga y aduanas', description: 'Descarga y trámites aduaneros' },
            { icon: '🚚', title: 'Entrega express', description: 'Entrega final express' }
        ],
        terrestrial: [
            { icon: '🏭', title: 'Recogida en origen', description: 'Mercancía recogida' },
            { icon: '📋', title: 'Documentación', description: 'Preparación de documentos' },
            { icon: '🚛', title: 'Carga del vehículo', description: 'Carga en camión' },
            { icon: '🛣️', title: 'Inicio de ruta', description: 'Inicio del viaje terrestre' },
            { icon: '⛽', title: 'Control intermedio', description: 'Parada de control y descanso' },
            { icon: '🌉', title: 'Cruce fronterizo', description: 'Paso por frontera' },
            { icon: '📍', title: 'Llegada a ciudad destino', description: 'Arribó a ciudad destino' },
            { icon: '🏢', title: 'Verificación final', description: 'Verificación antes de entrega' },
            { icon: '🎯', title: 'Entrega completada', description: 'Entrega exitosa' }
        ],
        multimodal: [
            { icon: '🏭', title: 'Origen - Recogida', description: 'Recogida en punto de origen' },
            { icon: '🚛', title: 'Transporte terrestre', description: 'Primer tramo terrestre' },
            { icon: '🏢', title: 'Centro de consolidación', description: 'Consolidación de carga' },
            { icon: '🚢', title: 'Transporte principal', description: 'Transporte marítimo/aéreo' },
            { icon: '🌍', title: 'Tránsito internacional', description: 'En tránsito internacional' },
            { icon: '🏢', title: 'Hub de distribución', description: 'Centro de distribución destino' },
            { icon: '🚚', title: 'Último tramo', description: 'Transporte final' },
            { icon: '📍', title: 'Entrega final', description: 'Entrega completada' }
        ]
    };
    
    return steps[transport] || steps.multimodal;
}

function generateStepTime(index, isCompleted, isCurrent) {
    if (isCompleted) {
        const daysAgo = Math.floor(Math.random() * 5) + 1;
        return `Hace ${daysAgo} día${daysAgo > 1 ? 's' : ''}`;
    } else if (isCurrent) {
        const hoursAgo = Math.floor(Math.random() * 12) + 1;
        return `Hace ${hoursAgo} hora${hoursAgo > 1 ? 's' : ''}`;
    } else {
        return 'Pendiente';
    }
}

function getStatusIcon(status) {
    const icons = {
        'in-transit': '🚢',
        'processing': '📋',
        'customs': '🏢',
        'delivered': '✅',
        'pending': '⏳'
    };
    return icons[status] || '📦';
}

function getStatusText(status) {
    const texts = {
        'in-transit': 'En tránsito',
        'processing': 'Procesando',
        'customs': 'En aduanas',
        'delivered': 'Entregado',
        'pending': 'Pendiente'
    };
    return texts[status] || 'Desconocido';
}

function updateTrackingMap(shipment) {
    const mapContainer = document.getElementById('trackingMap');
    
    mapContainer.innerHTML = `
        <div class="map-active">
            <div class="map-header">
                <h4>🗺️ Ruta: ${shipment.origin} → ${shipment.destination}</h4>
                <div class="map-progress">${shipment.progress}% completado</div>
            </div>
            <div class="route-visualization">
                <div class="route-line">
                    <div class="route-progress" style="width: ${shipment.progress}%;"></div>
                </div>
                <div class="route-points">
                    <div class="route-point origin completed">
                        <div class="point-icon">📍</div>
                        <div class="point-label">Origen</div>
                    </div>
                    <div class="route-point transit ${shipment.progress > 50 ? 'completed' : 'current'}">
                        <div class="point-icon">🚚</div>
                        <div class="point-label">En tránsito</div>
                    </div>
                    <div class="route-point destination ${shipment.progress >= 100 ? 'completed' : 'pending'}">
                        <div class="point-icon">🎯</div>
                        <div class="point-label">Destino</div>
                    </div>
                </div>
            </div>
            <div class="map-info">
                <div class="info-item">
                    <span>🚚 Transporte:</span>
                    <span>${getTransportLabel(shipment.transport)}</span>
                </div>
                <div class="info-item">
                    <span>📅 ETA:</span>
                    <span>${shipment.eta}</span>
                </div>
                <div class="info-item">
                    <span>📍 Última actualización:</span>
                    <span>Hace ${Math.floor(Math.random() * 60) + 1} minutos</span>
                </div>
            </div>
        </div>
    `;
}

function getTransportLabel(transport) {
    const labels = {
        maritime: '🚢 Marítimo',
        aerial: '✈️ Aéreo',
        terrestrial: '🚛 Terrestre',
        multimodal: '🌐 Multimodal'
    };
    return labels[transport] || '🚚 Transporte';
}

// Filtrar envíos
function filterShipments() {
    const statusFilter = document.getElementById('statusFilter').value;
    const shipmentCards = document.querySelectorAll('.shipment-card');
    
    shipmentCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        
        if (!statusFilter || cardStatus === statusFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Funciones de acciones
function trackSpecific(shipmentId) {
    document.getElementById('trackingCode').value = shipmentId;
    trackShipment();
}

function editShipment(shipmentId) {
    showNotification(`✏️ Editando envío ${shipmentId}...`, 'info');
    // Aquí iría la lógica para editar el envío
}

function showShipmentDetails(shipmentId) {
    showNotification(`📋 Cargando detalles completos de ${shipmentId}...`, 'info');
    // Aquí iría la lógica para mostrar detalles completos
}

function generateTrackingReport(shipmentId) {
    showNotification(`📄 Generando reporte de seguimiento para ${shipmentId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Reporte generado exitosamente', 'success');
    }, 2000);
}

function shareTracking(shipmentId) {
    const url = `${window.location.origin}${window.location.pathname}?code=${shipmentId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Seguimiento ${shipmentId}`,
            text: `Rastrea el envío ${shipmentId} en tiempo real`,
            url: url
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(url).then(() => {
            showNotification('📤 Enlace copiado al portapapeles', 'success');
        });
    }
}

function exportTracking() {
    showNotification('📤 Exportando datos de seguimiento...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Datos exportados exitosamente', 'success');
    }, 2000);
}

// Estilos CSS adicionales para seguimiento
const trackingStyles = `
    .tracking-search {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .search-container h3 {
        color: #00f5ff;
        margin-bottom: 1.5rem;
    }
    
    .tracking-form .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 1rem;
        align-items: end;
    }
    
    .input-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #00f5ff;
        font-weight: 500;
    }
    
    .input-group input,
    .input-group select {
        width: 100%;
        padding: 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 1rem;
    }
    
    .track-btn {
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #00f5ff, #0099cc);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
    }
    
    .track-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 245, 255, 0.3);
    }
    
    .tracking-result {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .progress-header {
        margin-bottom: 2rem;
    }
    
    .progress-header h3 {
        color: #00f5ff;
        margin-bottom: 1rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00f5ff, #00ff88);
        border-radius: 4px;
        transition: width 1s ease;
    }
    
    .shipment-info {
        margin-bottom: 2rem;
    }
    
    .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .info-header h4 {
        color: #00f5ff;
        font-size: 1.5rem;
    }
    
    .route-display {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
    }
    
    .route-point {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .route-arrow {
        font-size: 1.5rem;
        color: #00f5ff;
    }
    
    .shipment-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .meta-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .meta-item span:first-child {
        color: #ccc;
    }
    
    .meta-item span:last-child {
        color: white;
        font-weight: 500;
    }
    
    .tracking-timeline {
        margin-bottom: 2rem;
    }
    
    .tracking-timeline h4 {
        color: #00f5ff;
        margin-bottom: 1rem;
    }
    
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .timeline-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 10px;
        transition: all 0.3s ease;
    }
    
    .timeline-step.completed {
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid rgba(0, 255, 136, 0.3);
    }
    
    .timeline-step.current {
        background: rgba(0, 245, 255, 0.1);
        border: 1px solid rgba(0, 245, 255, 0.3);
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
    }
    
    .timeline-step.pending {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        opacity: 0.6;
    }
    
    .step-icon {
        font-size: 2rem;
        min-width: 60px;
        text-align: center;
    }
    
    .step-content {
        flex: 1;
    }
    
    .step-title {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .step-desc {
        color: #ccc;
        font-size: 0.9rem;
        margin-bottom: 0.3rem;
    }
    
    .step-time {
        font-size: 0.8rem;
        color: #888;
    }
    
    .tracking-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .tracking-map {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .tracking-map h3 {
        color: #00f5ff;
        margin-bottom: 1.5rem;
    }
    
    .interactive-map {
        min-height: 300px;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .map-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        background: rgba(0, 0, 0, 0.3);
        border: 2px dashed rgba(0, 245, 255, 0.3);
        border-radius: 10px;
    }
    
    .map-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.6;
    }
    
    .map-note {
        color: #888;
        font-size: 0.9rem;
    }
    
    .map-active {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .map-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .map-header h4 {
        color: #00f5ff;
    }
    
    .map-progress {
        color: #00ff88;
        font-weight: 600;
    }
    
    .route-visualization {
        position: relative;
        margin-bottom: 2rem;
    }
    
    .route-line {
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin: 2rem 0;
        position: relative;
    }
    
    .route-progress {
        height: 100%;
        background: linear-gradient(90deg, #00f5ff, #00ff88);
        border-radius: 2px;
        transition: width 1s ease;
    }
    
    .route-points {
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    
    .route-point {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    
    .point-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        border: 2px solid;
    }
    
    .route-point.completed .point-icon {
        background: rgba(0, 255, 136, 0.2);
        border-color: #00ff88;
        color: #00ff88;
    }
    
    .route-point.current .point-icon {
        background: rgba(0, 245, 255, 0.2);
        border-color: #00f5ff;
        color: #00f5ff;
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
    }
    
    .route-point.pending .point-icon {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        color: #888;
    }
    
    .point-label {
        font-size: 0.8rem;
        text-align: center;
    }
    
    .map-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .active-shipments {
        margin-bottom: 2rem;
    }
    
    .shipments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 1.5rem;
    }
    
    .shipment-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
        transition: all 0.3s ease;
    }
    
    .shipment-card:hover {
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
    
    .shipment-code {
        font-size: 1.2rem;
        font-weight: bold;
        color: #00f5ff;
    }
    
    .shipment-status {
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .shipment-status.in-transit {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
    }
    
    .shipment-status.processing {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
    }
    
    .shipment-status.customs {
        background: rgba(156, 39, 176, 0.2);
        color: #9c27b0;
    }
    
    .shipment-status.delivered {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
    }
    
    .route-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .shipment-details {
        margin-bottom: 1rem;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .detail-item span:first-child {
        color: #ccc;
    }
    
    .progress-mini {
        margin-bottom: 1rem;
    }
    
    .progress-mini-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-mini-fill {
        height: 100%;
        background: linear-gradient(90deg, #00f5ff, #00ff88);
        border-radius: 3px;
        transition: width 0.5s ease;
    }
    
    .progress-text {
        font-size: 0.8rem;
        color: #888;
    }
    
    .card-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
        .tracking-form .form-row {
            grid-template-columns: 1fr;
        }
        
        .shipments-grid {
            grid-template-columns: 1fr;
        }
        
        .route-display {
            flex-direction: column;
            text-align: center;
        }
        
        .route-arrow {
            transform: rotate(90deg);
        }
    }
`;

// Agregar estilos específicos de seguimiento
const trackingStyleSheet = document.createElement('style');
trackingStyleSheet.textContent = trackingStyles;
document.head.appendChild(trackingStyleSheet);

