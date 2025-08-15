// JavaScript específico para la página de cotizaciones

// Datos de ciudades por país
const citiesData = {
    china: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Tianjin'],
    usa: ['Miami', 'Los Angeles', 'New York', 'Houston', 'Chicago'],
    germany: ['Hamburg', 'Bremen', 'Berlin', 'Munich', 'Frankfurt'],
    japan: ['Tokyo', 'Osaka', 'Yokohama', 'Kobe', 'Nagoya'],
    brazil: ['São Paulo', 'Rio de Janeiro', 'Santos', 'Salvador', 'Recife'],
    ecuador: ['Guayaquil', 'Quito', 'Cuenca', 'Machala', 'Manta'],
    colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
    peru: ['Lima', 'Callao', 'Arequipa', 'Trujillo', 'Chiclayo'],
    chile: ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta', 'Iquique'],
    mexico: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Tijuana', 'Veracruz']
};

// Tarifas base por tipo de transporte (USD por kg)
const baseTariffs = {
    maritime: 2.5,
    aerial: 8.5,
    terrestrial: 4.2,
    express: 15.8
};

// Multiplicadores por tipo de carga
const cargoMultipliers = {
    general: 1.0,
    fragile: 1.3,
    dangerous: 1.8,
    perishable: 1.5,
    valuable: 2.0
};

// Costos de servicios adicionales
const additionalServices = {
    insurance: 0.02, // 2% del valor declarado
    tracking: 25,    // USD fijo
    packaging: 1.5,  // USD por kg
    customs: 150     // USD fijo
};

// Inicialización específica de la página de cotizaciones
document.addEventListener('DOMContentLoaded', function() {
    initializeQuotesPage();
});

function initializeQuotesPage() {
    // Configurar eventos de la calculadora
    setupCalculatorEvents();
    
    // Mostrar resultado inicial vacío
    document.getElementById('quoteResult').style.display = 'block';
    updateCostDisplay(0, {});
}

function setupCalculatorEvents() {
    // Eventos para actualizar ciudades cuando cambia el país
    document.getElementById('originCountry').addEventListener('change', () => updateCities('origin'));
    document.getElementById('destCountry').addEventListener('change', () => updateCities('dest'));
    
    // Eventos para recalcular cuando cambian los valores
    const inputs = ['weight', 'length', 'width', 'height', 'declaredValue'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculateCost);
        }
    });
    
    // Eventos para selects
    const selects = ['cargoType'];
    selects.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', calculateCost);
        }
    });
}

