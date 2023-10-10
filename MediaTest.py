from collections import defaultdict
import heapq

# Define las líneas del metro como listas
lineas_metro = [
    ["San Pablo", "Neptuno", "Pajaritos", "Las Rejas", "Ecuador", "San Alberto Hurtado", "Universidad de Santiago", "Estación Central", "ULA", "República", "Los Héroes", "La Moneda", "Universidad de Chile", "Santa Lucía", "Universidad Católica", "Baquedano", "Salvador", "Manuel Montt", "Pedro de Valdivia", "Los Leones", "Tobalaba", "El Golf", "Alcántara", "Escuela Militar", "Manquehue", "Los Dominicos"],  # Línea 1
    ["Vespucio Norte", "Zapadores", "Dorsal", "Einstein", "Cementerios", "Cerro Blanco", "Patronato", "Puente Cal y Canto", "Santa Ana", "Los Héroes", "Toesca", "Parque O'Higgins", "Rondizzoni", "Franklin", "El Llano", "San Miguel", "Lo Vial", "Departamental", "Ciudad del Niño", "Lo Ovalle", "El Parrón", "La Cisterna"],  # Línea 2
    ["Plaza Quilicura", "Lo Cruzat", "Ferrocarril", "Los Libertadores", "Cardenal Caro", "Vicaceta", "Conchalí", "Plaza Chacabuco", "Hospitales", "Puente Cal y Canto", "Plaza de Armas", "Universidad de Chile", "Parque Almagro", "Matta", "Irarrázaval", "Monseñor Eyzaguirre", "Ñuñoa", "Chile España", "Villa Freire", "Plaza Egaña", "Fernando Castillo Velasco"],  # Línea 3
    ["Tobalaba", "Cristóbal Colón", "Francisco Bilbao", "Príncipe de Gales", "Simón Bolívar", "Plaza Egaña", "Los Orientales", "Grecia", "Los Presidentes", "Quilín", "Las Torres", "Macul", "Vicuña Mackenna", "Vicente Valdés", "Rojas Magallanes", "Trinidad", "San José de la Estrella", "Los Quillayes", "Elisa Correa", "Hospital Sótero del Río", "Las Mercedes", "Plaza Puente Alto"],  # Línea 4
    ["Vicuña Mackenna", "Santa Julia", "La Granja", "Santa Rosa", "San Ramón", "La Cisterna"],  # Línea 4A
    ["Plaza Maipú", "Santiago Bueras", "Del Sol", "Monte Tabor", "Las Parcelas", "Laguna Sur", "Barrancas", "Pudahuel", "San Pablo", "Lo Prado", "Blanqueado", "Gruta de Lourdes", "Quinta Normal", "Cumming", "Santa Ana", "Plaza de Armas", "Bellas Artes", "Baquedano", "Parque Bustamante", "Santa Isabel", "Irarrázaval", "Ñuble", "Rodrigo de Araya", "Carlos Valdovinos", "Camino Agrícola", "San Joaquín", "Pedrero", "Mirador", "Bellavista la Florida", "Vicente Valdés"],  # Línea 5
    ["Cerrillos", "Lo Valledor", "Pedro Aguirre Cerda", "Franklin", "Bio Bio", "Ñuble", "Estadio Nacional", "Ñuñoa", "Inés de Suárez", "Los Leones"]  # Línea 6
]
# Crea un grafo con las estaciones como nodos y las conexiones como aristas
grafo = defaultdict(list)
for linea in lineas_metro:
    for i in range(len(linea) - 1):
        grafo[linea[i]].append(linea[i + 1])
        grafo[linea[i + 1]].append(linea[i])

# Función para encontrar el camino más corto entre dos estaciones utilizando Dijkstra
def encontrar_camino_mas_corto(inicio, fin):
    cola = [(0, inicio, [])]
    heapq.heapify(cola)
    visitados = set()
    while cola:
        (costo, estacion, camino) = heapq.heappop(cola)
        if estacion not in visitados:
            visitados.add(estacion)
            camino = camino + [estacion]
            if estacion == fin:
                return costo, camino
            for vecino in grafo[estacion]:
                if vecino not in visitados:
                    heapq.heappush(cola, (costo + 1, vecino, camino))
    return float("inf"), []

# Función para encontrar el punto medio y la ruta más óptima entre dos estaciones
def encontrar_punto_medio_y_ruta_optima(estacion1, estacion2):
    costo, camino = encontrar_camino_mas_corto(estacion1, estacion2)
    if costo == float("inf"):
        return "No hay conexión directa entre las estaciones."
    
    punto_medio_index = len(camino) // 2
    if len(camino) % 2 == 0:  # Si la cantidad de estaciones es par
        punto_medio1 = camino[punto_medio_index - 1]
        punto_medio2 = camino[punto_medio_index]
        puntos_medios = [punto_medio1, punto_medio2]
    else:  # Si la cantidad de estaciones es impar
        punto_medio = camino[punto_medio_index]
        puntos_medios = [punto_medio]
    
    return costo, camino, puntos_medios

# Ejemplo de uso
estacion1 = "Neptuno"
estacion2 = "Pudahuel"
costo, ruta_optima, puntos_medios = encontrar_punto_medio_y_ruta_optima(estacion1, estacion2)
print("La ruta óptima entre {} y {} es: {}".format(estacion1, estacion2, ruta_optima))
if len(puntos_medios) == 1:
    print("El punto medio en la ruta óptima es: {}".format(puntos_medios[0]))
else:
    print("Los puntos medios en la ruta óptima son: {}".format(puntos_medios))
