// Elementos do DOM
const form = document.getElementById('astralForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// URL base da API
const API_BASE_URL = window.location.origin;

// Event listener para o formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generateBirthChart();
});

// Função principal para gerar o mapa astral
async function generateBirthChart() {
    try {
        showLoading(true);
        hideError();
        hideResults();

        const formData = getFormData();
        const birthChartData = await callBirthChartAPI(formData);
        
        displayResults(birthChartData, formData);
        showResults();
        
    } catch (err) {
        console.error('Erro ao gerar mapa astral:', err);
        showError(err.message || 'Erro interno. Tente novamente.');
    } finally {
        showLoading(false);
    }
}

// Capturar dados do formulário
function getFormData() {
    const formData = new FormData(form);
    const date = new Date(formData.get('date') + 'T' + formData.get('time'));
    
    return {
        name: formData.get('name'),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        city: formData.get('city'),
        nation: 'BR', // Pode ser ajustado baseado na cidade se necessário
        theme: formData.get('theme') || 'light'
    };
}

// Chamar API de mapa astral
async function callBirthChartAPI(data) {
    const requestBody = {
        subject: {
            name: data.name,
            year: data.year,
            month: data.month,
            day: data.day,
            hour: data.hour,
            minute: data.minute,
            city: data.city,
            nation: data.nation,
            geonames_username: true, // Usa o username 'gfcramos' configurado no servidor
            zodiac_type: 'Tropic'
        },
        theme: data.theme,
        language: 'PT'
    };

    const response = await fetch(`${API_BASE_URL}/api/v4/birth-chart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

// Exibir resultados
function displayResults(data, formData) {
    // Informações do usuário
    document.getElementById('resultName').textContent = formData.name;
    document.getElementById('resultDate').textContent = formatDate(formData);

    // SVG do mapa astral
    document.getElementById('chartSvg').innerHTML = data.chart;

    // Dados astrológicos
    displayAstrologicalData(data.data);

    // Aspectos
    displayAspects(data.aspects);
}

// Formatear data para exibição
function formatDate(data) {
    return `${data.day.toString().padStart(2, '0')}/${data.month.toString().padStart(2, '0')}/${data.year} às ${data.hour.toString().padStart(2, '0')}:${data.minute.toString().padStart(2, '0')}`;
}

// Exibir dados astrológicos
function displayAstrologicalData(data) {
    const container = document.getElementById('astrologicalData');
    
    if (!data || !data.planets_degrees) {
        container.innerHTML = '<p>Dados astrológicos não disponíveis.</p>';
        return;
    }

    const planetNames = {
        'Sun': 'Sol',
        'Moon': 'Lua',
        'Mercury': 'Mercúrio',
        'Venus': 'Vênus',
        'Mars': 'Marte',
        'Jupiter': 'Júpiter',
        'Saturn': 'Saturno',
        'Uranus': 'Urano',
        'Neptune': 'Netuno',
        'Pluto': 'Plutão',
        'Mean_Node': 'Nodo Norte',
        'Chiron': 'Quíron',
        'Ascendant': 'Ascendente',
        'Medium_Coeli': 'Meio do Céu'
    };

    const signNames = {
        'Ari': 'Áries',
        'Tau': 'Touro',
        'Gem': 'Gêmeos',
        'Can': 'Câncer',
        'Leo': 'Leão',
        'Vir': 'Virgem',
        'Lib': 'Libra',
        'Sco': 'Escorpião',
        'Sag': 'Sagitário',
        'Cap': 'Capricórnio',
        'Aqu': 'Aquário',
        'Pis': 'Peixes'
    };

    let html = '<div class="planet-info">';
    
    Object.entries(data.planets_degrees).forEach(([planet, info]) => {
        const planetName = planetNames[planet] || planet;
        const signName = signNames[info.sign] || info.sign || 'N/A';
        
        html += `
            <div class="planet-card">
                <div class="planet-name">${planetName}</div>
                <div class="planet-details">
                    Signo: ${signName}<br>
                    Grau: ${(info.abs_pos || 0).toFixed(2)}°<br>
                    Casa: ${info.house || 'N/A'}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Exibir aspectos
function displayAspects(aspects) {
    const container = document.getElementById('aspectsData');
    
    if (!aspects || aspects.length === 0) {
        container.innerHTML = '<p>Nenhum aspecto encontrado.</p>';
        return;
    }

    const aspectNames = {
        'conjunction': 'Conjunção',
        'opposition': 'Oposição',
        'trine': 'Trígono',
        'square': 'Quadratura',
        'sextile': 'Sextil',
        'quintile': 'Quintil',
        'semi_sextile': 'Semi-sextil',
        'quincunx': 'Quincunx'
    };

    const planetNames = {
        'Sun': 'Sol',
        'Moon': 'Lua',
        'Mercury': 'Mercúrio',
        'Venus': 'Vênus',
        'Mars': 'Marte',
        'Jupiter': 'Júpiter',
        'Saturn': 'Saturno',
        'Uranus': 'Urano',
        'Neptune': 'Netuno',
        'Pluto': 'Plutão',
        'Mean_Node': 'Nodo Norte',
        'Chiron': 'Quíron',
        'Ascendant': 'Ascendente',
        'Medium_Coeli': 'Meio do Céu'
    };

    let html = '<div class="aspects-grid">';
    
    aspects.forEach(aspect => {
        const aspectName = aspectNames[aspect.aspect] || aspect.aspect;
        const planet1 = planetNames[aspect.p1_name] || aspect.p1_name;
        const planet2 = planetNames[aspect.p2_name] || aspect.p2_name;
        
        html += `
            <div class="aspect-card">
                <div class="aspect-type">${aspectName}</div>
                <div class="aspect-details">
                    ${planet1} ↔ ${planet2}<br>
                    Orbe: ${(aspect.orbit || aspect.orb || 0).toFixed(2)}°
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Função para mostrar/esconder loading
function showLoading(show) {
    if (show) {
        btnText.classList.add('hidden');
        loading.classList.remove('hidden');
        generateBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        loading.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

// Função para mostrar erro
function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

// Função para esconder erro
function hideError() {
    error.classList.add('hidden');
}

// Função para mostrar resultados
function showResults() {
    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth' });
}

// Função para esconder resultados
function hideResults() {
    results.classList.add('hidden');
}

// Configurações iniciais
document.addEventListener('DOMContentLoaded', () => {
    // Não é mais necessário pré-preencher coordenadas
    // O Geonames fará a geocodificação automaticamente
});