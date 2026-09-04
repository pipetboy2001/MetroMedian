import { Map } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import Mapa from "../assets/mapa-metro-santiago.jpg";

function NavBar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-8">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground sm:text-xl">
          METRO<span className="text-primary">·</span>MEDIAN
        </h1>
        <p className="text-xs text-muted-foreground">Motor de rutas sobre un grafo ponderado</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Map className="h-4 w-4" />
            Mapa oficial
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mapa oficial del Metro de Santiago</DialogTitle>
            <DialogDescription>Referencia geográfica real. El mapa interactivo de la app es esquemático.</DialogDescription>
          </DialogHeader>
          <img src={Mapa} alt="Mapa del Metro de Santiago" className="rounded-lg border border-border" />
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default NavBar;
