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

function drawRouteToPlace(destLat, destLng, placeName) {
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
    createMarker: function() { return null; },
    lineOptions: {
      styles: [{ color: '#0284c7', opacity: 0.9, weight: 6 }]
    }
  }).addTo(map);

  const statusMsg = document.getElementById('statusMessage');
  const originLabel = userLocation ? "sua localização atual" : "o Centro de Londrina";
  statusMsg.innerHTML = `<i class="fa-solid fa-route" style="color:#0284c7;"></i> Traçando rota de <strong>${originLabel}</strong> até <strong>${placeName}</strong>.`;
}

function initMap() {
  map = L.map('map').setView([-23.3103, -51.1592], 12);

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

      const sortedPlaces = eWastePlaces.map(place => {
        const dist = calculateDistance(lat, lng, place.lat, place.lng);
        return { ...place, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      plotMarkers(sortedPlaces);
      renderPlacesList(sortedPlaces);

      const closest = sortedPlaces[0];
      drawRouteToPlace(closest.lat, closest.lng, closest.name);
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Rota traçada! O ponto mais próximo é <strong>${closest.name}</strong> (${closest.distance.toFixed(1)} km de você).`;
    },
    (error) => {
      statusMsg.innerHTML = "Não foi possível obter sua localização. Permita o acesso à localização.";
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
  statusMsg.innerHTML = `Encontrado(s) <strong>${filtered.length}</strong> ponto(s) para "<em>${query}</em>".`;
}

const PIX_KEY = "SUA_CHAVE_PIX_AQUI";

window.openAdModalWithPrice = function(amount, planTitle) {
  const adModal = document.getElementById('adPaymentModal');
  const stepPix = document.getElementById('stepPixPayment');
  const stepForm = document.getElementById('stepMarketingForm');
  
  document.getElementById('modalPlanBadge').innerText = `PLANO SELECIONADO • VALOR: R$ ${amount}`;
  document.getElementById('modalPlanTitle').innerText = planTitle;

  const payload = generatePixPayload(PIX_KEY, amount);
  document.getElementById('pixPayloadInput').value = payload;
  document.getElementById('pixQrImage').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`;

  adModal.style.display = 'flex';
  if (getCookie('pix_paid_unlocked') === 'true') {
    stepPix.style.display = 'none';
    stepForm.style.display = 'block';
  } else {
    stepPix.style.display = 'block';
    stepForm.style.display = 'none';
  }
};

function generatePixPayload(key, amount = "30.00", merchantName = "ANUNCIANTE", city = "LONDRINA") {
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
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('lgpd_aceito') !== 'true') {
    const overlay = document.createElement('div');
    overlay.id = 'jsCookieBox';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      background: #ffffff;
      max-width: 480px;
      width: 100%;
      padding: 28px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    `;

    box.innerHTML = `
      <div style="font-size: 2.5rem; color: #047857; margin-bottom: 12px;">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <h3 style="color: #0f172a; margin-bottom: 10px; font-size: 1.35rem; font-family: sans-serif;">Aviso de Privacidade e Proteção de Dados</h3>
      <p style="font-size: 0.95rem; color: #475569; margin-bottom: 20px; font-family: sans-serif; line-height: 1.5;">
        Aviso de Cookies e Privacidade: este site opera sem banco de dados (SGBD) de rastreamento de usuários.
      </p>
      <button id="btnJsAceitar" type="button" style="
        background: #047857;
        color: #fff;
        border: none;
        padding: 14px 24px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        width: 100%;
      ">Entendi e Continuar</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const apagarCaixa = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      localStorage.setItem('lgpd_aceito', 'true');
      overlay.remove();
    };

    const btnAceitar = document.getElementById('btnJsAceitar');
    btnAceitar.addEventListener('click', apagarCaixa);
    btnAceitar.addEventListener('touchend', apagarCaixa);
    btnAceitar.addEventListener('pointerdown', apagarCaixa);
  }

  initMap();

  document.getElementById('btnGeo').addEventListener('click', getUserLocation);
  document.getElementById('btnSearch').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID_AQUI"
  };

  let db = null;
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }

  const adModal = document.getElementById('adPaymentModal');
  const btnCloseAd = document.getElementById('btnCloseAdModal');
  const stepPix = document.getElementById('stepPixPayment');
  const stepForm = document.getElementById('stepMarketingForm');
  const txIdInput = document.getElementById('pixTxIdInput');
  const receiptInput = document.getElementById('pixReceiptInput');
  const btnVerifyPix = document.getElementById('btnVerifyPix');

  if (btnCloseAd) {
    btnCloseAd.addEventListener('click', () => {
      adModal.style.display = 'none';
    });
  }

  const btnCopyKey = document.getElementById('btnCopyPixKey');
  if (btnCopyKey) {
    btnCopyKey.addEventListener('click', () => {
      navigator.clipboard.writeText(PIX_KEY);
      alert('Chave Pix copiada: ' + PIX_KEY);
    });
  }

  const btnCopyPayload = document.getElementById('btnCopyPayload');
  if (btnCopyPayload) {
    btnCopyPayload.addEventListener('click', () => {
      const payload = document.getElementById('pixPayloadInput').value;
      navigator.clipboard.writeText(payload);
      alert('Código Pix Copia e Cola copiado!');
    });
  }

  function checkPixInputs() {
    if (!receiptInput || !txIdInput || !btnVerifyPix) return;
    const hasReceipt = receiptInput.files.length > 0;
    const hasValidTxId = txIdInput.value.trim().length >= 10;
    btnVerifyPix.disabled = !(hasReceipt && hasValidTxId);
  }

  if (receiptInput) receiptInput.addEventListener('change', checkPixInputs);
  if (txIdInput) txIdInput.addEventListener('input', checkPixInputs);

  if (btnVerifyPix) {
    btnVerifyPix.addEventListener('click', async () => {
      const txId = txIdInput.value.trim();
      btnVerifyPix.disabled = true;
      btnVerifyPix.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando ID do Pix...';

      if (db) {
        const existing = await db.collection('anuncios_pagos').where('txId', '==', txId).get();
        if (!existing.empty) {
          alert('Este ID de transação Pix já foi utilizado anteriormente.');
          btnVerifyPix.innerHTML = '<i class="fa-solid fa-unlock"></i> Confirmar Pix e Liberar Divulgação';
          btnVerifyPix.disabled = false;
          return;
        }
      }

      setTimeout(() => {
        setCookie('pix_paid_unlocked', 'true', 7);
        sessionStorage.setItem('current_pix_txid', txId);
        stepPix.style.display = 'none';
        stepForm.style.display = 'block';
      }, 800);
    });
  }

  const sponsorsGrid = document.getElementById('sponsorsGrid');
  function drawAdsCards(adsList) {
    if (!sponsorsGrid) return;
    sponsorsGrid.innerHTML = '';
    adsList.forEach(ad => {
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

  function loadPublicSponsors() {
    if (db) {
      db.collection('anuncios_pagos').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const publicAds = [];
        snapshot.forEach(doc => publicAds.push(doc.data()));
        drawAdsCards(publicAds);
      });
    } else {
      const localAds = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');
      drawAdsCards(localAds);
    }
  }

  loadPublicSponsors();

  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scale = MAX_WIDTH / img.width;
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scale : img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  const marketingForm = document.getElementById('marketingForm');
  if (marketingForm) {
    marketingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnPublish = document.getElementById('btnPublishAd');
      btnPublish.disabled = true;
      btnPublish.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando para todos...';

      const name = document.getElementById('bizName').value.trim();
      const category = document.getElementById('bizCategory').value.trim();
      const desc = document.getElementById('bizDesc').value.trim();
      const link = document.getElementById('bizLink').value.trim();
      const txId = sessionStorage.getItem('current_pix_txid') || 'PIX-' + Date.now();
      const imgFile = document.getElementById('bizImage').files.length > 0 ? document.getElementById('bizImage').files[0] : null;

      const saveAd = async (imgData) => {
        const adData = {
          name,
          category,
          desc,
          link,
          image: imgData,
          txId,
          createdAt: Date.now()
        };

        if (db) {
          await db.collection('anuncios_pagos').add(adData);
        } else {
          const currentAds = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');
          currentAds.unshift(adData);
          localStorage.setItem('lixo_eletronico_ads', JSON.stringify(currentAds));
          loadPublicSponsors();
        }

        setCookie('pix_paid_unlocked', 'false', -1);
        sessionStorage.removeItem('current_pix_txid');
        e.target.reset();
        txIdInput.value = '';
        receiptInput.value = '';
        btnVerifyPix.disabled = true;
        btnVerifyPix.innerHTML = '<i class="fa-solid fa-unlock"></i> Confirmar Pix e Liberar Divulgação';
        btnPublish.disabled = false;
        btnPublish.innerHTML = '<i class="fa-solid fa-check"></i> Publicar Anúncio para Todos';
        adModal.style.display = 'none';
      };

      if (imgFile) {
        compressImage(imgFile, saveAd);
      } else {
        saveAd(null);
      }
    });
  }
});