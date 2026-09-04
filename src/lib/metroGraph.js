import { dijkstra, reconstructPath } from "./dijkstra.js";

const TRANSFER_PENALTY_MIN = 4.5;
const START = "__START__";
const END = "__END__";
const NODE_SEP = "::";

function nodeId(line, station) {
  return line + NODE_SEP + station;
}

function splitNodeId(id) {
  const sepIndex = id.indexOf(NODE_SEP);
  return { line: id.slice(0, sepIndex), station: id.slice(sepIndex + NODE_SEP.length) };
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Tiempo de viaje entre dos estaciones consecutivas: 1.8-3.2 min, determinístico por par. */
function segmentWeight(a, b) {
  return 1.8 + (hash(a + "|" + b) % 141) / 100;
}

function addEdge(graph, a, b, weight) {
  if (!graph.has(a)) graph.set(a, []);
  if (!graph.has(b)) graph.set(b, []);
  graph.get(a).push({ to: b, weight });
  graph.get(b).push({ to: a, weight });
}

/**
 * Construye un grafo expandido: cada nodo es (línea, estación), no solo la estación.
 * Así un cambio de línea en una estación de transbordo es una arista explícita con
 * su propio peso, en vez de una regla especial fuera del grafo.
 */
export function buildMetroGraph(lineasMetro) {
  const graph = new Map();
  const stationNodes = new Map();

  for (const linea of lineasMetro) {
    const lineName = linea[0];
    const stations = linea.slice(1);

    stations.forEach((station, i) => {
      const id = nodeId(lineName, station);
      if (!stationNodes.has(station)) stationNodes.set(station, new Set());
      stationNodes.get(station).add(id);

      if (i > 0) {
        const prevId = nodeId(lineName, stations[i - 1]);
        addEdge(graph, prevId, id, segmentWeight(stations[i - 1], station));
      }
    });
  }

  for (const nodes of stationNodes.values()) {
    const ids = [...nodes];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        addEdge(graph, ids[i], ids[j], TRANSFER_PENALTY_MIN);
      }
    }
  }

  return { graph, stationNodes };
}

export function stationExists({ stationNodes }, name) {
  return stationNodes.has(name);
}

export function transferLinesOf({ stationNodes }, name) {
  const nodes = stationNodes.get(name);
  if (!nodes) return [];
  return [...nodes].map((id) => splitNodeId(id).line);
}

/**
 * Ruta óptima entre dos estaciones (por nombre, sin importar la línea de entrada/salida).
 * Se resuelve con nodos virtuales START/END conectados con peso 0 a todas las variantes
 * de línea de origen/destino, así Dijkstra explora todas las combinaciones de línea posibles
 * en una sola corrida.
 */
export function findRoute({ graph, stationNodes }, originName, destName) {
  if (!stationNodes.has(originName) || !stationNodes.has(destName)) return null;
  if (originName === destName) {
    return {
      stops: [{ station: originName, lines: transferLinesOf({ stationNodes }, originName) }],
      totalTimeMin: 0,
      transfers: 0,
    };
  }

  const originIds = [...stationNodes.get(originName)];
  const destIds = [...stationNodes.get(destName)];

  graph.set(
    START,
    originIds.map((to) => ({ to, weight: 0 }))
  );
  const appended = [];
  for (const id of destIds) {
    if (!graph.has(id)) graph.set(id, []);
    graph.get(id).push({ to: END, weight: 0 });
    appended.push(id);
  }

  const { dist, prev } = dijkstra(graph, START);
  const nodePath = reconstructPath(prev, START, END);

  graph.delete(START);
  for (const id of appended) graph.get(id).pop();

  if (!nodePath) return null;

  const inner = nodePath.slice(1, -1).map(splitNodeId);

  const stops = [];
  for (const { line, station } of inner) {
    const last = stops[stops.length - 1];
    if (last && last.station === station) {
      last.lines.push(line);
    } else {
      stops.push({ station, lines: [line] });
    }
  }

  const transfers = stops.filter((s) => s.lines.length > 1).length;

  return {
    stops,
    totalTimeMin: dist.get(END),
    transfers,
  };
}
