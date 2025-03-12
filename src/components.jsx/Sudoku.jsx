import SudokuGrid from "./SudokuGrid";
import samples from "../assets/samples.json";
import { createContext, useEffect, useState } from "react";

export const SudokuContext = createContext();

function Sudoku() {
  // Contendrá la matriz del sudoku resuelto.
  const [sudoku, setSudoku] = useState(null);

  // Contendrá la matriz de las respuestas ingresadas por el jugador.
  const [input, setInput] = useState(null);

  // Contendrá el arreglo con las índices del sudoku cuyo valor deben estar
  // visibiles para el jugador.
  const [clues, setClues] = useState(null);

  /* Estado del juego, este puede ser:
     "withdrew", cuando se desiste de la partida.
     "solved", cuando el sudoku es resuelto por el jugador.
     nulo, estado por defecto.
  */
  const [status, setStatus] = useState(null);

  // Determina si el sudoku está resuelto o no.
  const isSolved = () => {
    return ["solved", "withdrew"].includes(status);
  };

  // Obtiene un número aleatorio entre un rango determinado.
  const getRandomInt = (from, to, exclude) => {
    let num;
    do {
      num = Math.floor(Math.random() * (to - from + 1)) + from;
    } while (exclude?.includes(num));
    return num;
  };

  // Obtiene una matriz aleatoria de las muestras proporcionadas.
  const getMatrix = () => {
    const rndIndex = getRandomInt(0, samples.length - 1);
    return Array.from(samples[rndIndex]);
  };

  // Rota una matriz hacia la derecha por una sola vez.
  const rotateMatrix = (matrix) => {
    const array = Array.from({ length: matrix.length }, () =>
      Array(matrix.length)
    );
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        const index = matrix.length - (i + 1);
        array[j][index] = matrix[i][j];
      }
    }
    return array;
  };

  // Desordena las filas de una matriz.
  const shuffleRows = (matrix) => {
    const array = Array(0);
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    for (let i = 0; i < matrix.length; i += 3) {
      array.push(shuffle(matrix.slice(i, i + 3)));
    }
    return array.flat();
  };

  // Desordena el contenido de una matriz.
  const shuffleMatrix = (matrix) => {
    let array = Array.from(matrix);
    const max = getRandomInt(1, 4);
    for (let i = 0; i < max; i++) {
      array = rotateMatrix(array);
      array = shuffleRows(array);
    }
    return array;
  };

  /* Prepara lo necesario para el sudoku:
     1. Toma una matriz de las muestras proporcionadas y desordena su
        cotenido.
     2. Crea la matriz del sudoku resuelto, copiando la matriz muestra.
        En la matriz muestra, los números menores que uno (0.N) indican que
        son pistas, lo cual es irrelevante para el sudoku resuelto, por lo
        que convierte dichos valores en números enteros.
     3. Crea la matriz de las respuestas ingresadas por el jugador, copiando
        la matriz muestra. En la matriz muestra, los números menores que uno 
        (0.N) indican que son pistas. Convierte dichos valores en números
        enteros, ya que el jugador necesita verlos, y borra (campo vacío) los
        que son mayores o iguales a uno, puesto que no están destinados a estar
        visibles para el jugador.
     4. Crea el arreglo con las índices de las pistas del sudoku. En la matriz
        muestra, los números menores que uno (0.N) indican que son pistas.
        Reemplaza dichos valores por su índices. Los que son mayores o iguales
        que uno, los reemplaza con un valor nulo. Posteriormente, elimina los
        valores nulos del arreglo.
  */
  const createSudoku = () => {
    const matrix = shuffleMatrix(getMatrix());
    setSudoku(
      matrix.map((row) =>
        row.map((num) => (num < 1 ? Number(num.toString().split(".")[1]) : num))
      )
    );
    setInput(
      matrix.map((row) =>
        row.map((num) => (num < 1 ? Number(num.toString().split(".")[1]) : ""))
      )
    );
    setClues(
      matrix.map((row) =>
        row
          .map((num, col) => (num < 1 ? col : null))
          .filter((val) => val !== null)
      )
    );
  };

  const onBtnClick = () => {
    if (["solved", "withdrew"].includes(status)) {
      createSudoku();
      setStatus(null);
    } else {
      setInput(sudoku);
      setStatus("withdrew");
    }
  };

  useEffect(() => {
    createSudoku();
  }, []);

  useEffect(() => {
    if (sudoku && sudoku.toString() === input.toString()) {
      setStatus("solved");
    }
  }, [input]);

  return (
    <div className="sudoku">
      <SudokuContext value={[sudoku, input, setInput, clues, status]}>
        <p className={isSolved() ? "solved" : ""}>
          {isSolved() ? "¡Sudoku resuelto!" : "Sin resolver"}
        </p>

        <SudokuGrid grid={sudoku} />

        <button onClick={onBtnClick}>
          {isSolved() ? "Jugar de nuevo" : "Resolver"}
        </button>
      </SudokuContext>
    </div>
  );
}

export default Sudoku;
