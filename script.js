const eWastePlaces = [
  {
    id: 1,
    name: "CRC E-LETRO (ONG E-Letro)",
    address: "Rua Ermelindo Leão, 385 - Vila Casoni, Londrina - PR, 86025-150",
    hours: "Seg a Sex 08h-12h e 13h30-18h",
    lat: -23.3036,
    lng: -51.1524
  },
  {
    id: 2,
    name: "Green Ocean Lixo Eletrônico / GD7 Metais",
    address: "Av. Alexandre Santoro, 590 - Jardim dos Estados, Londrina - PR, 86083-295",
    hours: "Seg a Sex 08h-18h",
    lat: -23.3150,
    lng: -51.1210
  },
  {
    id: 3,
    name: "E-Coleta Reciclagem Londrina",
    address: "Rua Benício Camilo, 103 - Jardim Santa Rita, Londrina - PR, 86072-470",
    hours: "Seg a Sex 09h-18h | Sáb 09h-12h",
    lat: -23.3122,
    lng: -51.2215
  },
  {
    id: 4,
    name: "Tec Lixo Eletrônico",
    address: "R. Hikoma Udihara, 230 - Jardim Kobayashi, Londrina - PR, 86040-340",
    hours: "Seg a Sex 08h-18h",
    lat: -23.3015,
    lng: -51.1090
  },
  {
    id: 5,
    name: "Ecoponto Boulevard Shopping Londrina",
    address: "Av. Theodoro Victorelli, 150 (Estacionamento G1) - Carlota, Londrina - PR, 86027-750",
    hours: "Seg a Sáb 10h-22h | Dom 14h-20h",
    lat: -23.3205,
    lng: -51.1335
  },
  {
    id: 6,
    name: "Pontos de Coleta Catuaí Shopping Londrina",
    address: "Rod. Celso Garcia Cid, 5600 (Próximo ao SAC e fraldário) - Gleba Fazenda Palhano, Londrina - PR, 86050-901",
    hours: "Seg a Sáb 10h-22h | Dom 14h-20h",
    lat: -23.3512,
    lng: -51.1770
  },
  {
    id: 7,
    name: "Casas Bahia (Ponto Green Eletron)",
    address: "Av. Paraná, 203 - Centro, Londrina - PR, 86010-390",
    hours: "Seg a Sáb 09h-19h",
    lat: -23.3108,
    lng: -51.1625
  },
  {
    id: 8,
    name: "Casas Bahia (Ponto Green Eletron)",
    address: "R. Benjamin Constant, 1138 - Centro, Londrina - PR, 86010-350",
    hours: "Seg a Sáb 09h-19h",
    lat: -23.3130,
    lng: -51.1602
  },
  {
    id: 9,
    name: "Supermercados Angeloni (Ponto Green Eletron)",
    address: "R. João Huss, 74 - Gleba Fazenda Palhano, Londrina - PR, 86050-490",
    hours: "Seg a Dom 08h-21h",
    lat: -23.3245,
    lng: -51.1685
  },
  {
    id: 10,
    name: "Santuário Nossa Senhora Aparecida (Parceria Green Ocean)",
    address: "Praça Nossa Sra. Aparecida, s/n - Vila Nova, Londrina - PR, 86025-440",
    hours: "Seg a Sex 08h-18h",
    lat: -23.3080,
    lng: -51.1450
  },
  {
    id: 11,
    name: "Centro Cultural Kaingang (Parceria Green Ocean)",
    address: "Av. Dez de Dezembro, 1345 - Vila Recreio, Londrina - PR, 86026-220",
    hours: "Seg a Sex 08h-18h",
    lat: -23.3180,
    lng: -51.1510
  },
  {
    id: 12,
    name: "Leroy Merlin Londrina",
    address: "Av. Theodoro Victorelli, 650L - Jardim Helena, Londrina - PR, 86027-750",
    hours: "Seg a Sáb 08h-22h | Dom 09h-20h",
    lat: -23.3198,
    lng: -51.1320
  },
  {
    id: 13,
    name: "Condor Hipermercado",
    address: "R. Rio Grande do Sul, 50 - Matarazzo, Londrina - PR, 86026-080",
    hours: "Seg a Sáb 08h-21h | Dom 08h-20h",
    lat: -23.3110,
    lng: -51.1540
  },
  {
    id: 14,
    name: "Iate Clube de Londrina",
    address: "Av. Higienópolis, 2135 - Higienópolis, Londrina - PR, 86015-010",
    hours: "Seg a Sex 08h-18h",
    lat: -23.3050,
    lng: -51.1630
  },
  {
    id: 15,
    name: "Prefeitura Municipal de Londrina",
    address: "Av. Duque de Caxias, 635 - Centro Cívico, Londrina - PR, 86015-901",
    hours: "Seg a Sex 08h-17h",
    lat: -23.3220,
    lng: -51.1550
  },
  {
    id: 16,
    name: "Microcamp Londrina",
    address: "R. Quintino Bocaiúva, 379 - Centro, Londrina - PR, 86020-150",
    hours: "Seg a Sex 08h-20h | Sáb 08h-15h",
    lat: -23.3120,
    lng: -51.1570
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

function getGoogleMapsRouteUrl(place) {
  const destinationQuery = encodeURIComponent(place.name + ", " + place.address);
  if (userLocation) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destinationQuery}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}&travelmode=driving`;
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
    router: new L.Routing.OSRMv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      profile: 'driving'
    }),
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
  statusMsg.innerHTML = `<i class="fa-solid fa-route" style="color:#0284c7;"></i> Rota traçada de <strong>${originLabel}</strong> até <strong>${placeName}</strong>.`;
}

function initMap() {
  map = L.map('map', { attributionControl: false }).setView([-23.3103, -51.1592], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  markersGroup = L.featureGroup().addTo(map);

  // EXECUÇÃO IMEDIATA DA GEOLOCALIZAÇÃO AO ABRIR O MAPA
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userLocation = { lat, lng };

        if (!userMarker) {
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

        const statusMsg = document.getElementById('statusMessage');
        if (statusMsg) {
          statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Ponto mais próximo encontrado para você: <strong>${closest.name}</strong> (${closest.distance.toFixed(1)} km).`;
        }
      },
      () => {
        plotMarkers(eWastePlaces);
        renderPlacesList(eWastePlaces);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    plotMarkers(eWastePlaces);
    renderPlacesList(eWastePlaces);
  }
}

