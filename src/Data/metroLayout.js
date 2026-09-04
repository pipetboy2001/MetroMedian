/** Catppuccin Mocha accents — un color por línea, sin repetir ninguno. */
export const LINE_META = {
  "Linea 1": { id: "L1", label: "Línea 1", color: "#f38ba8" }, // red
  "Linea 2": { id: "L2", label: "Línea 2", color: "#f9e2af" }, // yellow
  "Linea 3": { id: "L3", label: "Línea 3", color: "#fab387" }, // peach
  "Linea 4": { id: "L4", label: "Línea 4", color: "#89b4fa" }, // blue
  "Linea 4a": { id: "L4A", label: "Línea 4A", color: "#89dceb" }, // sky
  "Linea 5": { id: "L5", label: "Línea 5", color: "#a6e3a1" }, // green
  "Linea 6": { id: "L6", label: "Línea 6", color: "#cba6f7" }, // mauve
};

/**
 * Coordenadas reales de cada estación, tomadas de OpenStreetMap (nodos
 * `railway=station` + `station=subway` de la red de Metro de Santiago) y
 * proyectadas a un plano local (equirectangular, centrado en la red, con
 * la longitud corregida por cos(latitud)). 1 unidad ≈ la distancia
 * mediana entre estaciones consecutivas (~0.9 km), para que el mapa
 * conserve la forma y las proporciones reales de la red.
 *
 * Generado una sola vez desde datos reales, no a mano: ver el PR que
 * introdujo este archivo para el detalle de la consulta a Overpass API.
 */
