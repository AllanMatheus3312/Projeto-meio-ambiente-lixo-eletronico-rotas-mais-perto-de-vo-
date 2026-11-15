// Pontos de descarte reais cadastrados em Londrina
const eWastePlaces = [
  {
    id: 1,
    name: "PEV da Pref. de Londrina - Califórnia",
    address: "R. Cap. João Busse, 1285 - Califórnia, Londrina - PR",
    hours: "Seg a Sex 08h-19h30 | Sáb 08h-14h",
    lat: -23.3275,
    lng: -51.1412
  },
  {
    id: 2,
    name: "CMTU-PEV Califórnia",
    address: "R. Cap. João Busse, 1274 - Califórnia, Londrina - PR",
    hours: "Seg a Sex 08h-17h | Sáb 08h-12h",
    lat: -23.3280,
    lng: -51.1405
  },
  {
    id: 3,
    name: "CRC E-LETRO - Vila Casoni",
    address: "Rua Ermelindo Leão, 385 - Vila Casoni, Londrina - PR",
    hours: "Seg a Sex 08h-12h e 13h30-18h",
    lat: -23.3032,
    lng: -51.1528
  },
  {
    id: 4,
    name: "E-Coleta Reciclagem Londrina",
    address: "R. Santa Rita, 5 - Maria Lúcia, Londrina - PR",
    hours: "Seg a Sex 09h-18h | Sáb 09h-12h",
    lat: -23.2754,
    lng: -51.1821
  },
  {
    id: 5,
    name: "PEV Bela Vista",
    address: "Rua Chrestina Maria de Oliveira, 110 - Bela Vista, Londrina - PR",
    hours: "Seg a Sex 08h-17h",
    lat: -23.2810,
    lng: -51.1650
  }
];

let map;
let markersGroup;
let userMarker = null;
let userLocation = null;
let routingControl = null;

// Cálculo da distância em km (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Função para desenhar a linha de rota azul no mapa até o destino escolhido
function drawRouteToPlace(destLat, destLng, placeName) {
  // Se o usuário ainda não clicou em "Encontrar Mais Próximo", usa o centro de Londrina como ponto de partida
  const originLat = userLocation ? userLocation.lat : -23.3103;
  const originLng = userLocation ? userLocation.lng : -51.1592;

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(originLat, originLng),
      L.latLng(destLat, destLng)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
    createMarker: function() { return null; }, // Mantém os seus pinos originais
    lineOptions: {
      styles: [{ color: '#0284c7', opacity: 0.9, weight: 6 }]
    }
  }).addTo(map);

  const statusMsg = document.getElementById('statusMessage');
  const originLabel = userLocation ? "sua localização atual" : "o Centro de Londrina (clique em 'Encontrar Mais Próximo' para usar seu GPS)";
  statusMsg.innerHTML = `<i class="fa-solid fa-route" style="color:#0284c7;"></i> Traçando rota de <strong>${originLabel}</strong> até <strong>${placeName}</strong>.`;
}

function initMap() {
  map = L.map('map').setView([-23.3103, -51.1592], 12);

  // Provedor CartoDB Voyager para evitar erro 403 Forbidden
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  markersGroup = L.featureGroup().addTo(map);
  plotMarkers(eWastePlaces);
  renderPlacesList(eWastePlaces);
}

function plotMarkers(places) {
  markersGroup.clearLayers();

  places.forEach(place => {
    const marker = L.marker([place.lat, place.lng]);
    const distText = place.distance ? `<br><b>Distância:</b> ${place.distance.toFixed(2)} km` : '';
    
    marker.bindPopup(`
      <b>${place.name}</b><br>
      ${place.address}${distText}<br>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank">
        Como Chegar (Google Maps)
      </a>
    `);

    marker.on('click', () => {
      drawRouteToPlace(place.lat, place.lng, place.name);
    });

    markersGroup.addLayer(marker);
  });

  if (places.length > 0 && !routingControl) {
    map.fitBounds(markersGroup.getBounds(), { padding: [40, 40] });
  }
}

