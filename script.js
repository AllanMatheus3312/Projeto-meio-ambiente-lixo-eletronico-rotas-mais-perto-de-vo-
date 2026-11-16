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

function setCookieRecord(name, dataObj, days = 30) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(dataObj))};${expires};path=/;SameSite=Lax`;
}

function getCookieRecord(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

function calculateRemainingDays(expiresAt) {
  const diff = expiresAt - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

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

function getGoogleMapsRouteUrl(destLat, destLng) {
  if (userLocation) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
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
  map = L.map('map', { attributionControl: false }).setView([-23.3103, -51.1592], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  markersGroup = L.featureGroup().addTo(map);
  plotMarkers(eWastePlaces);
  renderPlacesList(eWastePlaces);
}

function plotMarkers(places) {
  markersGroup.clearLayers();

  places.forEach((place, index) => {
    const isNearest = (index === 0 && place.distance);
    const pinColor = isNearest ? '#10b981' : '#ef4444';
    const labelHtml = isNearest 
      ? `<div class="map-label-nearest">Descarte Eletrônico • Mais Próximo (${place.distance.toFixed(1)} km)</div>` 
      : `<div style="background:#ef4444; color:#fff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:10px; white-space:nowrap; border:1.5px solid #fff; box-shadow:0 2px 4px rgba(0,0,0,0.3);">Coleta Eletrônica</div>`;

    const pinIcon = L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
          ${labelHtml}
          <i class="fa-solid fa-location-dot" style="font-size:${isNearest ? '38px' : '28px'}; color:${pinColor}; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.45));"></i>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    const marker = L.marker([place.lat, place.lng], { icon: pinIcon });
    const googleMapsRouteUrl = getGoogleMapsRouteUrl(place.lat, place.lng);

    const distText = place.distance ? `<br><b>Distância:</b> ${place.distance.toFixed(2)} km` : '';
    const nearestLabel = isNearest ? '<br><span style="color:#059669; font-weight:bold;">★ DESCARTE DE LIXO ELETRÔNICO MAIS PRÓXIMO</span>' : '<br><span style="color:#dc2626; font-weight:bold;">Ponto de Descarte de Lixo Eletrônico</span>';
    
    marker.bindPopup(`
      <b>${place.name}</b>${nearestLabel}<br>
      ${place.address}${distText}<br>
      <div style="margin-top: 8px;">
        <a href="${googleMapsRouteUrl}" target="_blank" rel="noopener noreferrer" style="background:#0284c7; color:#fff; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:11px; font-weight:bold; display:inline-block;">
          <i class="fa-solid fa-map-location-dot"></i> Abrir Rota no Google Maps
        </a>
      </div>
    `);

    if (isNearest) {
      setTimeout(() => marker.openPopup(), 300);
    }

    marker.on('click', () => {
      drawRouteToPlace(place.lat, place.lng, place.name);
    });

    markersGroup.addLayer(marker);
  });

  if (places.length > 0 && !routingControl) {
    map.fitBounds(markersGroup.getBounds(), { padding: [50, 50] });
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
    const googleMapsUrl = getGoogleMapsRouteUrl(place.lat, place.lng);

    card.innerHTML = `
      <div class="card-header">
        <h3>${place.name}</h3>
        ${badgeNearest}
      </div>
      <p><i class="fa-solid fa-location-dot"></i> ${place.address}</p>
      <p><i class="fa-solid fa-clock"></i> ${place.hours}</p>
      ${distText}
      <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
        <button type="button" class="btn-card-local-route" style="flex:1; background:#047857; color:#fff; border:none; padding:8px 10px; border-radius:6px; font-size:0.8rem; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px;">
          <i class="fa-solid fa-route"></i> Iniciar Rota Aqui
        </button>
        <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-gmaps" style="flex:1; background:#0284c7; color:#fff; text-decoration:none; padding:8px 10px; border-radius:6px; font-size:0.8rem; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:5px;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Google Maps
        </a>
      </div>
    `;

    card.querySelector('.btn-card-local-route').addEventListener('click', (e) => {
      e.stopPropagation();
      drawRouteToPlace(place.lat, place.lng, place.name);
      document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    card.querySelector('.btn-card-gmaps').addEventListener('click', (e) => {
      e.stopPropagation();
    });

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
          html: `
            <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
              <div class="map-label-user">Você está aqui</div>
              <i class="fa-solid fa-circle-dot" style="font-size:26px; color:#0284c7; background:#fff; border-radius:50%; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.45));"></i>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        userMarker.bindPopup("<b>Você está aqui!</b>");
      }

      const sortedPlaces = eWastePlaces.map(place => {
        const dist = calculateDistance(lat, lng, place.lat, place.lng);
        return { ...place, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      plotMarkers(sortedPlaces);
      renderPlacesList(sortedPlaces);

      const closest = sortedPlaces[0];
      drawRouteToPlace(closest.lat, closest.lng, closest.name);
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Rota iniciada! O ponto mais próximo é <strong>${closest.name}</strong> (${closest.distance.toFixed(1)} km de você).`;
    },
    (error) => {
      statusMsg.innerHTML = "Não foi possível obter sua localização no navegador. Clique em 'Iniciar Rota Aqui' em qualquer ponto abaixo para traçar a partir do Centro.";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

const PIX_KEY = "254d5227-0a94-4950-9da0-c1ac36dac043";
let selectedPlanAmount = "35.00";
let globalVipAd = null;

function normalizePixAmount(amount) {
  const parsed = Number(String(amount).replace(',', '.'));
  if (isNaN(parsed) || parsed <= 0) return "35.00";
  return parsed.toFixed(2);
}

function generatePixPayload(key, amount = "35.00", merchantName = "LIXO ELETRONICO LONDRINA", city = "LONDRINA") {
  const formattedAmount = normalizePixAmount(amount);
  const formatField = (id, value) => id + String(value.length).padStart(2, '0') + value;
  const merchantAccount = formatField("00", "br.gov.bcb.pix") + formatField("01", key);
  let payload =
    formatField("00", "01") +
    formatField("01", "11") +
    formatField("26", merchantAccount) +
    formatField("52", "0000") +
    formatField("53", "986") +
    formatField("54", formattedAmount) +
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

window.openAdModalWithPrice = function(amount, planTitle) {
  const adModal = document.getElementById('adPaymentModal');
  const exactAmount = normalizePixAmount(amount);
  selectedPlanAmount = exactAmount;
  const brlDisplay = exactAmount.replace('.', ',');
  
  document.getElementById('modalPlanBadge').innerText = `PLANO SELECIONADO • VALOR: R$ ${brlDisplay} • 30 DIAS (1 MÊS)`;
  document.getElementById('modalPlanTitle').innerText = planTitle;

  const amountDisplayEl = document.getElementById('pixExactAmountDisplay');
  if (amountDisplayEl) {
    amountDisplayEl.innerText = `Valor Automático no Pix: R$ ${brlDisplay}`;
  }

  const payload = generatePixPayload(PIX_KEY, exactAmount);
  document.getElementById('pixPayloadInput').value = payload;
  document.getElementById('pixQrImage').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`;

  adModal.style.display = 'flex';
};

window.tryOpenVipPlan = function() {
  const now = Date.now();
  if (globalVipAd && globalVipAd.expiresAt > now) {
    const diasRestantes = calculateRemainingDays(globalVipAd.expiresAt);
    alert(`O Plano VIP exclusivo (R$ 115,00) já está ocupado por ${globalVipAd.name} (restam ${diasRestantes} dias)! Aguarde expirar ou utilize os outros planos.`);
    return;
  }
  openAdModalWithPrice('115.00', 'Plano VIP Exclusivo - 30 Dias (R$ 115,00)');
};

function isValidEndToEndPixId(txId) {
  return /^E[0-9]{8}[0-9]{12}[a-zA-Z0-9]{11}$/.test(txId);
}

function makeVipBannerDraggable() {
  const banner = document.getElementById('floatingVipBanner');
  const handle = document.getElementById('vipDragHandle');
  if (!banner || !handle) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const startDrag = (clientX, clientY) => {
    isDragging = true;
    const rect = banner.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    banner.style.bottom = 'auto';
    banner.style.right = 'auto';
    banner.style.left = rect.left + 'px';
    banner.style.top = rect.top + 'px';
  };

  const onDrag = (clientX, clientY) => {
    if (!isDragging) return;
    let newLeft = clientX - offsetX;
    let newTop = clientY - offsetY;
    const maxLeft = window.innerWidth - banner.offsetWidth;
    const maxTop = window.innerHeight - banner.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
    banner.style.left = newLeft + 'px';
    banner.style.top = newTop + 'px';
  };

  const stopDrag = () => {
    isDragging = false;
  };

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', (e) => {
    onDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', stopDrag);

  handle.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      onDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  document.addEventListener('touchend', stopDrag);
}

document.addEventListener('DOMContentLoaded', () => {
  const cookieConsent = getCookieRecord('lixo_eletronico_lgpd');

  if (!cookieConsent) {
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
      max-width: 520px;
      width: 100%;
      padding: 32px;
      border-radius: 12px;
      text-align: left;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    `;

    box.innerHTML = `
      <div style="font-size: 2.2rem; color: #047857; margin-bottom: 12px; text-align: center;">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <h3 style="color: #0f172a; margin-bottom: 12px; font-size: 1.3rem; font-family: sans-serif; text-align: center;">Aviso de Privacidade e Termos de Uso</h3>
      <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px; font-family: sans-serif; line-height: 1.6;">
        Em conformidade com a LGPD, informamos que <strong>não armazenamos dados pessoais sigilosos em servidores externos ou bancos de dados centralizados</strong>. As informações fornecidas para divulgação comercial são processadas exclusivamente de forma local no navegador do usuário pelo período fixo de <strong>30 dias (1 mês)</strong>, sendo os registros automaticamente excluídos após o término da vigência.
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
        text-align: center;
      ">Estou ciente e Concordar</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const apagarCaixa = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      setCookieRecord('lixo_eletronico_lgpd', { aceito: true, data: new Date().toLocaleString('pt-BR') }, 365);
      overlay.remove();
    };

    const btnAceitar = document.getElementById('btnJsAceitar');
    btnAceitar.addEventListener('click', apagarCaixa);
    btnAceitar.addEventListener('touchend', apagarCaixa);
    btnAceitar.addEventListener('pointerdown', apagarCaixa);
  }

  initMap();
  makeVipBannerDraggable();

  document.getElementById('btnGeo').addEventListener('click', getUserLocation);
  document.getElementById('btnSearch').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  const adModal = document.getElementById('adPaymentModal');
  const btnCloseAd = document.getElementById('btnCloseAdModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const txIdInput = document.getElementById('pixTxIdInput');
  const receiptInput = document.getElementById('pixReceiptInput');
  const btnVerifyPix = document.getElementById('btnVerifyPix');
  const bizNameInput = document.getElementById('inputBizName');
  const bizCategoryInput = document.getElementById('inputBizCategory');
  const bizDescInput = document.getElementById('inputBizDesc');
  const bizLinkInput = document.getElementById('inputBizLink');
  const bizImageInput = document.getElementById('inputBizImage');

  const closeModalAction = () => {
    adModal.style.display = 'none';
    document.getElementById('pixDataForm').reset();
    txIdInput.value = '';
    receiptInput.value = '';
    btnVerifyPix.disabled = true;
  };

  if (btnCloseAd) btnCloseAd.addEventListener('click', closeModalAction);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModalAction);

  const btnCopyPayload = document.getElementById('btnCopyPayload');
  if (btnCopyPayload) {
    btnCopyPayload.addEventListener('click', () => {
      const payload = document.getElementById('pixPayloadInput').value;
      navigator.clipboard.writeText(payload);
      const brlDisplay = selectedPlanAmount.replace('.', ',');
      alert(`Código Pix Copia e Cola no valor exato de R$ ${brlDisplay} copiado!`);
    });
  }

  function checkPixAndFormInputs() {
    if (!receiptInput || !txIdInput || !btnVerifyPix || !bizNameInput || !bizCategoryInput || !bizDescInput || !bizLinkInput || !bizImageInput) return;
    const hasReceipt = receiptInput.files.length > 0;
    const hasBizImage = bizImageInput.files.length > 0;
    const hasValidTxId = isValidEndToEndPixId(txIdInput.value.trim());
    const hasBizName = bizNameInput.value.trim() !== "";
    const hasCategory = bizCategoryInput.value.trim() !== "";
    const hasDesc = bizDescInput.value.trim() !== "";
    const hasLink = bizLinkInput.value.trim() !== "";

    btnVerifyPix.disabled = !(hasReceipt && hasBizImage && hasValidTxId && hasBizName && hasCategory && hasDesc && hasLink);
  }

  if (receiptInput) receiptInput.addEventListener('change', checkPixAndFormInputs);
  if (bizImageInput) bizImageInput.addEventListener('change', checkPixAndFormInputs);
  if (txIdInput) txIdInput.addEventListener('input', checkPixAndFormInputs);
  if (bizNameInput) bizNameInput.addEventListener('input', checkPixAndFormInputs);
  if (bizCategoryInput) bizCategoryInput.addEventListener('input', checkPixAndFormInputs);
  if (bizDescInput) bizDescInput.addEventListener('input', checkPixAndFormInputs);
  if (bizLinkInput) bizLinkInput.addEventListener('input', checkPixAndFormInputs);

  const sponsorsGrid = document.getElementById('sponsorsGrid');
  const footerSponsorsGrid = document.getElementById('footerSponsorsGrid');
  const vipStatusDisplay = document.getElementById('vipStatusDisplay');
  const vipImageContainer = document.getElementById('vipImageContainer');
  const btnVipAction = document.getElementById('btnVipAction');

  function renderPortal() {
    const now = Date.now();
    let storedAds = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');

    const validAds = storedAds.filter(ad => ad.expiresAt && ad.expiresAt > now);
    if (validAds.length !== storedAds.length) {
      localStorage.setItem('lixo_eletronico_ads', JSON.stringify(validAds));
    }

    const vipItem = validAds.find(ad => Number(ad.planAmount) === 115.00);
    globalVipAd = vipItem || null;

    if (vipStatusDisplay && btnVipAction && vipImageContainer) {
      if (vipItem) {
        const diasRestantes = calculateRemainingDays(vipItem.expiresAt);
        const ownerDisplay = (!vipItem.hideUserName && vipItem.userName) ? ` • Anunciante: ${vipItem.userName}` : '';
        const paidDateStr = vipItem.paidDateFormatted ? ` • Pago em: ${vipItem.paidDateFormatted}` : '';
        vipImageContainer.innerHTML = vipItem.image ? `<img src="${vipItem.image}" alt="${vipItem.name}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; border:2px solid #a78bfa;">` : '';
        vipStatusDisplay.innerHTML = `<strong>${vipItem.name}</strong>${ownerDisplay}<br><span style="font-size:0.8rem; color:#cbd5e1;">${vipItem.desc}</span><br><small style="color:#a78bfa;">Restam ${diasRestantes} dias${paidDateStr}</small>`;
        btnVipAction.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Visitar ${vipItem.name}`;
        btnVipAction.style.background = '#10b981';
        btnVipAction.onclick = () => window.open(vipItem.link, '_blank', 'noopener,noreferrer');
      } else {
        vipImageContainer.innerHTML = '';
        vipStatusDisplay.innerHTML = `Vaga livre! O primeiro que pagar garante exclusividade com imagem por 30 dias.`;
        btnVipAction.innerHTML = '<i class="fa-solid fa-star"></i> Garantir Vaga VIP por R$ 115,00';
        btnVipAction.style.background = '#7c3aed';
        btnVipAction.onclick = () => window.tryOpenVipPlan();
      }
    }

    if (sponsorsGrid) {
      sponsorsGrid.innerHTML = '';
      const midAds = validAds.filter(ad => Number(ad.planAmount) === 35.00);

      midAds.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'sponsor-card';
        const diasRestantes = calculateRemainingDays(ad.expiresAt);
        const ownerDisplay = (!ad.hideUserName && ad.userName) ? `<br><small style="color:#64748b; font-weight:normal;">Anunciante: ${ad.userName}</small>` : '';
        const paidInfo = ad.paidDateFormatted ? `<br><small style="color:#059669; font-size:0.75rem;">Pago em ${ad.paidDateFormatted} • Restam ${diasRestantes} dias</small>` : '';

        card.innerHTML = `
          ${ad.image ? `<img src="${ad.image}" alt="${ad.name}">` : ''}
          <div class="sponsor-card-body">
            <span class="sponsor-cat">${ad.category} • Patrocinado (${diasRestantes} dias restantes)</span>
            <h4>${ad.name}${ownerDisplay}</h4>
            <p>${ad.desc}${paidInfo}</p>
            <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class="sponsor-link">
              Acessar / Contato <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        `;
        sponsorsGrid.appendChild(card);
      });
    }

    if (footerSponsorsGrid) {
      footerSponsorsGrid.innerHTML = '';
      const footerAds = validAds.filter(ad => Number(ad.planAmount) === 15.87);

      footerAds.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'sponsor-card';
        const diasRestantes = calculateRemainingDays(ad.expiresAt);
        const ownerDisplay = (!ad.hideUserName && ad.userName) ? `<br><small style="color:#64748b; font-weight:normal;">Anunciante: ${ad.userName}</small>` : '';
        const paidInfo = ad.paidDateFormatted ? `<br><small style="color:#059669; font-size:0.75rem;">Pago em ${ad.paidDateFormatted} • Restam ${diasRestantes} dias</small>` : '';

        card.innerHTML = `
          ${ad.image ? `<img src="${ad.image}" alt="${ad.name}">` : ''}
          <div class="sponsor-card-body">
            <span class="sponsor-cat" style="color:#0284c7;">${ad.category} • Plano Básico (${diasRestantes} dias restantes)</span>
            <h4>${ad.name}${ownerDisplay}</h4>
            <p>${ad.desc}${paidInfo}</p>
            <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class="sponsor-link" style="background:#0284c7;">
              Acessar / Contato <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        `;
        footerSponsorsGrid.appendChild(card);
      });
    }
  }

  renderPortal();

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

  if (btnVerifyPix) {
    btnVerifyPix.addEventListener('click', async () => {
      const txId = txIdInput.value.trim();

      if (!isValidEndToEndPixId(txId)) {
        alert('ID de transação Pix inválido. Informe o código EndToEndId oficial de 32 caracteres.');
        return;
      }

      if (bizImageInput.files.length === 0) {
        alert('Por favor, anexe a imagem da sua empresa antes de confirmar.');
        return;
      }

      const now = Date.now();
      let currentAds = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');
      currentAds = currentAds.filter(ad => ad.expiresAt > now);

      if (Number(selectedPlanAmount) === 115.00) {
        const existingVip = currentAds.find(a => Number(a.planAmount) === 115.00);
        if (existingVip) {
          alert('O espaço VIP acabou de ser ocupado por outro pagamento.');
          adModal.style.display = 'none';
          return;
        }
      }

      const txExists = currentAds.some(a => a.txId === txId);
      if (txExists) {
        alert('Este ID de transação Pix já foi utilizado recentemente.');
        return;
      }

      const userName = document.getElementById('inputUserName').value.trim();
      const hideUserName = document.getElementById('inputHideName').checked;
      const name = bizNameInput.value.trim();
      const category = bizCategoryInput.value.trim();
      const desc = bizDescInput.value.trim();
      const link = bizLinkInput.value.trim();
      const imgFile = bizImageInput.files[0];

      btnVerifyPix.disabled = true;
      btnVerifyPix.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando anúncio...';

      const totalDays = 30;
      const oneMonthMs = totalDays * 24 * 60 * 60 * 1000;
      const expiresAt = now + oneMonthMs;
      const paidDateFormatted = new Date(now).toLocaleDateString('pt-BR');
      const expiresDateFormatted = new Date(expiresAt).toLocaleDateString('pt-BR');

      const saveAd = (imgData) => {
        const adData = {
          userName,
          hideUserName,
          name,
          category,
          desc,
          link,
          image: imgData,
          txId,
          planAmount: selectedPlanAmount,
          daysActive: totalDays,
          createdAt: now,
          expiresAt: expiresAt,
          paidDateFormatted,
          expiresDateFormatted
        };

        if (Number(selectedPlanAmount) === 115.00) {
          currentAds = currentAds.filter(a => Number(a.planAmount) !== 115.00);
        }
        currentAds.unshift(adData);
        localStorage.setItem('lixo_eletronico_ads', JSON.stringify(currentAds));
        renderPortal();

        document.getElementById('pixDataForm').reset();
        txIdInput.value = '';
        receiptInput.value = '';
        btnVerifyPix.disabled = true;
        btnVerifyPix.innerHTML = '<i class="fa-solid fa-check"></i> Confirmar Pagamento e Publicar';
        adModal.style.display = 'none';
        alert(`Parabéns! Anúncio de "${name}" publicado com sucesso por ${totalDays} dias (expira em ${expiresDateFormatted})!`);
      };

      compressImage(imgFile, saveAd);
    });
  }
});