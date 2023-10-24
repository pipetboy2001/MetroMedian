import React, { useState } from "react";
import { lineas_metro } from "../Data/Estaciones.json";
import { FaTrain } from "react-icons/fa";

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
    if (!estacion1 || !estacion2) {
      setCosto("Por favor, selecciona estaciones de origen y destino.");
      setRuta([]);
      setPuntosMedios([]);
    } else {
      const rutaOptima = encontrarCaminoMasCorto(estacion1, estacion2);
      if (rutaOptima.length === 0) {
        setCosto("No hay conexión directa entre las estaciones.");
        setRuta([]);
        setPuntosMedios([]);
      } else {
        setCosto(rutaOptima.length );
        setRuta(rutaOptima);
        const puntoMedioIndex = Math.floor(rutaOptima.length / 2);
        const puntosMedios =
          rutaOptima.length % 2 === 0
            ? [rutaOptima[puntoMedioIndex - 1], rutaOptima[puntoMedioIndex]]
            : [rutaOptima[puntoMedioIndex]];
        setPuntosMedios(puntosMedios);
      }
    }
  };

  return (
    <div className="container">
      <div className="selectors-wrapper">
        <select
          value={estacion1}
          onChange={(e) => setEstacion1(e.target.value)}
          className="station-selector"
        >
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
        <select
          value={estacion2}
          onChange={(e) => setEstacion2(e.target.value)}
          className="station-selector"
        >
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
      </div>
      <button onClick={encontrarRuta} className="search-button">
        Encontrar camino
      </button>
      <div className="results-container">
        {ruta.length > 0 ? (
          <ul>
            {ruta.map((estacion, index) => (
              <li key={index}>
                <FaTrain className="train-icon" /> {estacion}
              </li>
            ))}
          </ul>
        ) : (
          <p>Seleccione 2 estaciones para encontrar la ruta.</p>
        )}
      </div>

      <div className="results-text">
        <p>
        N° de Estaciones: <span className="costo-value"> {costo !== 0 ? costo : 'No se ha seleccionado'} </span>

        </p>
        {puntosMedios.length > 0 && (
          <p>
            Puntos medios:{" "}
            <span className="puntos-medios-list">
              {puntosMedios.join(", ")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MetroFinder;
