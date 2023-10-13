import React, { useState, useRef } from 'react';
import Map from './../assets/mapa-metro-santiago.jpg'; // Reemplaza con la ruta correcta de tu imagen

const App = () => {
  const [zoom, setZoom] = useState(1); // Estado para controlar el nivel de zoom
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Estado para almacenar la posición inicial del arrastre
  const imageRef = useRef(null); // Referencia a la imagen para acceder a sus propiedades

  const handleZoomIn = () => {
    // Incrementa el nivel de zoom
    const newZoom = zoom + 0.1;
    setZoom(Math.min(newZoom, 3)); // Limita el nivel de zoom máximo a 3
  };

  const handleZoomOut = () => {
    // Decrementa el nivel de zoom
    const newZoom = zoom - 0.1;
    setZoom(Math.max(newZoom, 0.5)); // Limita el nivel de zoom mínimo a 0.5
  };

  const handleMouseDown = (e) => {
    // Guarda la posición inicial del arrastre
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    // Calcula la diferencia de posición y aplica la transformación de la imagen
    if (e.buttons === 1) {
      const offsetX = e.clientX - dragStart.x;
      const offsetY = e.clientY - dragStart.y;
      imageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
    }
  };

  return (
    <div className="app-container">
      <div className="map-container">
        <img
          ref={imageRef}
          className="map-image"
          src={Map}
          alt="Mapa de Metro Santiago"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ transform: `scale(${zoom})` }}
        />
        <div className="zoom-buttons">
          <button onClick={handleZoomIn}>+</button>
          <button onClick={handleZoomOut}>-</button>
        </div>
      </div>
    </div>
  );
};

export default App;
