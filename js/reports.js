// JavaScript específico para la página de reportes

// Variables globales para los gráficos
let revenueChart, transportChart, countriesChart, satisfactionChart;

// Datos de ejemplo para los gráficos
const chartData = {
    revenue: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        data: [185000, 210000, 195000, 245000, 280000, 265000, 290000, 315000, 298000, 325000, 340000, 365000]
    },
    transport: {
        labels: ['Marítimo', 'Aéreo', 'Terrestre', 'Express'],
        data: [45, 25, 20, 10],
        colors: ['#00f5ff', '#ff6b35', '#00ff88', '#9c27b0']
    },
    countries: {
        labels: ['Ecuador', 'Colombia', 'Perú', 'Chile', 'Brasil', 'México'],
        data: [35, 25, 18, 12, 8, 2]
    },
    satisfaction: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        data: [96.2, 96.8, 97.1, 97.5, 98.1, 98.5]
    }
};

// Inicialización específica de la página de reportes
document.addEventListener('DOMContentLoaded', function() {
    initializeReportsPage();
    createCharts();
    animateKPIs();
    setDefaultDates();
});

function initializeReportsPage() {
    // Configurar eventos de filtros
    setupFilterEvents();
    
    // Configurar período activo
    setPeriod('month');
}

function setupFilterEvents() {
    // Eventos para fechas personalizadas
    document.getElementById('startDate').addEventListener('change', updateCharts);
    document.getElementById('endDate').addEventListener('change', updateCharts);
}

function setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    document.getElementById('startDate').value = firstDay.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
}

// Configurar período de análisis
function setPeriod(period) {
    // Remover clase active de todos los botones
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Agregar clase active al botón seleccionado
    event.target.classList.add('active');
    
    // Actualizar fechas según el período
    const today = new Date();
    let startDate, endDate = today;
    
    switch(period) {
        case 'today':
            startDate = new Date(today);
            break;
        case 'week':
            startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            startDate = new Date(today.getFullYear(), quarter * 3, 1);
            break;
        case 'year':
            startDate = new Date(today.getFullYear(), 0, 1);
            break;
    }
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    
    updateCharts();
}

// Crear gráficos usando Canvas
function createCharts() {
    createRevenueChart();
    createTransportChart();
    createCountriesChart();
    createSatisfactionChart();
}

function createRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configuración del gráfico
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const data = chartData.revenue.data;
    const labels = chartData.revenue.labels;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Dibujar ejes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Eje Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // Eje X
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Dibujar líneas de la cuadrícula
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 1; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // Dibujar línea del gráfico
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((data[i] - minValue) / range) * chartHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Dibujar puntos
    ctx.fillStyle = '#00f5ff';
    for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((data[i] - minValue) / range) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Etiquetas del eje X
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < labels.length; i++) {
        const x = padding + (chartWidth / (labels.length - 1)) * i;
        ctx.fillText(labels[i], x, canvas.height - 10);
    }
}

function createTransportChart() {
    const canvas = document.getElementById('transportChart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    const data = chartData.transport.data;
    const labels = chartData.transport.labels;
    const colors = chartData.transport.colors;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    let currentAngle = -Math.PI / 2;
    
    // Dibujar sectores
    for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i] / total) * 2 * Math.PI;
        
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // Dibujar etiquetas
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${data[i]}%`, labelX, labelY);
        
        currentAngle += sliceAngle;
    }
    
    // Leyenda
    const legendX = canvas.width - 120;
    let legendY = 30;
    
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    
    for (let i = 0; i < labels.length; i++) {
        // Cuadrado de color
        ctx.fillStyle = colors[i];
        ctx.fillRect(legendX, legendY, 12, 12);
        
        // Texto
        ctx.fillStyle = 'white';
        ctx.fillText(labels[i], legendX + 18, legendY + 9);
        
        legendY += 20;
    }
}

function createCountriesChart() {
    const canvas = document.getElementById('countriesChart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const data = chartData.countries.data;
    const labels = chartData.countries.labels;
    const maxValue = Math.max(...data);
    
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Dibujar barras
    for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / maxValue) * chartHeight;
        const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
        const y = padding + chartHeight - barHeight;
        
        // Gradiente para las barras
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#00f5ff');
        gradient.addColorStop(1, 'rgba(0, 245, 255, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Valor encima de la barra
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${data[i]}%`, x + barWidth / 2, y - 5);
        
        // Etiqueta debajo de la barra
        ctx.font = '10px Arial';
        ctx.fillText(labels[i], x + barWidth / 2, canvas.height - 10);
    }
}

