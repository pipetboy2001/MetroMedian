import { useMemo, useRef, useState, useCallback } from "react";
import { LINE_META } from "../Data/metroLayout";

const PADDING = 2;
const MIN_SCALE = 0.6;
const MAX_SCALE = 3.2;

function useBBox(coords) {
  return useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const { x, y } of coords.values()) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return {
      minX: minX - PADDING,
      minY: minY - PADDING,
      width: maxX - minX + PADDING * 2,
      height: maxY - minY + PADDING * 2,
    };
  }, [coords]);
}

export default function MetroMap({ lineasMetro, coords, routeStops, origin, destination, onStationClick }) {
  const bbox = useBBox(coords);
  const hasRoute = Boolean(routeStops && routeStops.length > 1);

  const lines = useMemo(
    () =>
      lineasMetro.map((linea) => {
        const name = linea[0];
        const stations = linea.slice(1);
        return {
          name,
          meta: LINE_META[name],
          points: stations.map((s) => coords.get(s)).filter(Boolean),
        };
      }),
    [lineasMetro, coords]
  );

  const stations = useMemo(() => {
    const map = new Map();
    for (const linea of lineasMetro) {
      const lineName = linea[0];
      for (const s of linea.slice(1)) {
        if (!map.has(s)) map.set(s, { name: s, coord: coords.get(s), lines: [] });
        map.get(s).lines.push(lineName);
      }
    }
    return [...map.values()];
  }, [lineasMetro, coords]);

  const routeStationSet = useMemo(() => new Set((routeStops || []).map((s) => s.station)), [routeStops]);
  // Estaciones donde la ruta calculada realmente cambia de línea (no solo
  // pasa de largo por una estación que también es transbordo de otras líneas).
  const routeTransferSet = useMemo(
    () => new Set((routeStops || []).filter((s) => s.lines.length > 1).map((s) => s.station)),
    [routeStops]
  );
  // Línea que la ruta realmente usa en cada parada, para no pintar una
  // estación con el color de una línea distinta a la que se está recorriendo.
  const routeLineByStation = useMemo(() => {
    const map = new Map();
    for (const stop of routeStops || []) map.set(stop.station, stop.lines[0]);
    return map;
  }, [routeStops]);

  const routePathD = useMemo(() => {
    if (!hasRoute) return null;
    const pts = routeStops.map((s) => coords.get(s.station)).filter(Boolean);
    if (pts.length < 2) return null;
    return "M " + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
  }, [routeStops, coords, hasRoute]);

  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const dragState = useRef(null);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    setView((v) => ({
      ...v,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * (e.deltaY > 0 ? 0.9 : 1.1))),
    }));
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragState.current = { startX: e.clientX, startY: e.clientY, tx: view.tx, ty: view.ty };
    },
    [view.tx, view.ty]
  );

  const onPointerMove = useCallback((e) => {
    if (!dragState.current) return;
    const { startX, startY, tx, ty } = dragState.current;
    setView((v) => ({ ...v, tx: tx + (e.clientX - startX), ty: ty + (e.clientY - startY) }));
  }, []);

  const onPointerUp = useCallback((e) => {
    if (dragState.current) e.currentTarget.releasePointerCapture(e.pointerId);
    dragState.current = null;
  }, []);

  const zoomBy = (factor) =>
    setView((v) => ({ ...v, scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor)) }));
  const resetView = () => setView({ scale: 1, tx: 0, ty: 0 });

  return (
    <div className="metro-map-viewport">
      <div className="metro-map-controls">
        <button type="button" onClick={() => zoomBy(1.2)} aria-label="Acercar">
          +
        </button>
        <button type="button" onClick={() => zoomBy(0.8)} aria-label="Alejar">
          −
        </button>
        <button type="button" onClick={resetView} aria-label="Restablecer vista" className="reset">
          ⟲
        </button>
      </div>
      <svg
        viewBox={`${bbox.minX} ${bbox.minY} ${bbox.width} ${bbox.height}`}
        className="metro-map-svg"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})` }}
      >
        <defs>
          <filter id="metro-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>

        {lines.map((line) => (
          <polyline
            key={line.name}
            points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={line.meta?.color || "#888"}
            strokeWidth={0.34}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={hasRoute ? 0.22 : 0.92}
          />
        ))}

        {routePathD && (
          <>
            <path
              d={routePathD}
              fill="none"
              stroke="#f5e0dc"
              strokeWidth={0.66}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.28}
              filter="url(#metro-glow)"
            />
            <path d={routePathD} fill="none" stroke="#94e2d5" strokeWidth={0.32} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {stations.map((s) => {
          if (!s.coord) return null;
          const isTransfer = s.lines.length > 1;
          const isOrigin = s.name === origin;
          const isDest = s.name === destination;
          const onRoute = routeStationSet.has(s.name);
          // Con una ruta activa, solo los transbordos que realmente se usan se
          // marcan como tal; el resto se ve como una estación normal para no
          // competir visualmente con el camino resaltado.
          const showAsTransfer = isTransfer && (!hasRoute || routeTransferSet.has(s.name));
          const lineForColor = (onRoute && routeLineByStation.get(s.name)) || s.lines[0];
          const baseColor = LINE_META[lineForColor]?.color || "#888";
          const r = showAsTransfer ? (onRoute ? 0.3 : 0.24) : onRoute ? 0.22 : 0.16;

          return (
            <g
              key={s.name}
              className="metro-station"
              onClick={() => onStationClick(s.name)}
              transform={`translate(${s.coord.x} ${s.coord.y})`}
              opacity={hasRoute && !onRoute ? 0.35 : 1}
            >
              <title>{s.name}</title>
              <circle r={r + 0.25} fill="transparent" />
              {(isOrigin || isDest) && (
                <circle r={0.38} fill="none" stroke={isOrigin ? "#a6e3a1" : "#eba0ac"} strokeWidth={0.08} opacity={0.8}>
                  <animate attributeName="r" values="0.34;0.62;0.34" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              {onRoute && !isOrigin && !isDest && (
                <circle r={r + 0.1} fill="none" stroke="#94e2d5" strokeWidth={0.07} opacity={0.85} />
              )}
              <circle
                r={r}
                fill={showAsTransfer ? "#cdd6f4" : baseColor}
                stroke={isOrigin ? "#a6e3a1" : isDest ? "#eba0ac" : "#11111b"}
                strokeWidth={showAsTransfer ? 0.09 : 0.06}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
