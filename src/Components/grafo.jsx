class Grafo {
    constructor(lineas) {
      this.grafo = {};
  
      // Crea el grafo a partir de los datos proporcionados
      Object.keys(lineas).forEach((linea) => {
        const estaciones = lineas[linea].estaciones;
        estaciones.forEach((estacion, index) => {
          this.addEstacion(estacion.nombre);
  
          // Conecta la estación actual con la siguiente estación, si existe
          if (index < estaciones.length - 1) {
            this.conectarEstaciones(estacion.nombre, estaciones[index + 1].nombre);
          }
        });
      });
    }
  
    addEstacion(estacion) {
      // Agrega una estación al grafo si no existe
      if (!this.grafo[estacion]) {
        this.grafo[estacion] = [];
      }
    }
  
    conectarEstaciones(estacionA, estacionB) {
      // Conecta dos estaciones en el grafo bidireccionalmente
      this.grafo[estacionA].push(estacionB);
      this.grafo[estacionB].push(estacionA);
    }
  
    encontrarPuntoMedio(estacionInicio, estacionFin) {
      // Implementa el algoritmo para encontrar el punto medio entre dos estaciones
      // Devuelve el nombre del punto medio o null si no se encuentra un punto medio
    }
  }
  
  export default Grafo;
  