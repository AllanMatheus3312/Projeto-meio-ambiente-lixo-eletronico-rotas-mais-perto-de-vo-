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
    markersGroup.addLayer(marker);
  });

  if (places.length > 0) {
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
      map.flyTo([place.lat, place.lng], 15);
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

  statusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Obtendo sua localização...';

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
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Localização encontrada! O ponto mais próximo é <strong>${closest.name}</strong> (${closest.distance.toFixed(1)} km de você).`;
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
  statusMsg.innerHTML = `Encontrado(s) <strong>${filtered.length}</strong> ponto(s) para "<em>${query}</em>".`;
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();

  document.getElementById('btnGeo').addEventListener('click', getUserLocation);
  document.getElementById('btnSearch').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
});