# Metro Median

Motor de rutas para el Metro de Santiago construido sobre teoría de grafos, no sobre un CRUD.

## Problema

Encontrar la ruta más eficiente en una red de metro con 7 líneas y transbordos no es un simple recorrido de lista: hay que decidir, para cada par de estaciones, cuál combinación de líneas minimiza el tiempo total, considerando que cambiar de línea tiene un costo (caminar, esperar) que no siempre compensa.

## Solución arquitectónica

En vez de resolverlo con reglas ad-hoc, la red se modela como un grafo ponderado:

- **Nodos** = pares `(línea, estación)`, no solo la estación. Así, un transbordo (cambiar de línea en una misma estación física) es una arista más del grafo, con su propio peso, en vez de un caso especial fuera del modelo.
- **Aristas de viaje** conectan estaciones consecutivas de una misma línea, con un peso que representa el tiempo del tramo.
- **Aristas de transbordo** conectan las distintas variantes de línea de una misma estación, con una penalización de tiempo.
- **Dijkstra** (implementación propia, con min-heap binario, `O((V+E) log V)`) resuelve la ruta óptima entre dos estaciones probando en una sola corrida todas las combinaciones de línea de entrada y salida posibles, gracias a dos nodos virtuales de inicio/fin conectados con peso 0.

El resultado se renderiza en tiempo real sobre un mapa esquemático interactivo (SVG, con zoom/pan): la ruta calculada se resalta animada sobre el grafo real de la red, no como una lista de texto.

## Tecnologías

- **React** + **Vite**
- **shadcn/ui** sobre **Radix UI** + **Tailwind CSS** para la interfaz
- Teoría de grafos y algoritmia implementadas a mano (`src/lib/dijkstra.js`, `src/lib/metroGraph.js`), sin librerías de pathfinding de por medio

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

- `npm run build` genera el build de producción.
- `npm run lint` corre ESLint.

## Estructura relevante

```
src/lib/dijkstra.js        # Dijkstra genérico (min-heap binario)
src/lib/metroGraph.js      # Grafo (línea, estación) + findRoute()
src/Data/metroLayout.js    # Coordenadas esquemáticas + colores por línea
src/Components/MetroMap.jsx      # Render SVG interactivo del grafo
src/Components/Estaciones.jsx    # Orquestador: UI de búsqueda + resultado
```