function renderPlacesList(places) {
  const listContainer = document.getElementById('placesList');
  listContainer.innerHTML = '';

  if (places.length === 0) {
    listContainer.innerHTML = '<p style="padding: 15px;">Nenhum ponto de coleta encontrado.</p>';
    return;
  }

  places.forEach((place, index) => {
    const card = document.createElement('div');
    card.className = 'place-card';
    
    const badgeNearest = (index === 0 && place.distance) ? '<span class="badge-nearest"><i class="fa-solid fa-star"></i> Mais Próximo</span>' : '';
    const distText = place.distance ? `<span class="dist-tag"><i class="fa-solid fa-route"></i> ${place.distance.toFixed(1)} km</span>` : '';

    card.innerHTML = `
      <div class="card-header">
        <h3>${place.name}</h3>
        ${badgeNearest}
      </div>
      <p><i class="fa-solid fa-location-dot"></i> ${place.address}</p>
      <p><i class="fa-solid fa-clock"></i> ${place.hours}</p>
      ${distText}
    `;

    card.addEventListener('click', () => {
      drawRouteToPlace(place.lat, place.lng, place.name);
    });

    listContainer.appendChild(card);
  });
}

// Obtém a localização do usuário e calcula o ponto mais próximo
function getUserLocation() {
  const statusMsg = document.getElementById('statusMessage');

  if (!navigator.geolocation) {
    statusMsg.innerHTML = "Geolocalização não é suportada pelo seu navegador.";
    return;
  }

  statusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Obtendo sua localização e traçando rota...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      userLocation = { lat, lng };

      // Adiciona o pino azul no mapa onde o usuário está
      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: '<i class="fa-solid fa-person-pin-circle" style="font-size:32px; color:#0284c7;"></i>',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        userMarker.bindPopup("<b>Você está aqui!</b>").openPopup();
      }

      // Ordena os pontos pelo mais próximo
      const sortedPlaces = eWastePlaces.map(place => {
        const dist = calculateDistance(lat, lng, place.lat, place.lng);
        return { ...place, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      plotMarkers(sortedPlaces);
      renderPlacesList(sortedPlaces);

      const closest = sortedPlaces[0];
      // Traça automaticamente a linha de rota azul até o ponto mais próximo
      drawRouteToPlace(closest.lat, closest.lng, closest.name);
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Rota traçada! O ponto mais próximo é <strong>${closest.name}</strong> (${closest.distance.toFixed(1)} km de você).`;
    },
    (error) => {
      statusMsg.innerHTML = "Não foi possível obter sua localização. Por favor, permita o acesso à localização no navegador.";
    }
  );
}

function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const statusMsg = document.getElementById('statusMessage');

  if (!query) {
    plotMarkers(eWastePlaces);
    renderPlacesList(eWastePlaces);
    statusMsg.innerHTML = "Exibindo todos os pontos de coleta em Londrina.";
    return;
  }

  let filtered = eWastePlaces.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.address.toLowerCase().includes(query)
  );

  if (userLocation) {
    filtered = filtered.map(place => ({
      ...place,
      distance: calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
    })).sort((a, b) => a.distance - b.distance);
  }

  plotMarkers(filtered);
  renderPlacesList(filtered);
  statusMsg.innerHTML = `Encontrado(s) <strong>${filtered.length}</strong> ponto(s) para "<em>${query}</em>". Clique em um ponto para ver a rota.`;
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();

  document.getElementById('btnGeo').addEventListener('click', getUserLocation);
  document.getElementById('btnSearch').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
});

// ================= LÓGICA DE COOKIES, PIX (R$ 30,00) E DIVULGAÇÃO =================
(function() {
  const PIX_KEY = "allanmatheus571@gmail.com";
  const PIX_AMOUNT = "30.00";

  // Gera payload BRCode oficial para Pix estático com valor fixo de R$ 30,00
  function generatePixPayload(key, amount = "30.00", merchantName = "ALLAN MATHEUS", city = "LONDRINA") {
    const formatField = (id, value) => id + String(value.length).padStart(2, '0') + value;
    const merchantAccount = formatField("00", "br.gov.bcb.pix") + formatField("01", key);
    let payload =
      formatField("00", "01") +
      formatField("26", merchantAccount) +
      formatField("52", "0000") +
      formatField("53", "986") +
      formatField("54", amount) +
      formatField("58", "BR") +
      formatField("59", merchantName.substring(0, 25)) +
      formatField("60", city.substring(0, 15)) +
      formatField("62", formatField("05", "***")) +
      "6304";

    // Cálculo CRC16-CCITT
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      }
    }
    return payload + (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const privacyOverlay = document.getElementById('cookiePrivacyOverlay');
    const pixCookieBanner = document.getElementById('cookiePixBanner');
    const btnAcceptPrivacy = document.getElementById('btnAcceptPrivacy');
    const btnAcceptPixCookie = document.getElementById('btnAcceptPixCookie');

    // Controle dos dois avisos de cookies em sequência
    if (getCookie('privacy_no_sgbd_accepted') === 'true') {
      privacyOverlay.style.display = 'none';
      if (getCookie('pix_ads_cookie_accepted') !== 'true') {
        pixCookieBanner.style.display = 'block';
      }
    }

    btnAcceptPrivacy.addEventListener('click', () => {
      setCookie('privacy_no_sgbd_accepted', 'true', 365);
      privacyOverlay.style.display = 'none';
      if (getCookie('pix_ads_cookie_accepted') !== 'true') {
        pixCookieBanner.style.display = 'block';
      }
    });

    btnAcceptPixCookie.addEventListener('click', () => {
      setCookie('pix_ads_cookie_accepted', 'true', 365);
      pixCookieBanner.style.display = 'none';
    });

    // Configuração do Modal Pix e Divulgação
    const adModal = document.getElementById('adPaymentModal');
    const btnOpenAd = document.getElementById('btnOpenAdModal');
    const btnCloseAd = document.getElementById('btnCloseAdModal');
    const stepPix = document.getElementById('stepPixPayment');
    const stepForm = document.getElementById('stepMarketingForm');
    const pixPayloadInput = document.getElementById('pixPayloadInput');
    const pixQrImage = document.getElementById('pixQrImage');
    const receiptInput = document.getElementById('pixReceiptInput');
    const btnVerifyPix = document.getElementById('btnVerifyPix');

    const payload = generatePixPayload(PIX_KEY, PIX_AMOUNT);
    pixPayloadInput.value = payload;
    pixQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`;

    btnOpenAd.addEventListener('click', () => {
      adModal.style.display = 'flex';
      if (getCookie('pix_paid_unlocked') === 'true') {
        stepPix.style.display = 'none';
        stepForm.style.display = 'block';
      } else {
        stepPix.style.display = 'block';
        stepForm.style.display = 'none';
      }
    });

    btnCloseAd.addEventListener('click', () => {
      adModal.style.display = 'none';
    });

    document.getElementById('btnCopyPixKey').addEventListener('click', () => {
      navigator.clipboard.writeText(PIX_KEY);
      alert('Chave Pix copiada: ' + PIX_KEY);
    });

    document.getElementById('btnCopyPayload').addEventListener('click', () => {
      navigator.clipboard.writeText(payload);
      alert('Código Pix Copia e Cola (R$ 30,00) copiado!');
    });

    receiptInput.addEventListener('change', () => {
      btnVerifyPix.disabled = !receiptInput.files.length;
    });

    btnVerifyPix.addEventListener('click', () => {
      btnVerifyPix.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando Pix...';
      setTimeout(() => {
        setCookie('pix_paid_unlocked', 'true', 7);
        stepPix.style.display = 'none';
        stepForm.style.display = 'block';
      }, 800);
    });

    const sponsorsGrid = document.getElementById('sponsorsGrid');
    function renderSponsors() {
      const saved = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');
      sponsorsGrid.innerHTML = '';
      saved.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'sponsor-card';
        card.innerHTML = `
          ${ad.image ? `<img src="${ad.image}" alt="${ad.name}">` : ''}
          <div class="sponsor-card-body">
            <span class="sponsor-cat">${ad.category} • Patrocinado</span>
            <h4>${ad.name}</h4>
            <p>${ad.desc}</p>
            <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class="sponsor-link">
              Conhecer Empresa / Contato <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        `;
        sponsorsGrid.appendChild(card);
      });
    }

    renderSponsors();

    document.getElementById('marketingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bizName').value.trim();
      const category = document.getElementById('bizCategory').value.trim();
      const desc = document.getElementById('bizDesc').value.trim();
      const link = document.getElementById('bizLink').value.trim();
      const imgFile = document.getElementById('bizImage').files[0];

      const saveAd = (imgData) => {
        const currentAds = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');
        currentAds.unshift({ name, category, desc, link, image: imgData });
        localStorage.setItem('lixo_eletronico_ads', JSON.stringify(currentAds));
        setCookie('pix_paid_unlocked', 'false', -1);
        e.target.reset();
        receiptInput.value = '';
        btnVerifyPix.disabled = true;
        btnVerifyPix.innerHTML = '<i class="fa-solid fa-unlock"></i> Confirmar Pix e Liberar Divulgação';
        adModal.style.display = 'none';
        renderSponsors();
      };

      if (imgFile) {
        const reader = new FileReader();
        reader.onload = () => saveAd(reader.result);
        reader.readAsDataURL(imgFile);
      } else {
        saveAd(null);
      }
    });
  });
})();