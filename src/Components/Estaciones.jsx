import React, { useState } from "react";
import "./../Styles/Estaciones.css";
import { lineas_metro } from "../Data/Estaciones.json";

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
      <select value={estacion1} onChange={(e) => setEstacion1(e.target.value)}>
        <option value="" disabled>
          Selecciona una estación de origen
        </option>
        {estacionesMetro.map((estacion, index) => (
          <option
            key={index}
            value={estacion}
            disabled={estacion.startsWith("Linea")}
            className={estacion.startsWith("Linea") ? "linea-option" : ""}
          >
            {estacion}
          </option>
        ))}
      </select>
      <select value={estacion2} onChange={(e) => setEstacion2(e.target.value)}>
        <option value="" disabled>
          Selecciona una estación de destino
        </option>
        {estacionesMetro.map((estacion, index) => (
          <option
            key={index}
            value={estacion}
            disabled={estacion.startsWith("Linea")}
            className={estacion.startsWith("Linea") ? "linea-option" : ""}
          >
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
