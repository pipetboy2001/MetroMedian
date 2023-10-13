import React from "react";
import Estaciones from "./Components/Estaciones";
import NavBar from "./Components/Navbar";
import "./Styles/styles.scss";
 import Map from "./assets/mapa-metro-santiago.jpg";
//import Map from "./Components/Map";

const App = () => {
  return (
    <div className="app-container">
      <div className="map-container">
        <img className="map-image" src={Map} alt="Mapa de Metro Santiago" />
        {/* <Map /> */}

      </div>
      <div className="column-container">
        <div className="navbar">
          <NavBar />
        </div>
        <div className="estaciones-container">
          <Estaciones />
        </div>
      </div>
    </div>
  );
};

export default App;
