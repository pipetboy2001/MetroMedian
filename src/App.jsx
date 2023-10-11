import React from "react";
import Estaciones from "./Components/Estaciones";
import NavBar from "./Components/Navbar";
import "./Styles/Inicio.css"; // Importa el archivo CSS

const App = () => {
  return (
    <div>
      <NavBar/>
      <Estaciones/>
    </div>
  );
};

export default App;
