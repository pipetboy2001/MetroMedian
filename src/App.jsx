import Estaciones from "./Components/Estaciones";
import NavBar from "./Components/Navbar";

const App = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <NavBar />
      <main className="flex-1 overflow-hidden">
        <Estaciones />
      </main>
    </div>
  );
};

export default App;
