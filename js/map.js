export function crearMapa() {
    // variable global para el control de la ruta 
    window.ruta = [];

    const map = L.map('map', {
        zoom: 15,
        minZoom: 13,
        maxZoom: 19
    }).setView([2.4448, -76.6070], 13);  //coordenadas zoom central

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    const popayanBounds = L.latLngBounds([  //limites de popayan para el mapa
        [2.38, -76.72],
        [2.56, -76.50]
    ]);
    map.setMaxBounds(popayanBounds);

    const busIcon = L.icon({ //funcion crear icono para el bus
        iconUrl: 'img/auto1.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -40]
    });

    const busIcon2 = L.icon({
        iconUrl: 'img/auto2.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    const marker = L.marker([2.4448, -76.6147], { icon: busIcon }).addTo(map);
    const marker2 = L.marker([2.4448, -76.6147], { icon: busIcon2 }).addTo(map);

    return { map, busIcon, busIcon2, marker, marker2 };
}

function crearIcono(lugar) {   // funcion para crear iconos para lugares
    return L.icon({
        iconUrl: lugar.iconUrl,
        iconSize: lugar.iconSize || [40, 40],
        iconAnchor: lugar.iconAnchor || [20, 40],
        popupAnchor: lugar.popupAnchor || [0, -40]
    });
}

function crearIconoHover(icon) { //fncion icono movimiento
    const size = icon.options.iconSize || [40, 40];
    const scale = 1.15;
    const hoverSize = [Math.round(size[0] * scale), Math.round(size[1] * scale)];
    const anchor = icon.options.iconAnchor
        ? [Math.round(icon.options.iconAnchor[0] * scale), Math.round(icon.options.iconAnchor[1] * scale)]
        : [Math.round(hoverSize[0] / 2), hoverSize[1]];

    return L.icon({
        iconUrl: icon.options.iconUrl,
        iconSize: hoverSize,
        iconAnchor: anchor,
        popupAnchor: icon.options.popupAnchor || [0, -hoverSize[1]]
    });
}

export function crearMarcadoresLugares(map, lugares) {
    return lugares.map((lugar) => {
        const lugarIcon = crearIcono(lugar);
        const hoverIcon = crearIconoHover(lugarIcon);
        const marker = L.marker(lugar.coords, { icon: lugarIcon }).addTo(map);

        if (lugar.popup) {
            marker.bindPopup(lugar.popup, {
                closeButton: false,
                closeOnClick: false,
                autoClose: false,
                autoPan: false
            });

            marker.on('mouseover', function () {
                this.setIcon(hoverIcon);
                this.openPopup();
            });

            marker.on('mouseout', function () {
                this.closePopup();
                this.setIcon(lugarIcon);
            });

            marker.on('click', function (event) {
                if (event.originalEvent) {
                    event.originalEvent.preventDefault();
                    event.originalEvent.stopPropagation();
                }
            });
        }

        return marker;
    });
}

