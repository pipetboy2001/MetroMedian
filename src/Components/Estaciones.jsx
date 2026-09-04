import { useMemo, useState } from "react";
import { lineas_metro } from "../Data/Estaciones.json";
import { buildStationCoords, LINE_META } from "../Data/metroLayout";
import { buildMetroGraph, findRoute } from "../lib/metroGraph";
import MetroMap from "./MetroMap";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeftRight, Clock, MapPin, Repeat, Train } from "lucide-react";

function LineDot({ line, className = "" }) {
  const meta = LINE_META[line];
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/20 ${className}`}
      style={{ backgroundColor: meta?.color || "#888" }}
    />
  );
}

const MetroFinder = () => {
  const graph = useMemo(() => buildMetroGraph(lineas_metro), []);
  const coords = useMemo(() => buildStationCoords(), []);

  const stationsByLine = useMemo(
    () => lineas_metro.map((linea) => ({ name: linea[0], stations: linea.slice(1) })),
    []
  );

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [error, setError] = useState("");

  const canCompute = origin && destination && origin !== destination;

  const computeRoute = () => {
    if (!canCompute) {
      setError("Selecciona dos estaciones distintas.");
      setRoute(null);
      return;
    }
    const result = findRoute(graph, origin, destination);
    if (!result) {
      setError("No se encontró una ruta entre esas estaciones.");
      setRoute(null);
      return;
    }
    setError("");
    setRoute(result);
  };

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
    setRoute(null);
  };

  const onStationClick = (name) => {
    setRoute(null);
    setError("");
    if (!origin || (origin && destination)) {
      setOrigin(name);
      setDestination("");
      return;
    }
    if (name === origin) return;
    setDestination(name);
  };

  const stationOptions = (excluded) =>
    stationsByLine.map(({ name, stations }) => (
      <SelectGroup key={name}>
        <SelectLabel className="flex items-center gap-2">
          <LineDot line={name} /> {LINE_META[name]?.label || name}
        </SelectLabel>
        {stations
          .filter((s) => s !== excluded)
          .map((s) => (
            <SelectItem key={`${name}-${s}`} value={s}>
              {s}
            </SelectItem>
          ))}
      </SelectGroup>
    ));

  return (
    <div className="flex h-full flex-col gap-4 p-4 lg:flex-row lg:gap-5 lg:p-6">
      <aside className="flex w-full flex-col gap-4 lg:w-[380px] lg:shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Train className="h-4 w-4 text-primary" /> Buscador de rutas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Origen</Label>
              <Select value={origin} onValueChange={(v) => { setOrigin(v); setRoute(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Estación de origen" />
                </SelectTrigger>
                <SelectContent>{stationOptions(destination)}</SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <Button variant="ghost" size="icon" onClick={swap} aria-label="Intercambiar" className="text-muted-foreground">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Destino</Label>
              <Select value={destination} onValueChange={(v) => { setDestination(v); setRoute(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Estación de destino" />
                </SelectTrigger>
                <SelectContent>{stationOptions(origin)}</SelectContent>
              </Select>
            </div>

            <Button onClick={computeRoute} disabled={!canCompute} className="mt-1">
              Calcular ruta óptima
            </Button>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <p className="text-xs text-muted-foreground">
              También puedes hacer clic en dos estaciones del mapa para elegir origen y destino.
            </p>
          </CardContent>
        </Card>

        {route && (
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <div className="flex items-baseline justify-between">
                <CardTitle className="text-2xl font-mono">
                  {route.totalTimeMin < 1 ? "0" : Math.round(route.totalTimeMin)} min
                </CardTitle>
                <span className="text-xs text-muted-foreground">estimado</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {route.stops.length} estaciones
                </span>
                <span className="flex items-center gap-1">
                  <Repeat className="h-3.5 w-3.5" /> {route.transfers} transbordo{route.transfers === 1 ? "" : "s"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="relative flex max-h-[320px] flex-col gap-0 overflow-y-auto border-l border-border pl-4">
                {route.stops.map((stop, i) => {
                  const isTransfer = stop.lines.length > 1;
                  const isEdge = i === 0 || i === route.stops.length - 1;
                  return (
                    <li key={`${stop.station}-${i}`} className="relative pb-4 last:pb-0">
                      <span
                        className="absolute -left-[1.15rem] top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background"
                        style={{ backgroundColor: isEdge ? "hsl(var(--primary))" : LINE_META[stop.lines[0]]?.color }}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium leading-tight">{stop.station}</span>
                        {stop.lines.map((l) => (
                          <Badge key={l} variant="secondary" className="gap-1 px-1.5 py-0 text-[10px]">
                            <LineDot line={l} /> {LINE_META[l]?.label}
                          </Badge>
                        ))}
                        {isTransfer && (
                          <Badge variant="outline" className="px-1.5 py-0 text-[10px] text-primary border-primary/40">
                            Transbordo
                          </Badge>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          Dijkstra sobre grafo ponderado · O((V+E) log V)
        </div>
      </aside>

      <div className="min-h-[420px] flex-1 lg:min-h-0">
        <MetroMap
          lineasMetro={lineas_metro}
          coords={coords}
          routeStops={route?.stops}
          origin={origin}
          destination={destination}
          onStationClick={onStationClick}
        />
      </div>
    </div>
  );
};

export default MetroFinder;
