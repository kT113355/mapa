console.log("VERSION 2.0 FLOW CITY AKRD");
// Importar firebase y funciones a usar
import { crearTrackingBus } from "./js/tracker.js";
import { crearMapa, crearMarcadoresLugares } from "./js/map.js";
import { lugares, paradas } from "./js/data.js";
import { cargarClimaPopayan } from "./js/weather.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"; //enviarvectorruta

//Configuración de Firebase

const firebaseConfig = {
  apiKey: "AIzaSyC7i13NFAQjYmE5wuBXW4ZQ1o1ptZBulws",
  authDomain: "flowcity1-44199.firebaseapp.com",
  databaseURL: "https://flowcity1-44199-default-rtdb.firebaseio.com",
  projectId: "flowcity1-44199"
};

//Iniciar comunicación con Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Crear mapa y marcadores
const { map, marker, marker2 } = crearMapa();
const marcadoresLugares = crearMarcadoresLugares(map, lugares);
const marcadoresParadas = crearMarcadoresLugares(map, paradas);

// Ajusta el tamaño de los iconos de las paradas según el nivel de zoom
function updateParadaIconSizes() {
  const zoom = map.getZoom();
  const minZ = (map.options && map.options.minZoom) ? map.options.minZoom : 13;
  const maxZ = (map.options && map.options.maxZoom) ? map.options.maxZoom : 19;
  const t = Math.max(0, Math.min(1, (zoom - minZ) / (maxZ - minZ)));
  const minSize = 24; // tamaño en px cuando está alejado
  const maxSize = 38; // tamaño en px cuando está cercano
  const size = Math.round(minSize + t * (maxSize - minSize));

  marcadoresParadas.forEach((m, i) => {
    const info = paradas[i] || {};
    const iconUrl = info.iconUrl || 'img/auto1.png';
    const icon = L.icon({
      iconUrl: iconUrl,
      iconSize: [size, size],
      iconAnchor: [Math.round(size / 2), size],
      popupAnchor: [0, -size]
    });
    m.setIcon(icon);
  });
}

map.on('zoomend', updateParadaIconSizes);

// limitar tamaño máximo de iconos de lugares solo en zoom máximo
function updateLugarMaxSize() {
  const zoom = map.getZoom();
  const maxZ = (map.options && map.options.maxZoom) ? map.options.maxZoom : 19;
  const maxAllowed = 38; // tamaño máximo permitido en px en zoom máximo

  marcadoresLugares.forEach((m, i) => {
    const info = lugares[i] || {};
    const orig = (info.iconSize && info.iconSize[0]) || 40;
    const size = zoom >= maxZ ? Math.min(orig, maxAllowed) : orig;
    const icon = L.icon({
      iconUrl: info.iconUrl || 'img/lugar1.png',
      iconSize: [size, size],
      iconAnchor: [Math.round(size / 2), size],
      popupAnchor: [0, -size]
    });
    m.setIcon(icon);
  });
}

// inicializar tamaños según zoom actual
map.on('zoomend', () => { updateParadaIconSizes(); updateLugarMaxSize(); });
updateParadaIconSizes();
updateLugarMaxSize();

// Sidebar boton colapsar/expandir
const sidebar = document.getElementById('sidebar');
const toggle = document.getElementById('sidebar-toggle');

function setSidebarCollapsed(collapsed) {
  if (collapsed) {
    sidebar.classList.add('collapsed');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '▶';
  } else {
    sidebar.classList.remove('collapsed');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = '◀';
  }
  try { localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0'); } catch (e) {}
  // Update Leaflet map size after transition
  if (typeof map !== 'undefined' && map && typeof map.invalidateSize === 'function') {
    setTimeout(() => map.invalidateSize(), 300);
  }
}

toggle.addEventListener('click', () => {
  const collapsed = sidebar.classList.toggle('collapsed');
  setSidebarCollapsed(collapsed);
});

// recuperar estado del sidebar al cargar
const saved = localStorage.getItem('sidebarCollapsed');
if (saved === '1') setSidebarCollapsed(true);

cargarClimaPopayan();
setInterval(cargarClimaPopayan, 3 * 60 * 1000); // actualizar clima cada 3 minutos

// Agregar funcionalidad al clima para mostrar imagen al hacer clic
const weatherCard = document.getElementById('weather-card');
const weatherHeader = weatherCard.querySelector('.weather-card__header');
let isImageShowing = false;

weatherCard.style.cursor = 'pointer';

weatherCard.addEventListener('click', () => {
  const weatherBody = weatherCard.querySelector('.weather-card__body');
  
  if (!isImageShowing) {
    // Ocultar header y reemplazar contenido con imagen
    weatherHeader.style.display = 'none';
    weatherBody.innerHTML = '<img src="img/logcomp.png" alt="Logo" style="width: 140px; height: 140px; object-fit: contain; margin: 0 auto; display: block; border-radius: 8px;">';
    isImageShowing = true;
  } else {
    // Mostrar header y restaurar contenido original del clima
    weatherHeader.style.display = 'block';
    weatherBody.innerHTML = `
      <div class="weather-card__temp" id="weather-temp">--°C</div>
      <div class="weather-card__condition" id="weather-condition">Cargando...</div>
      <div class="weather-card__info">
        <span id="weather-wind">Viento -- km/h</span>
      </div>
    `;
    isImageShowing = false;
    cargarClimaPopayan(); // Recargar datos del clima
  }
});

//funciones para crear las rutas
crearTrackingBus({
    map,
    busRef: ref(db, "bus1"),
    rutaRef: ref(db, "rutaBus1"),
    marker: marker,
    color: "#fe24bc"
});

crearTrackingBus({
    map,
    busRef: ref(db, "bus2"),
    rutaRef: ref(db, "rutaBus2"),
    marker: marker2,
    color: "#121a89"
});