// Actualizar ciudades según el país seleccionado
function updateCities(type) {
    const countrySelect = document.getElementById(type + 'Country');
    const citySelect = document.getElementById(type + 'City');
    const selectedCountry = countrySelect.value;
    
    // Limpiar opciones existentes
    citySelect.innerHTML = '<option value="">Seleccionar ciudad</option>';
    
    if (selectedCountry && citiesData[selectedCountry]) {
        citiesData[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, '-');
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
    
    // Recalcular costo
    calculateCost();
}

// Función principal de cálculo de costos
function calculateCost() {
    const formData = getFormData();
    
    if (!isValidFormData(formData)) {
        updateCostDisplay(0, {});
        return;
    }
    
    const costs = calculateDetailedCosts(formData);
    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    updateCostDisplay(totalCost, costs);
}

function getFormData() {
    return {
        originCountry: document.getElementById('originCountry').value,
        originCity: document.getElementById('originCity').value,
        destCountry: document.getElementById('destCountry').value,
        destCity: document.getElementById('destCity').value,
        weight: parseFloat(document.getElementById('weight').value) || 0,
        length: parseFloat(document.getElementById('length').value) || 0,
        width: parseFloat(document.getElementById('width').value) || 0,
        height: parseFloat(document.getElementById('height').value) || 0,
        cargoType: document.getElementById('cargoType').value,
        declaredValue: parseFloat(document.getElementById('declaredValue').value) || 0,
        transport: document.querySelector('input[name="transport"]:checked')?.value,
        insurance: document.getElementById('insurance').checked,
        tracking: document.getElementById('tracking').checked,
        packaging: document.getElementById('packaging').checked,
        customs: document.getElementById('customs').checked
    };
}

function isValidFormData(data) {
    return data.weight > 0 && data.transport && data.originCountry && data.destCountry;
}

function calculateDetailedCosts(data) {
    const costs = {};
    
    // Costo base de transporte
    const baseCost = data.weight * baseTariffs[data.transport];
    const cargoMultiplier = cargoMultipliers[data.cargoType] || 1.0;
    costs.transport = baseCost * cargoMultiplier;
    
    // Costo por volumen (si aplica)
    const volume = (data.length * data.width * data.height) / 1000000; // m³
    const volumetricWeight = volume * 167; // Factor volumétrico estándar
    if (volumetricWeight > data.weight) {
        const extraCost = (volumetricWeight - data.weight) * baseTariffs[data.transport] * 0.5;
        costs.volumetric = extraCost;
    }
    
    // Servicios adicionales
    if (data.insurance && data.declaredValue > 0) {
        costs.insurance = data.declaredValue * additionalServices.insurance;
    }
    
    if (data.tracking) {
        costs.tracking = additionalServices.tracking;
    }
    
    if (data.packaging) {
        costs.packaging = data.weight * additionalServices.packaging;
    }
    
    if (data.customs) {
        costs.customs = additionalServices.customs;
    }
    
    // Costo por distancia (simulado)
    const distanceMultiplier = getDistanceMultiplier(data.originCountry, data.destCountry);
    costs.distance = costs.transport * distanceMultiplier * 0.1;
    
    // Impuestos y tasas (10% del subtotal)
    const subtotal = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    costs.taxes = subtotal * 0.1;
    
    return costs;
}

function getDistanceMultiplier(origin, dest) {
    // Simulación simple de multiplicador por distancia
    const distanceMatrix = {
        'china-ecuador': 1.8,
        'china-colombia': 1.7,
        'china-peru': 1.6,
        'usa-ecuador': 1.2,
        'usa-colombia': 1.1,
        'usa-peru': 1.3,
        'germany-ecuador': 1.5,
        'japan-ecuador': 1.9,
        'brazil-ecuador': 0.8
    };
    
    const key = `${origin}-${dest}`;
    return distanceMatrix[key] || 1.0;
}

function updateCostDisplay(totalCost, costs) {
    const totalCostElement = document.getElementById('totalCost');
    const costDetailsElement = document.getElementById('costDetails');
    
    totalCostElement.textContent = `$${totalCost.toFixed(2)}`;
    
    if (totalCost === 0) {
        costDetailsElement.innerHTML = `
            <div class="cost-item">
                <span>Complete los datos para ver la cotización</span>
            </div>
        `;
        return;
    }
    
    let detailsHTML = '';
    
    if (costs.transport) {
        detailsHTML += `
            <div class="cost-item">
                <span>🚚 Transporte base</span>
                <span>$${costs.transport.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.volumetric) {
        detailsHTML += `
            <div class="cost-item">
                <span>📦 Peso volumétrico</span>
                <span>$${costs.volumetric.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.distance) {
        detailsHTML += `
            <div class="cost-item">
                <span>📍 Factor distancia</span>
                <span>$${costs.distance.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.insurance) {
        detailsHTML += `
            <div class="cost-item">
                <span>🛡️ Seguro</span>
                <span>$${costs.insurance.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.tracking) {
        detailsHTML += `
            <div class="cost-item">
                <span>📱 Tracking premium</span>
                <span>$${costs.tracking.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.packaging) {
        detailsHTML += `
            <div class="cost-item">
                <span>📦 Embalaje especial</span>
                <span>$${costs.packaging.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.customs) {
        detailsHTML += `
            <div class="cost-item">
                <span>🏢 Gestión aduanera</span>
                <span>$${costs.customs.toFixed(2)}</span>
            </div>
        `;
    }
    
    if (costs.taxes) {
        detailsHTML += `
            <div class="cost-item taxes">
                <span>📋 Impuestos y tasas</span>
                <span>$${costs.taxes.toFixed(2)}</span>
            </div>
        `;
    }
    
    costDetailsElement.innerHTML = detailsHTML;
}

// Funciones de acciones de cotización
function saveQuote() {
    const formData = getFormData();
    
    if (!isValidFormData(formData)) {
        showNotification('⚠️ Complete todos los campos requeridos', 'warning');
        return;
    }
    
    showNotification('💾 Guardando cotización...', 'info');
    
    setTimeout(() => {
        const quoteId = generateQuoteId();
        showNotification(`✅ Cotización ${quoteId} guardada exitosamente`, 'success');
    }, 1500);
}

function sendQuote() {
    showNotification('📧 Enviando cotización por email...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Cotización enviada exitosamente', 'success');
    }, 2000);
}

function printQuote() {
    showNotification('🖨️ Preparando cotización para imprimir...', 'info');
    
    setTimeout(() => {
        window.print();
    }, 1000);
}

function generateQuoteId() {
    const date = new Date();
    const year = date.getFullYear();
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COT-${year}-${number}`;
}

// Filtrar cotizaciones
function filterQuotes() {
    const statusFilter = document.getElementById('statusFilter').value;
    const periodFilter = document.getElementById('periodFilter').value;
    const quoteCards = document.querySelectorAll('.quote-card');
    
    quoteCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        let showCard = true;
        
        // Filtro por estado
        if (statusFilter && cardStatus !== statusFilter) {
            showCard = false;
        }
        
        // Filtro por período (simulado)
        if (periodFilter && periodFilter !== 'all') {
            // Aquí se implementaría la lógica de filtrado por fecha
            // Por ahora solo mostramos todas las tarjetas
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

// Funciones de acciones de cotizaciones
function viewQuote(quoteId) {
    showNotification(`👁️ Visualizando cotización ${quoteId}`, 'info');
    // Aquí iría la lógica para mostrar detalles de la cotización
}

function editQuote(quoteId) {
    showNotification(`✏️ Editando cotización ${quoteId}`, 'info');
    // Aquí iría la lógica para editar la cotización
}

function sendQuoteEmail(quoteId) {
    showNotification(`📧 Enviando cotización ${quoteId} por email...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Email enviado exitosamente', 'success');
    }, 2000);
}

