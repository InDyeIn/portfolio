// Configuração inicial do mapa
let map;
const defaultLocation = [-22.8205, -47.2669]; // Região de Sumaré/Campinas como padrão

// Base de dados expandida de hospitais/locais de coleta
const hospitals = [
    // Americana
    { id: "americana1", name: "Centro de Hematologia Americana", lat: -22.7447, lng: -47.3283, needs: ["O-", "A+", "B-"], address: "Praça Francisco Matarazzo, 60, Vila Galo" },

    // Campinas
    { id: "campinas1", name: "Hemocentro Unicamp", lat: -22.8286, lng: -47.0635, needs: ["O-", "O+", "A-"], address: "R. Carlos Chagas, 480, Cidade Universitária" },
    { id: "campinas2", name: "Hemocentro Amoreiras (CDO)", lat: -22.9231, lng: -47.0744, needs: ["AB+", "O+"], address: "Av. das Amoreiras, 860, Parque Itália" },
    { id: "campinas3", name: "Pulsa São Paulo – Campinas", lat: -22.8985, lng: -47.0543, needs: ["A+", "B-"], address: "Av. Júlio de Mesquita, 571, Cambuí" },
    { id: "campinas4", name: "Laboratório Fleury Campinas", lat: -22.8961, lng: -47.0528, needs: ["O-", "AB-"], address: "Av. Júlio de Mesquita, 923, Cambuí" },
    { id: "campinas5", name: "Laboratório Confiance – Taquaral", lat: -22.8856, lng: -47.0578, needs: ["A-", "B+"], address: "Av. Dr. Heitor Penteado, 1080, Taquaral" },

    // Indaiatuba
    { id: "indaiatuba1", name: "PoCER – Posto de Coleta Externa Regular de Indaiatuba", lat: -23.118254761265714, lng: -47.234769974988524, needs: ["O+", "A+"], address: "Ambulatório de Especialidades da Morada do Sol Dr. Mário Paulo (Centro de Oncologia), Rua Hélio Pistoni, s/n, Jardim Morada do Sol." },
    { id: "indaiatuba2", name: "FIEC – Fundação Indaiatubana de Educação e Cultura", lat: -23.0887, lng: -47.2186, needs: ["AB-", "O-"], address: "Av. Eng. Fábio Roberto Barnabé, 3405 - Jardim Regina, Indaiatuba - SP, 13349-003" },
    
    // Sumaré
    { id: "sumare3", name: "Hemocentro Sumaré (Hospital Estadual)", lat: -22.8344, lng: -47.2344, needs: ["O-", "AB+", "A-"], address: "Av. da Amizade, 2400" },
    ];

const markers = {};

function initMap() {
    map = L.map('map', {
        zoomControl: false
    }).setView(defaultLocation, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    addHospitalMarkers();
    setupSelectListeners();
}

function addHospitalMarkers() {
    const hospitalIcon = L.divIcon({
        className: 'hospital-marker',
        html: '<div style="background-color: #ED1C24; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold; border: 2px solid white; box-shadow: 0 0 15px rgba(237, 28, 36, 0.4);">H</div>',
        iconSize: [24, 24]
    });

    hospitals.forEach(hosp => {
        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospitalIcon }).addTo(map);
        markers[hosp.id] = marker;

        marker.on('click', () => {
            showHospitalInfo(hosp);
        });

        marker.bindPopup(`<b>${hosp.name}</b><br>${hosp.address}<br>Urgente: ${hosp.needs.join(', ')}`);
    });
}

function setupSelectListeners() {
    const selects = document.querySelectorAll('select.form-select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const hospitalId = e.target.value;
            const hospital = hospitals.find(h => h.id === hospitalId);

            if (hospital) {
                // Centraliza o mapa no hospital selecionado
                map.flyTo([hospital.lat, hospital.lng], 16);

                // Abre o popup do marcador
                if (markers[hospitalId]) {
                    markers[hospitalId].openPopup();
                }

                // Mostra as informações no card
                showHospitalInfo(hospital);
            }
        });
    });
}

function showHospitalInfo(hosp) {
    const infoCard = document.getElementById('hospital-info');
    const h3 = infoCard.querySelector('h3');
    const bloodNeeds = infoCard.querySelector('.blood-needs');
    const addressP = infoCard.querySelector('.distance'); // Reutilizando o parágrafo de distância para o endereço

    h3.innerText = hosp.name;
    addressP.innerText = hosp.address;
    bloodNeeds.innerHTML = '';

    hosp.needs.forEach(need => {
        const span = document.createElement('span');
        span.className = 'tag' + (need.includes('-') ? ' urgent' : '');
        span.innerText = need;
        bloodNeeds.appendChild(span);
    });

    infoCard.style.transform = 'translateY(0)';
}

document.addEventListener('DOMContentLoaded', initMap);

document.addEventListener('click', (e) => {
    if (!e.target.closest('.hospital-marker') && !e.target.closest('.info-card') && !e.target.closest('.form-select')) {
        document.getElementById('hospital-info').style.transform = 'translateY(200%)';
    }
});
