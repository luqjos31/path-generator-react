import React, { useState, useEffect } from 'react';
import "../App.css"

const Grid = () => {
  const [grid, setGrid] = useState([]); // Grid del laberinto
  const [start, setStart] = useState(null); // Punto de inicio
  const [end, setEnd] = useState(null); // Punto de fin
  const SQUARESIZE = 40

  useEffect(() => {
    // Inicializar el grid y establecer el punto de inicio y fin
    const initializeGrid = () => {
      const newGrid = [];
      for (let row = 0; row < 10; row++) {
        const newRow = [];
        for (let col = 0; col < 10; col++) {
          newRow.push({ row, col, isStart: false, isEnd: false, isWall: false });
        }
        newGrid.push(newRow);
      }
      setGrid(newGrid);

      // Establecer el punto de inicio y fin en posiciones predefinidas
      setStart({ row: 0, col: 0 });
      setEnd({ row: 9, col: 9 });
    };

    initializeGrid();
  }, []);

  // Función para manejar el clic en una celda del grid
  const handleCellClick = (row, col) => {
    const updatedGrid = grid.map((gridRow) =>
      gridRow.map((cell) => {
        // Establecer el punto de inicio
        if (start && cell.row === start.row && cell.col === start.col) {
          return { ...cell, isStart: false };
        }
        if (cell.row === row && cell.col === col) {
          return { ...cell, isStart: true };
        }

        // Establecer el punto de fin
        if (end && cell.row === end.row && cell.col === end.col) {
          return { ...cell, isEnd: false };
        }
        if (cell.row === row && cell.col === col) {
          return { ...cell, isEnd: true };
        }

        return cell;
      })
    );

    setGrid(updatedGrid);
  };


  // Función heurística para estimar la distancia entre dos nodos (en este caso, distancia Manhattan)
  function heuristic(nodeA, nodeB) {
    const [x1, y1] = nodeA;
    const [x2, y2] = nodeB;
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  // Obtener el nodo con el puntaje f más bajo del conjunto abierto
  function getNodeWithLowestFScore(openSet, fScore) {
    let lowestFScoreNode = openSet[0];
    let lowestFScore = fScore[lowestFScoreNode];

    for (let i = 1; i < openSet.length; i++) {
      const node = openSet[i];
      const f = fScore[node];

      if (f < lowestFScore) {
        lowestFScoreNode = node;
        lowestFScore = f;
      }
    }

    return lowestFScoreNode;
  }

  // Remover un nodo del conjunto abierto
  function removeNodeFromSet(set, node) {
    const index = set.indexOf(node);
    if (index !== -1) {
      set.splice(index, 1);
    }
  }

  // Obtener los vecinos de un nodo en el grid
  function getNeighbors(node, grid) {
    const [x, y] = node;
    const neighbors = [];
    const numRows = grid.length;
    const numCols = grid[0].length;

    if (x > 0) neighbors.push([x - 1, y]); // Vecino superior
    if (x < numRows - 1) neighbors.push([x + 1, y]); // Vecino inferior
    if (y > 0) neighbors.push([x, y - 1]); // Vecino izquierdo
    if (y < numCols - 1) neighbors.push([x, y + 1]); // Vecino derecho

    return neighbors;
  }

  // Verificar si un nodo está presente en un conjunto
  function isNodeInSet(set, node) {
    return set.some((n) => n[0] === node[0] && n[1] === node[1]);
  }

  // Reconstruir el camino desde el nodo inicial hasta el nodo objetivo
  function reconstructPath(cameFrom, current) {
    const path = [current];

    while (cameFrom[current]) {
      current = cameFrom[current];
      path.unshift(current);
    }

    return path;
  }


  // Función para encontrar la ruta más óptima utilizando el algoritmo A*
  function findOptimalPath(grid, start, end) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = { [start]: 0 };
    const fScore = { [start]: heuristic(start, end) };

    while (openSet.length > 0) {
      // Obtener el nodo con el puntaje f más bajo del conjunto abierto
      const current = getNodeWithLowestFScore(openSet, fScore);

      // Si se ha alcanzado el nodo de destino, reconstruir el camino y devolverlo
      if (current === end) {
        return reconstructPath(cameFrom, current);
      }

      // Remover el nodo actual del conjunto abierto
      removeNodeFromSet(openSet, current);

      // Obtener los vecinos del nodo actual
      const neighbors = getNeighbors(current, grid);

      for (const neighbor of neighbors) {
        // Calcular el costo g para el vecino
        const tentativeGScore = gScore[current] + 1; // En este ejemplo, el costo para moverse a un vecino es siempre 1

        if (tentativeGScore < gScore[neighbor]) {
          // Se encontró un camino más corto hacia el vecino
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);

          if (!isNodeInSet(openSet, neighbor)) {
            // Agregar el vecino al conjunto abierto si no está presente
            openSet.push(neighbor);
          }
        }
      }
    }

    // No se encontró un camino válido
    return [];
  }

  return (
    <div>
      <button onClick={findOptimalPath}>Encontrar ruta óptima</button>
      <div className="grid">
        {grid.map((gridRow) =>
          gridRow.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`cell${cell.isStart ? 'start' : ''}${cell.isEnd ? 'end' : ''}`}
              style={{ left: `${cell.col * SQUARESIZE}px`, top: `${cell.row * SQUARESIZE}px` }}
              onClick={() => handleCellClick(cell.row, cell.col)}

            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