function createSatisfactionChart() {
    const canvas = document.getElementById('satisfactionChart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const data = chartData.satisfaction.data;
    const labels = chartData.satisfaction.labels;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Área bajo la curva
    ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    
    for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((data[i] - minValue) / range) * chartHeight;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Línea principal
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((data[i] - minValue) / range) * chartHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Puntos
    ctx.fillStyle = '#00ff88';
    for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((data[i] - minValue) / range) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Etiquetas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < labels.length; i++) {
        const x = padding + (chartWidth / (labels.length - 1)) * i;
        ctx.fillText(labels[i], x, canvas.height - 10);
    }
}

// Actualizar gráficos
function updateCharts() {
    showNotification('📊 Actualizando gráficos...', 'info');
    
    setTimeout(() => {
        createCharts();
        showNotification('✅ Gráficos actualizados', 'success');
    }, 1000);
}

function updateRevenueChart(period) {
    showNotification(`📈 Cambiando vista a ${period}...`, 'info');
    
    setTimeout(() => {
        createRevenueChart();
        showNotification('✅ Vista actualizada', 'success');
    }, 800);
}

// Animar KPIs
function animateKPIs() {
    const kpis = [
        { id: 'totalRevenue', target: 2847350, prefix: '$', suffix: '', duration: 2000 },
        { id: 'totalShipments', target: 1247, prefix: '', suffix: '', duration: 1800 },
        { id: 'activeClients', target: 247, prefix: '', suffix: '', duration: 1600 },
        { id: 'satisfaction', target: 98.5, prefix: '', suffix: '%', duration: 2200 }
    ];
    
    kpis.forEach(kpi => {
        const element = document.getElementById(kpi.id);
        if (!element) return;
        
        let current = 0;
        const increment = kpi.target / (kpi.duration / 50);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= kpi.target) {
                current = kpi.target;
                clearInterval(timer);
            }
            
            let displayValue;
            if (kpi.id === 'totalRevenue') {
                displayValue = Math.floor(current).toLocaleString();
            } else if (kpi.id === 'satisfaction') {
                displayValue = (Math.floor(current * 10) / 10).toFixed(1);
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = kpi.prefix + displayValue + kpi.suffix;
        }, 50);
    });
}

// Funciones de reportes
function generateReport() {
    showModal('customReport');
}

function generatePredefinedReport(type) {
    const reportTypes = {
        monthly: 'Reporte Mensual',
        clients: 'Análisis de Clientes',
        financial: 'Reporte Financiero',
        operations: 'Reporte Operacional'
    };
    
    showNotification(`📄 Generando ${reportTypes[type]}...`, 'info');
    
    setTimeout(() => {
        showNotification(`✅ ${reportTypes[type]} generado exitosamente`, 'success');
    }, 3000);
}

function exportData() {
    showNotification('📤 Exportando datos...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Datos exportados exitosamente', 'success');
    }, 2000);
}

// Extender la función showModal para incluir modales específicos de reportes
const originalShowModal = window.showModal;
window.showModal = function(type, data = null) {
    if (type === 'customReport') {
        showReportModal();
    } else {
        originalShowModal(type, data);
    }
};

function showReportModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = '📄 Generar Reporte Personalizado';
    modalBody.innerHTML = `
        <form class="modal-form" onsubmit="createCustomReport(event)">
            <div class="form-section">
                <h4>📊 Tipo de Reporte</h4>
                <div class="report-types">
                    <label class="report-type-option">
                        <input type="checkbox" name="reportType" value="revenue">
                        <span class="checkmark"></span>
                        <div class="option-info">
                            <div class="option-title">💰 Ingresos y Facturación</div>
                            <div class="option-desc">Análisis detallado de ingresos</div>
                        </div>
                    </label>
                    <label class="report-type-option">
                        <input type="checkbox" name="reportType" value="operations">
                        <span class="checkmark"></span>
                        <div class="option-info">
                            <div class="option-title">📦 Operaciones</div>
                            <div class="option-desc">Métricas operacionales</div>
                        </div>
                    </label>
                    <label class="report-type-option">
                        <input type="checkbox" name="reportType" value="clients">
                        <span class="checkmark"></span>
                        <div class="option-info">
                            <div class="option-title">👥 Clientes</div>
                            <div class="option-desc">Análisis de cartera</div>
                        </div>
                    </label>
                    <label class="report-type-option">
                        <input type="checkbox" name="reportType" value="performance">
                        <span class="checkmark"></span>
                        <div class="option-info">
                            <div class="option-title">⚡ Rendimiento</div>
                            <div class="option-desc">KPIs y métricas</div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="form-section">
                <h4>📅 Período</h4>
                <div class="form-row">
                    <div class="input-group">
                        <label>Fecha inicio</label>
                        <input type="date" name="startDate" required>
                    </div>
                    <div class="input-group">
                        <label>Fecha fin</label>
                        <input type="date" name="endDate" required>
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h4>📋 Formato</h4>
                <div class="format-options">
                    <label class="format-option">
                        <input type="radio" name="format" value="pdf" checked>
                        <span>📄 PDF</span>
                    </label>
                    <label class="format-option">
                        <input type="radio" name="format" value="excel">
                        <span>📊 Excel</span>
                    </label>
                    <label class="format-option">
                        <input type="radio" name="format" value="csv">
                        <span>📋 CSV</span>
                    </label>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">📄 Generar Reporte</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // Configurar fechas por defecto
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    modal.querySelector('input[name="startDate"]').value = firstDay.toISOString().split('T')[0];
    modal.querySelector('input[name="endDate"]').value = today.toISOString().split('T')[0];
}

function createCustomReport(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reportTypes = formData.getAll('reportType');
    const format = formData.get('format');
    
    if (reportTypes.length === 0) {
        showNotification('⚠️ Selecciona al menos un tipo de reporte', 'warning');
        return;
    }
    
    showNotification('📄 Generando reporte personalizado...', 'info');
    closeModal();
    
    setTimeout(() => {
        showNotification(`✅ Reporte ${format.toUpperCase()} generado exitosamente`, 'success');
    }, 3000);
}

// Estilos CSS adicionales para reportes
const reportsStyles = `
    .period-filters {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .filters-container h3 {
        color: #00f5ff;
        margin-bottom: 1rem;
    }
    
    .filter-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
    }
    
    .period-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .period-btn {
        padding: 0.5rem 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .period-btn.active,
    .period-btn:hover {
        background: rgba(0, 245, 255, 0.2);
        color: #00f5ff;
        border-color: #00f5ff;
    }
    
    .custom-range {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .custom-range input {
        padding: 0.5rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
    }
    
    .custom-range span {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .kpi-dashboard {
        margin-bottom: 2rem;
    }
    
    .kpi-dashboard h3 {
        color: #00f5ff;
        margin-bottom: 1.5rem;
    }
    
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .kpi-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
    }
    
    .kpi-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 245, 255, 0.2);
        border-color: rgba(0, 245, 255, 0.5);
    }
    
    .kpi-icon {
        font-size: 2.5rem;
        opacity: 0.8;
    }
    
    .kpi-value {
        font-size: 2rem;
        font-weight: bold;
        color: #00f5ff;
        margin-bottom: 0.3rem;
    }
    
    .kpi-label {
        color: #ccc;
        margin-bottom: 0.3rem;
    }
    
    .kpi-change {
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .kpi-change.positive {
        color: #00ff88;
    }
    
    .kpi-change.negative {
        color: #ff6b35;
    }
    
    .charts-section {
        margin-bottom: 2rem;
    }
    
    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
    }
    
    .chart-container {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .chart-header h4 {
        color: #00f5ff;
        margin: 0;
    }
    
    .chart-controls select {
        padding: 0.3rem 0.5rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 0.8rem;
    }
    
    .chart-content {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .chart-content canvas {
        max-width: 100%;
        max-height: 100%;
    }
    
    .detailed-analysis {
        margin-bottom: 2rem;
    }
    
    .analysis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
    }
    
    .analysis-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
    }
    
    .analysis-card h4 {
        color: #00f5ff;
        margin-bottom: 1rem;
    }
    
    .ranking-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .ranking-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .rank {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00f5ff, #0099cc);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
    }
    
    .client-info {
        flex: 1;
    }
    
    .client-name {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .client-stats {
        font-size: 0.8rem;
        color: #888;
    }
    
    .client-score {
        font-weight: bold;
        color: #00ff88;
    }
    
    .routes-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .route-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .route-info {
        flex: 1;
    }
    
    .route-path {
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .route-stats {
        font-size: 0.8rem;
        color: #888;
    }
    
    .route-progress {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 100px;
    }
    
    .progress-bar {
        width: 60px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00f5ff, #00ff88);
        border-radius: 3px;
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .metric-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    
    .metric-icon {
        font-size: 1.5rem;
    }
    
    .metric-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #00f5ff;
        margin-bottom: 0.2rem;
    }
    
    .metric-label {
        font-size: 0.8rem;
        color: #ccc;
        margin-bottom: 0.2rem;
    }
    
    .metric-change {
        font-size: 0.7rem;
        font-weight: 500;
    }
    
    .metric-change.positive {
        color: #00ff88;
    }
    
    .metric-change.negative {
        color: #ff6b35;
    }
    
    .predefined-reports {
        margin-bottom: 2rem;
    }
    
    .predefined-reports h3 {
        color: #00f5ff;
        margin-bottom: 1.5rem;
    }
    
    .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .report-card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 1.5rem;
        border: 1px solid rgba(0, 245, 255, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .report-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 245, 255, 0.2);
        border-color: rgba(0, 245, 255, 0.5);
    }
    
    .report-icon {
        font-size: 3rem;
        opacity: 0.8;
    }
    
    .report-content h4 {
        color: #00f5ff;
        margin-bottom: 0.5rem;
    }
    
    .report-content p {
        color: #ccc;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
    
    .report-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: #888;
    }
    
    /* Estilos para modal de reporte personalizado */
    .report-types {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .report-type-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .report-type-option:hover {
        border-color: #00f5ff;
        background: rgba(0, 245, 255, 0.05);
    }
    
    .format-options {
        display: flex;
        gap: 1rem;
    }
    
    .format-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1rem;
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .format-option:hover {
        border-color: #00f5ff;
        background: rgba(0, 245, 255, 0.05);
    }
    
    .format-option input[type="radio"] {
        margin-right: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .filter-options {
            flex-direction: column;
            gap: 1rem;
        }
        
        .period-buttons {
            flex-wrap: wrap;
        }
        
        .charts-grid {
            grid-template-columns: 1fr;
        }
        
        .analysis-grid {
            grid-template-columns: 1fr;
        }
        
        .reports-grid {
            grid-template-columns: 1fr;
        }
        
        .report-types {
            grid-template-columns: 1fr;
        }
        
        .format-options {
            flex-direction: column;
        }
    }
`;

// Agregar estilos específicos de reportes
const reportsStyleSheet = document.createElement('style');
reportsStyleSheet.textContent = reportsStyles;
document.head.appendChild(reportsStyleSheet);

