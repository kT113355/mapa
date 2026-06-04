export function weatherCodeToLabel(code) {
  switch (code) {
    case 0: return 'Despejado';
    case 1: case 2: case 3: return 'Parcialmente nublado';
    case 45: case 48: return 'Niebla';
    case 51: case 53: case 55: return 'Llovizna ligera';
    case 56: case 57: return 'Llovizna helada';
    case 61: case 63: case 65: return 'Lluvia';
    case 66: case 67: return 'Lluvia helada';
    case 71: case 73: case 75: return 'Nieve';
    case 77: return 'Granizo';
    case 80: case 81: case 82: return 'Chubascos';
    case 85: case 86: return 'Nevadas ligeras';
    case 95: return 'Tormenta eléctrica';
    case 96: case 99: return 'Tormenta con granizo';
    default: return 'Condición desconocida';
  }
}

//funcion para conectar API de clima y sincronizar
export async function cargarClimaPopayan() {
  const lat = 2.4448;
  const lon = -76.6070;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Bogota`;

  const weatherTemp = document.getElementById('weather-temp');
  const weatherCondition = document.getElementById('weather-condition');
  const weatherWind = document.getElementById('weather-wind');

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Error al obtener clima');

    const datos = await respuesta.json();
    const clima = datos.current_weather;
    if (!clima) throw new Error('No hay datos de clima');

    weatherTemp.textContent = `${Math.round(clima.temperature)}°C`;
    weatherCondition.textContent = weatherCodeToLabel(clima.weathercode);
    weatherWind.textContent = `Viento ${Math.round(clima.windspeed)} km/h`;
  } catch (error) {
    weatherCondition.textContent = 'No disponible';
    weatherWind.textContent = 'Intenta recargar';
  }
}