function createShipment(quoteId) {
    showNotification(`📦 Creando envío basado en cotización ${quoteId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Envío creado exitosamente', 'success');
    }, 2000);
}

function generateInvoice(quoteId) {
    showNotification(`🧾 Generando factura para cotización ${quoteId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Factura generada exitosamente', 'success');
    }, 2000);
}

function renewQuote(quoteId) {
    showNotification(`🔄 Renovando cotización ${quoteId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Cotización renovada exitosamente', 'success');
    }, 1500);
}

function archiveQuote(quoteId) {
    showNotification(`📁 Archivando cotización ${quoteId}...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ Cotización archivada exitosamente', 'success');
    }, 1500);
}

function exportQuotes() {
    showNotification('📤 Exportando cotizaciones...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Cotizaciones exportadas exitosamente', 'success');
    }, 2000);
}

// Estilos CSS adicionales para cotizaciones
const quotesStyles = `
    .cost-calculator {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .calculator-container h3 {
        color: #00f5ff;
        margin-bottom: 2rem;
    }
    
    .form-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .form-section:last-child {
        border-bottom: none;
    }
    
    .form-section h4 {
        color: #00f5ff;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
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
    
    .transport-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .transport-option {
        display: block;
        cursor: pointer;
    }
    
    .transport-option input[type="radio"] {
        display: none;
    }
    
    .option-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    }
    
    .transport-option input[type="radio"]:checked + .option-content {
        border-color: #00f5ff;
        background: rgba(0, 245, 255, 0.1);
        box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
    }
    
    .option-content:hover {
        border-color: #00f5ff;
        background: rgba(0, 245, 255, 0.05);
    }
    
    .option-icon {
        font-size: 2rem;
        min-width: 50px;
        text-align: center;
    }
    
    .option-title {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .option-desc {
        font-size: 0.8rem;
        color: #888;
    }
    
    .additional-services {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .service-checkbox {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .service-checkbox:hover {
        border-color: #00f5ff;
        background: rgba(0, 245, 255, 0.05);
    }
    
    .service-checkbox input[type="checkbox"] {
        display: none;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(0, 245, 255, 0.5);
        border-radius: 4px;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .service-checkbox input[type="checkbox"]:checked + .checkmark {
        background: #00f5ff;
        border-color: #00f5ff;
    }
    
    .service-checkbox input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: bold;
        font-size: 0.8rem;
    }
    
    .service-title {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .service-desc {
        font-size: 0.8rem;
        color: #888;
    }
    
    .quote-result {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .result-container h3 {
        color: #00f5ff;
        margin-bottom: 1.5rem;
    }
    
    .cost-breakdown {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    
    .cost-summary {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .total-cost {
        text-align: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cost-label {
        font-size: 1.1rem;
        color: #ccc;
        margin-bottom: 0.5rem;
    }
    
    .cost-amount {
        font-size: 3rem;
        font-weight: bold;
        color: #00f5ff;
        text-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
    }
    
    .cost-details {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .cost-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cost-item:last-child {
        border-bottom: none;
    }
    
    .cost-item.taxes {
        font-weight: 600;
        color: #ff6b35;
    }
    
    .cost-item span:first-child {
        color: #ccc;
    }
    
    .cost-item span:last-child {
        font-weight: 600;
        color: white;
    }
    
    .quote-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .quotes-history {
        margin-bottom: 2rem;
    }
    
    .quotes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 1.5rem;
    }
    
    .quote-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
        transition: all 0.3s ease;
    }
    
    .quote-card:hover {
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
    
    .quote-id {
        font-size: 1.2rem;
        font-weight: bold;
        color: #00f5ff;
    }
    
    .quote-status {
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .quote-status.pending {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
    }
    
    .quote-status.approved {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
    }
    
    .quote-status.rejected {
        background: rgba(255, 71, 87, 0.2);
        color: #ff4757;
    }
    
    .quote-status.expired {
        background: rgba(255, 255, 255, 0.2);
        color: #888;
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
    
    .route-point {
        font-weight: 500;
    }
    
    .route-arrow {
        color: #00f5ff;
        font-size: 1.2rem;
    }
    
    .quote-details {
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
    
    .quote-cost {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 245, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .cost-label {
        font-weight: 600;
        color: #00f5ff;
    }
    
    .cost-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #00f5ff;
    }
    
    .card-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .btn-small.send {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
    }
    
    .btn-small.create {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
    }
    
    .btn-small.invoice {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
    }
    
    .btn-small.renew {
        background: rgba(156, 39, 176, 0.2);
        color: #9c27b0;
    }
    
    .btn-small.archive {
        background: rgba(255, 255, 255, 0.2);
        color: #888;
    }
    
    @media (max-width: 768px) {
        .cost-breakdown {
            grid-template-columns: 1fr;
        }
        
        .quotes-grid {
            grid-template-columns: 1fr;
        }
        
        .transport-options {
            grid-template-columns: 1fr;
        }
        
        .additional-services {
            grid-template-columns: 1fr;
        }
        
        .route-info {
            flex-direction: column;
            text-align: center;
        }
        
        .route-arrow {
            transform: rotate(90deg);
        }
    }
`;

// Agregar estilos específicos de cotizaciones
const quotesStyleSheet = document.createElement('style');
quotesStyleSheet.textContent = quotesStyles;
document.head.appendChild(quotesStyleSheet);