function plotMarkers(places) {
  markersGroup.clearLayers();

  places.forEach((place, index) => {
    const isNearest = (index === 0 && place.distance !== undefined);
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
    const googleMapsRouteUrl = getGoogleMapsRouteUrl(place);

    const distText = place.distance !== undefined ? `<br><b>Distância:</b> ${place.distance.toFixed(2)} km` : '';
    const nearestLabel = isNearest ? '<br><span style="color:#059669; font-weight:bold;">★ PONTO MAIS PRÓXIMO</span>' : '<br><span style="color:#dc2626; font-weight:bold;">Ponto de Coleta</span>';
    
    marker.bindPopup(`
      <b>${place.name}</b>${nearestLabel}<br>
      ${place.address}${distText}<br>
      <div style="margin-top: 8px;">
        <a href="${googleMapsRouteUrl}" target="_blank" rel="noopener noreferrer" style="background:#0284c7; color:#fff; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:11px; font-weight:bold; display:inline-block;">
          <i class="fa-solid fa-map-location-dot"></i> Abrir no Google Maps
        </a>
      </div>
    `);

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
    
    const badgeNearest = (index === 0 && place.distance !== undefined) ? '<span class="badge-nearest"><i class="fa-solid fa-star"></i> Mais Próximo</span>' : '';
    const distText = place.distance !== undefined ? `<span class="dist-tag"><i class="fa-solid fa-route"></i> ${place.distance.toFixed(1)} km</span>` : '';
    const googleMapsUrl = getGoogleMapsRouteUrl(place);

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

  statusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Obtendo sua localização e ordenando por proximidade...';

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
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Ponto mais próximo calculado com sucesso: <strong>${closest.name}</strong> (${closest.distance.toFixed(1)} km).`;
    },
    (error) => {
      statusMsg.innerHTML = "Não foi possível obter sua localização no navegador. Exibindo lista padrão.";
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

const PIX_KEY = "5fdeb776-815b-451b-95b5-8bda4ac82dfa";
let selectedPlanAmount = "35.00";
let globalVipAd = null;
let savedDraft = JSON.parse(localStorage.getItem('lixo_eletronico_draft') || '{}');

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

  localStorage.setItem('lixo_eletronico_active_plan', JSON.stringify({
    amount: exactAmount,
    title: planTitle,
    payload: payload,
    timestamp: Date.now()
  }));

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
      <h3 style="color: #0f172a; margin-bottom: 12px; font-size: 1.3rem; font-family: sans-serif; text-align: center;">Aviso de Privacidade, Termos e Segurança</h3>
      <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px; font-family: sans-serif; line-height: 1.6;">
        Em conformidade com a LGPD, informamos que <strong>não coletamos nem armazenamos dados pessoais sensíveis</strong>. Para sua segurança e do site (garantia de vigência e comprovação de anúncios pagos), armazenamos apenas os dados comerciais estritamente necessários: <strong>nome da empresa, nome do anunciante, comprovante e ID da transação Pix, além da data de início e término do plano contratado</strong>. Esses registros são mantidos de forma segura para resguardar ambas as partes.
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

  if (savedDraft.userName) document.getElementById('inputUserName').value = savedDraft.userName;
  if (savedDraft.hideName !== undefined) document.getElementById('inputHideName').checked = savedDraft.hideName;
  if (savedDraft.bizName) bizNameInput.value = savedDraft.bizName;
  if (savedDraft.bizCategory) bizCategoryInput.value = savedDraft.bizCategory;
  if (savedDraft.bizDesc) bizDescInput.value = savedDraft.bizDesc;
  if (savedDraft.bizLink) bizLinkInput.value = savedDraft.bizLink;
  if (savedDraft.txId) txIdInput.value = savedDraft.txId;

  const activePlan = JSON.parse(localStorage.getItem('lixo_eletronico_active_plan') || 'null');
  if (activePlan && (Date.now() - activePlan.timestamp < 3600000)) {
    window.openAdModalWithPrice(activePlan.amount, activePlan.title);
  }

  const saveDraftFields = () => {
    const draftData = {
      userName: document.getElementById('inputUserName').value,
      hideName: document.getElementById('inputHideName').checked,
      bizName: bizNameInput.value,
      bizCategory: bizCategoryInput.value,
      bizDesc: bizDescInput.value,
      bizLink: bizLinkInput.value,
      txId: txIdInput.value
    };
    localStorage.setItem('lixo_eletronico_draft', JSON.stringify(draftData));
  };

  const closeModalAction = () => {
    adModal.style.display = 'none';
    document.getElementById('pixDataForm').reset();
    txIdInput.value = '';
    receiptInput.value = '';
    btnVerifyPix.disabled = true;
    localStorage.removeItem('lixo_eletronico_active_plan');
    localStorage.removeItem('lixo_eletronico_draft');
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

  // VALIDAÇÃO COM IF / ELSE IF PARA GARANTIR QUE SÓ SALVA E CONTA SE TIVER FEITO O PIX E PREENCHIDO TUDO
  if (btnVerifyPix) {
    btnVerifyPix.addEventListener('click', (e) => {
      e.preventDefault();

      const txId = txIdInput ? txIdInput.value.trim() : "";
      const hasReceipt = receiptInput && receiptInput.files.length > 0;
      const hasBizImage = bizImageInput && bizImageInput.files.length > 0;
      const bizName = bizNameInput ? bizNameInput.value.trim() : "";
      const bizCategory = bizCategoryInput ? bizCategoryInput.value.trim() : "";
      const bizDesc = bizDescInput ? bizDescInput.value.trim() : "";
      const bizLink = bizLinkInput ? bizLinkInput.value.trim() : "";
      const userName = document.getElementById('inputUserName') ? document.getElementById('inputUserName').value.trim() : 'Anônimo';
      const hideName = document.getElementById('inputHideName') ? document.getElementById('inputHideName').checked : false;

      // 1. Verifica se o campo do Pix está vazio
      if (txId === "") {
        alert("O campo ID do Pix (End-to-End) está vazio. Insira o código da transação para comprovar o pagamento.");
        if (txIdInput) txIdInput.focus();
        return;
      } 
      
      // 2. Se não estiver vazio, confere se o formato do Pix é válido
      else if (!isValidEndToEndPixId(txId)) {
        alert("O código Pix informado parece inválido. Verifique o ID no comprovante do seu banco.");
        if (txIdInput) txIdInput.focus();
        return;
      } 
      
      // 3. Se o Pix está ok, verifica se o comprovante foi anexado
      else if (!hasReceipt) {
        alert("Você precisa anexar o comprovante em imagem ou PDF do Pix realizado.");
        return;
      } 
      
      // 4. Se o pagamento foi conferido, verifica se o formulário do anúncio está totalmente preenchido
      else if (bizName === "" || bizCategory === "" || bizDesc === "" || bizLink === "" || !hasBizImage) {
        alert("O formulário do anúncio está incompleto! Preencha todos os campos e envie a foto/logo da empresa para conseguir postar.");
        return;
      } 
      
      // 5. Se passou por todas as travas, registra os dados, a data e hora exata do Pix e salva no sistema!
      else {
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' às ' + dataAtual.toLocaleTimeString('pt-BR');

        const novoAnuncio = {
          id: 'ad_' + Date.now(),
          userName: userName,
          hideName: hideName,
          name: bizName,
          category: bizCategory,
          desc: bizDesc,
          link: bizLink,
          txId: txId,
          planAmount: typeof selectedPlanAmount !== 'undefined' ? selectedPlanAmount : "35.00",
          paidDateFormatted: dataFormatada,
          timestamp: dataAtual.getTime(),
          expiresAt: dataAtual.getTime() + (30 * 24 * 60 * 60 * 1000) // 30 dias
        };

        let storedAds = JSON.parse(localStorage.getItem('lixo_eletronico_ads') || '[]');
        storedAds.push(novoAnuncio);
        localStorage.setItem('lixo_eletronico_ads', JSON.stringify(storedAds));

        localStorage.removeItem('lixo_eletronico_active_plan');
        localStorage.removeItem('lixo_eletronico_draft');

        alert(`Sucesso! Pix validado e registrado em ${dataFormatada}. Anúncio publicado com sucesso!`);
        adModal.style.display = 'none';

        if (typeof renderPortal === 'function') {
          renderPortal();
        }
      }
    });
  }

  if (receiptInput) receiptInput.addEventListener('change', saveDraftFields);
  if (bizImageInput) bizImageInput.addEventListener('change', saveDraftFields);
  if (txIdInput) {
    txIdInput.addEventListener('input', () => {
      saveDraftFields();
    });
  }
  if (bizNameInput) {
    bizNameInput.addEventListener('input', () => {
      saveDraftFields();
    });
  }
  if (bizCategoryInput) {
    bizCategoryInput.addEventListener('input', () => {
      saveDraftFields();
    });
  }
  if (bizDescInput) {
    bizDescInput.addEventListener('input', () => {
      saveDraftFields();
    });
  }
  if (bizLinkInput) {
    bizLinkInput.addEventListener('input', () => {
      saveDraftFields();
    });
  }
  document.getElementById('inputUserName').addEventListener('input', saveDraftFields);
  document.getElementById('inputHideName').addEventListener('change', saveDraftFields);

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
        vipImageContainer.innerHTML = vipItem.image ? `<img src="${vipItem.image}" alt="${vipItem.name}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; border:2px solid #20c997;">` : '';
        vipStatusDisplay.innerHTML = `<strong>${vipItem.name}</strong>${ownerDisplay}<br><span style="font-size:0.8rem; color:#e2e8f0;">${vipItem.desc}</span><br><small style="color:#20c997;">Restam ${diasRestantes} dias${paidDateStr}</small>`;
        btnVipAction.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Visitar ${vipItem.name}`;
        btnVipAction.style.background = '#20c997';
        btnVipAction.style.color = '#0f172a';
        btnVipAction.onclick = () => window.open(vipItem.link, '_blank', 'noopener,noreferrer');
      } else {
        vipImageContainer.innerHTML = '';
        vipStatusDisplay.innerHTML = `Vaga VIP exclusiva disponível! Garanta seu destaque por 30 dias.`;
        btnVipAction.innerHTML = '<i class="fa-solid fa-star"></i> Garantir Vaga VIP por R$ 115,00';
        btnVipAction.style.background = '#20c997';
        btnVipAction.style.color = '#0f172a';
        btnVipAction.onclick = () => window.tryOpenVipPlan();
      }
    }

    if (sponsorsGrid) {
      sponsorsGrid.innerHTML = '';
      const midAds = validAds.filter(ad => Number(ad.planAmount) !== 115.00);
      midAds.forEach(ad => {
        const div = document.createElement('div');
        div.className = 'sponsor-card';
        div.innerHTML = `<h4>${ad.name}</h4><p>${ad.desc}</p>`;
        sponsorsGrid.appendChild(div);
      });
    }
  }

  renderPortal();
});