const STATION_COORDS = {
  "San Pablo": [-8.141, -2.216],
  "Neptuno": [-8.083, -1.325],
  "Pajaritos": [-7.352, -0.611],
  "Las Rejas": [-6.474, -0.603],
  "Ecuador": [-5.764, -0.799],
  "San Alberto Hurtado": [-5.01, -1.007],
  "Universidad de Santiago": [-4.433, -1.17],
  "Estación Central": [-3.665, -1.416],
  "ULA": [-3.098, -1.593],
  "República": [-2.47, -1.794],
  "Los Héroes": [-1.794, -1.978],
  "La Moneda": [-1.231, -2.137],
  "Universidad de Chile": [-0.806, -2.259],
  "Santa Lucía": [-0.208, -2.429],
  "Universidad Católica": [0.283, -2.756],
  "Baquedano": [0.938, -3.064],
  "Salvador": [1.678, -3.609],
  "Manuel Montt": [2.329, -4.114],
  "Pedro de Valdivia": [2.92, -4.486],
  "Los Leones": [3.449, -4.905],
  "Tobalaba": [4.164, -5.366],
  "El Golf": [4.748, -5.56],
  "Alcántara": [5.325, -5.702],
  "Escuela Militar": [6.064, -5.94],
  "Manquehue": [7.373, -6.426],
  "Los Dominicos": [9.873, -6.617],
  "Vespucio Norte": [-0.369, -9.904],
  "Zapadores": [0.025, -8.67],
  "Dorsal": [-0.005, -7.941],
  "Einstein": [-0.049, -6.852],
  "Cementerios": [-0.092, -5.879],
  "Cerro Blanco": [-0.239, -4.817],
  "Patronato": [-0.447, -3.971],
  "Puente Cal y Canto": [-1.05, -3.595],
  "Santa Ana": [-1.739, -2.939],
  "Toesca": [-1.606, -1.156],
  "Parque O'Higgins": [-1.43, -0.202],
  "Rondizzoni": [-1.383, 0.865],
  "Franklin": [-0.686, 1.713],
  "El Llano": [-0.676, 2.433],
  "San Miguel": [-0.847, 3.174],
  "Lo Vial": [-1.043, 4.156],
  "Departamental": [-1.207, 4.836],
  "Ciudad del Niño": [-1.41, 5.696],
  "Lo Ovalle": [-1.63, 6.632],
  "El Parrón": [-1.891, 7.742],
  "La Cisterna": [-2.187, 9.065],
  "Plaza Quilicura": [-8.711, -11.725],
  "Lo Cruzat": [-7.789, -11.59],
  "Ferrocarril": [-6.351, -11.756],
  "Los Libertadores": [-4.982, -11.76],
  "Cardenal Caro": [-4.41, -10.812],
  "Vicaceta": [-3.734, -9.343],
  "Conchalí": [-2.719, -7.828],
  "Plaza Chacabuco": [-1.847, -6.752],
  "Hospitales": [-1.391, -5.432],
  "Plaza de Armas": [-0.868, -3.041],
  "Parque Almagro": [-0.795, -1.347],
  "Matta": [-0.039, -0.514],
  "Irarrázaval": [1.453, -0.904],
  "Monseñor Eyzaguirre": [2.948, -1.129],
  "Ñuñoa": [3.812, -1.009],
  "Chile España": [4.502, -0.922],
  "Villa Freire": [6.185, -0.95],
  "Plaza Egaña": [7.262, -1.093],
  "Fernando Castillo Velasco": [8.547, -1.262],
  "Cristóbal Colón": [5.225, -4.385],
  "Francisco Bilbao": [5.86, -3.722],
  "Príncipe de Gales": [7.027, -2.824],
  "Simón Bolívar": [7.151, -1.978],
  "Los Orientales": [6.949, 0.012],
  "Grecia": [6.688, 0.85],
  "Los Presidentes": [6.47, 2.098],
  "Quilín": [6.293, 3.119],
  "Las Torres": [5.674, 4.432],
  "Macul": [5.32, 5.659],
  "Vicuña Mackenna": [4.697, 6.934],
  "Vicente Valdés": [4.638, 7.74],
  "Rojas Magallanes": [5.052, 8.914],
  "Trinidad": [5.516, 10.148],
  "San José de la Estrella": [5.672, 11.06],
  "Los Quillayes": [5.803, 11.957],
  "Elisa Correa": [5.95, 12.934],
  "Hospital Sótero del Río": [6.101, 13.855],
  "Las Mercedes": [6.59, 16.821],
  "Plaza Puente Alto": [6.755, 17.807],
  "Santa Julia": [3.755, 8.308],
  "La Granja": [2.692, 9.522],
  "Santa Rosa": [0.865, 9.675],
  "San Ramón": [-0.044, 9.534],
  "Plaza Maipú": [-11.551, 5.776],
  "Santiago Bueras": [-11.595, 4.085],
  "Del Sol": [-11.159, 3.358],
  "Monte Tabor": [-10.383, 2.395],
  "Las Parcelas": [-9.831, 1.545],
  "Laguna Sur": [-9.622, -0.043],
  "Barrancas": [-9.736, -1.155],
  "Pudahuel": [-9.949, -2.138],
  "Lo Prado": [-7.484, -2.314],
  "Blanqueado": [-6.463, -2.566],
  "Gruta de Lourdes": [-4.885, -2.968],
  "Quinta Normal": [-3.8, -2.683],
  "Cumming": [-2.612, -2.831],
  "Bellas Artes": [-0.146, -3.135],
  "Parque Bustamante": [1.084, -2.388],
  "Santa Isabel": [1.239, -1.865],
  "Ñuble": [1.812, 0.587],
  "Rodrigo de Araya": [2.064, 1.853],
  "Carlos Valdovinos": [2.376, 2.893],
  "Camino Agrícola": [2.544, 3.546],
  "San Joaquín": [2.715, 4.46],
  "Pedrero": [3.056, 5.503],
  "Mirador": [3.716, 6.152],
  "Bellavista la Florida": [4.311, 6.905],
  "Cerrillos": [-5.342, 2.534],
  "Lo Valledor": [-3.861, 1.925],
  "Pedro Aguirre Cerda": [-2.233, 1.959],
  "Bio Bio": [0.052, 1.707],
  "Estadio Nacional": [3.686, -0.016],
  "Inés de Suárez": [3.573, -2.882],
};

export function buildStationCoords() {
  const coords = new Map();
  for (const [name, [x, y]] of Object.entries(STATION_COORDS)) {
    coords.set(name, { x, y });
  }
  return coords;
}
