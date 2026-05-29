/* ================================================
   SOLARPROPHET — map.js
   Uses Leaflet.js — works offline after first load
================================================ */


/* ------------------------------------------------
   STEP 1: CREATE THE MAP
   Centered on Ghana at zoom level 7
------------------------------------------------ */
const map = L.map('map', {
  center: [7.9, -1.0],
  zoom: 7,
  zoomControl: true
});


/* ------------------------------------------------
   STEP 2: ADD MAP TILES

   We use CartoDB Positron tiles.
   These are clean minimal tiles that match
   our warm cream color theme perfectly.

   OFFLINE SUPPORT:
   Every tile you view online gets saved
   automatically by the service worker (sw.js).
   Next time you open the page offline those
   tiles load from your computer instead.
------------------------------------------------ */
const tileLayer = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  {
    attribution: '© OpenStreetMap © CartoDB',
    /* 
      maxZoom 19 means you can zoom in very close.
      The higher this is the more tiles get cached.
    */
    maxZoom: 19
  }
).addTo(map);


/* ------------------------------------------------
   STEP 3: ADD HEAT OVERLAY CIRCLES

   Three overlapping orange circles simulate
   solar intensity over Ghana.
   These work completely offline since they
   are drawn by Leaflet not loaded from internet.
------------------------------------------------ */

/* Large faint glow over central Ghana */
L.circle([7.5, -1.8], {
  color: 'transparent',
  fillColor: '#D96B2A',
  fillOpacity: 0.12,
  radius: 220000
}).addTo(map);

/* Medium brighter glow over Ashanti region */
L.circle([6.9, -1.5], {
  color: 'transparent',
  fillColor: '#C45E20',
  fillOpacity: 0.20,
  radius: 130000
}).addTo(map);

/* Small intense spot at Ejisu */
L.circle([6.74, -1.36], {
  color: 'transparent',
  fillColor: '#A84010',
  fillOpacity: 0.28,
  radius: 50000
}).addTo(map);


/* ------------------------------------------------
   STEP 4: ADD EJISU MARKER

   Orange dot with white ring at Ejisu.
   Works offline — drawn by Leaflet.
------------------------------------------------ */
L.circleMarker([6.7421, -1.3636], {
  radius: 8,
  fillColor: '#C45E20',
  color: 'white',
  weight: 2,
  fillOpacity: 1
}).addTo(map).bindTooltip('Ejisu, Ashanti', {
  permanent: false,
  direction: 'top'
});


/* ------------------------------------------------
   STEP 5: CLICK ON MAP TO SELECT A LOCATION

   When you click anywhere on the map a new
   orange dot appears and the right panel
   updates with the coordinates.
   Works completely offline.
------------------------------------------------ */
let currentMarker = null;

map.on('click', function(event) {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;

  /* Remove previous marker */
  if (currentMarker) map.removeLayer(currentMarker);

  /* Add new marker */
  currentMarker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: '#C45E20',
    color: 'white',
    weight: 2,
    fillOpacity: 1
  }).addTo(map);

  /* Format coordinates */
  const latText = Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S');
  const lngText = Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');

  /* Update right panel */
  document.getElementById('locationCoords').textContent = latText + ' · ' + lngText;
  document.getElementById('locationName').textContent = 'Selected Location';
});


/* ------------------------------------------------
   STEP 6: SEARCH BOX

   Uses Nominatim (free OpenStreetMap search).
   Requires internet to search — but clicking
   on the map still works offline.
------------------------------------------------ */
const searchInput = document.getElementById('searchInput');
const pinButton   = document.getElementById('pinButton');

searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') searchPlace(this.value);
});

pinButton.addEventListener('click', function() {
  const val = searchInput.value.trim();
  if (val) searchPlace(val);
});

function searchPlace(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&q='
    + encodeURIComponent(query + ', Ghana');

  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(results) {
      if (results.length > 0) {
        const lat  = parseFloat(results[0].lat);
        const lng  = parseFloat(results[0].lon);
        const name = results[0].display_name.split(',')[0];

        map.setView([lat, lng], 11);

        if (currentMarker) map.removeLayer(currentMarker);

        currentMarker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#C45E20',
          color: 'white',
          weight: 2,
          fillOpacity: 1
        }).addTo(map);

        document.getElementById('locationName').textContent = name;
        document.getElementById('locationCoords').textContent =
          Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S') + ' · ' +
          Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');

      } else {
        alert('Location not found. Try another name.');
      }
    })
    .catch(function() {
      alert('Search requires internet connection. You can still click on the map to select a location.');
    });
}


/* ------------------------------------------------
   STEP 7: TAB BUTTONS
------------------------------------------------ */
function setTab(clickedTab) {
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.classList.remove('active');
  });
  clickedTab.classList.add('active');
}
