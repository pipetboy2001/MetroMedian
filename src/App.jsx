import React from "react";
import Estaciones from "./Components/Estaciones";
import NavBar from "./Components/Navbar";
import "./Styles/styles.scss";

const App = () => {
  return (
    <div className="contenedor-blanco">
          <NavBar />
          <Estaciones />
    </div>
  );
};

export default App;
