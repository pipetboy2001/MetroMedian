import React, { useState } from "react";
import "./../Styles/Estaciones.css";

const lineas_metro = [
    ["San Pablo", "Neptuno", "Pajaritos", "Las Rejas", "Ecuador", "San Alberto Hurtado", "Universidad de Santiago", "Estación Central", "ULA", "República", "Los Héroes", "La Moneda", "Universidad de Chile", "Santa Lucía", "Universidad Católica", "Baquedano", "Salvador", "Manuel Montt", "Pedro de Valdivia", "Los Leones", "Tobalaba", "El Golf", "Alcántara", "Escuela Militar", "Manquehue", "Los Dominicos"],  
    ["Vespucio Norte", "Zapadores", "Dorsal", "Einstein", "Cementerios", "Cerro Blanco", "Patronato", "Puente Cal y Canto", "Santa Ana", "Los Héroes", "Toesca", "Parque O'Higgins", "Rondizzoni", "Franklin", "El Llano", "San Miguel", "Lo Vial", "Departamental", "Ciudad del Niño", "Lo Ovalle", "El Parrón", "La Cisterna"], 
    ["Plaza Quilicura", "Lo Cruzat", "Ferrocarril", "Los Libertadores", "Cardenal Caro", "Vicaceta", "Conchalí", "Plaza Chacabuco", "Hospitales", "Puente Cal y Canto", "Plaza de Armas", "Universidad de Chile", "Parque Almagro", "Matta", "Irarrázaval", "Monseñor Eyzaguirre", "Ñuñoa", "Chile España", "Villa Freire", "Plaza Egaña", "Fernando Castillo Velasco"], 
    ["Tobalaba", "Cristóbal Colón", "Francisco Bilbao", "Príncipe de Gales", "Simón Bolívar", "Plaza Egaña", "Los Orientales", "Grecia", "Los Presidentes", "Quilín", "Las Torres", "Macul", "Vicuña Mackenna", "Vicente Valdés", "Rojas Magallanes", "Trinidad", "San José de la Estrella", "Los Quillayes", "Elisa Correa", "Hospital Sótero del Río", "Las Mercedes", "Plaza Puente Alto"],  
    ["Vicuña Mackenna", "Santa Julia", "La Granja", "Santa Rosa", "San Ramón", "La Cisterna"],  
    ["Plaza Maipú", "Santiago Bueras", "Del Sol", "Monte Tabor", "Las Parcelas", "Laguna Sur", "Barrancas", "Pudahuel", "San Pablo", "Lo Prado", "Blanqueado", "Gruta de Lourdes", "Quinta Normal", "Cumming", "Santa Ana", "Plaza de Armas", "Bellas Artes", "Baquedano", "Parque Bustamante", "Santa Isabel", "Irarrázaval", "Ñuble", "Rodrigo de Araya", "Carlos Valdovinos", "Camino Agrícola", "San Joaquín", "Pedrero", "Mirador", "Bellavista la Florida", "Vicente Valdés"],
];

const estacionesMetro = lineas_metro.flat();



const MetroFinder = () => {
  const [estacion1, setEstacion1] = useState("");
  const [estacion2, setEstacion2] = useState("");
  const [costo, setCosto] = useState(0);
  const [ruta, setRuta] = useState([]);
  const [puntosMedios, setPuntosMedios] = useState([]);

  const grafo = new Map();

  for (const linea of lineas_metro) {
    for (let i = 0; i < linea.length - 1; i++) {
      grafo.set(linea[i], grafo.get(linea[i]) || []);
      grafo.set(linea[i + 1], grafo.get(linea[i + 1]) || []);

      grafo.get(linea[i]).push(linea[i + 1]);
      grafo.get(linea[i + 1]).push(linea[i]);
    }
  }

  function encontrarCaminoMasCorto(inicio, fin) {
    const cola = [[inicio, []]];
    const visitados = new Set();

    while (cola.length > 0) {
      const [estacion, camino] = cola.shift();

      if (!visitados.has(estacion)) {
        const nuevoCamino = [...camino, estacion];

        if (estacion === fin) {
          return nuevoCamino;
        }

        grafo.get(estacion).forEach((vecino) => {
          cola.push([vecino, nuevoCamino]);
        });

        visitados.add(estacion);
      }
    }

    return [];
  }

  const encontrarRuta = () => {
    const rutaOptima = encontrarCaminoMasCorto(estacion1, estacion2);

    if (rutaOptima.length === 0) {
      setCosto("No hay conexión directa entre las estaciones.");
      setRuta([]);
      setPuntosMedios([]);
    } else {
      setCosto(rutaOptima.length - 1);
      setRuta(rutaOptima);
      const puntoMedioIndex = Math.floor(rutaOptima.length / 2);
      const puntosMedios =
        rutaOptima.length % 2 === 0
          ? [rutaOptima[puntoMedioIndex - 1], rutaOptima[puntoMedioIndex]]
          : [rutaOptima[puntoMedioIndex]];
      setPuntosMedios(puntosMedios);
    }
  };

  return (
    <div>
      <select
        value={estacion1}
        onChange={(e) => setEstacion1(e.target.value)}
      >
        <option value="">Selecciona una estación de origen</option>
        {estacionesMetro.map((estacion, index) => (
          <option key={index} value={estacion}>
            {estacion}
          </option>
        ))}
      </select>
      <select
        value={estacion2}
        onChange={(e) => setEstacion2(e.target.value)}
      >
        <option value="">Selecciona una estación de destino</option>
        {estacionesMetro.map((estacion, index) => (
          <option key={index} value={estacion}>
            {estacion}
          </option>
        ))}
      </select>
      <button onClick={encontrarRuta}>Encontrar camino</button>
      <p>Costo: {costo}</p>
      <ul>
        {ruta.map((estacion, index) => (
          <li key={index}>{estacion}</li>
        ))}
      </ul>
      {puntosMedios.length > 0 && (
        <p>Puntos medios: {puntosMedios.join(", ")}</p>
      )}
    </div>
  );
};

export default MetroFinder;
