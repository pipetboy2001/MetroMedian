import React, { useState } from "react";
import Estaciones from "./Components/Estaciones";
import data from "./Data/Estaciones.json";

const App = () => {

  return (
    <div className="App">
      <h1>Encuentra el Punto Medio entre Estaciones del Metro</h1>
      <Estaciones/>
    </div>
  );
};

export default App;
