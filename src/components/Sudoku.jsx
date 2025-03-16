import SudokuGrid from "./SudokuGrid";
import samples from "../assets/samples.json";
import { createContext, useEffect, useState } from "react";

export const SudokuContext = createContext();

function Sudoku() {
  // Contendrá la matriz del sudoku resuelto.
  const [sudoku, setSudoku] = useState(null);

  // Especifica el nivel del sudoku.
  const [level, setLevel] = useState("easy");

  // Corresponde a las opciones que se mostrarán en el elemento SELECT.
  const levels = {
    easy: "Fácil",
    hard: "Difícil",
  };

  // Contendrá la matriz de las respuestas ingresadas por el jugador.
  const [input, setInput] = useState(null);

  /* Contendrá el arreglo con las índices del sudoku cuyo valor deben estar
     visibiles para el jugador.
  */
  const [clues, setClues] = useState(null);

  /* Estado del juego, este puede ser:
     "withdrew", cuando se desiste de la partida.
     "solved", cuando el sudoku es resuelto por el jugador.
     "restarted", cuando se borra todo lo ingresado.
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
    const rndIndex = getRandomInt(0, samples[level].length - 1);
    return Array.from(samples[level][rndIndex]);
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

  /* Obtiene y guarda un sudoku, tomando una matriz de las muestras
     proporcionadas y desordena su cotenido. 
  */
  const createSudoku = () => {
    const sudoku = shuffleMatrix(getMatrix());
    setSudoku(sudoku);
  };

  /*
    El sudoku, los números menores que uno (0.N) indican que son pistas,
    lo cual es irrelevante para mostrar el sudoku resuelto, por lo que
    convierte dichos valores en números enteros.
  */
  const getSudoku = () => {
    return sudoku.map((row) =>
      row.map((num) => (num < 1 ? Number(num.toString().split(".")[1]) : num))
    );
  };

  /* Crea la matriz de las respuestas ingresadas por el jugador. En el
     sudoku, los números menores que uno (0.N) indican que son pistas.
     Convierte dichos valores en números enteros, ya que el jugador necesita
     verlos, y borra (campo vacío) los que son mayores o iguales a uno, puesto
     que no están destinados a estar visibles para el jugador.
  */
  const resetInput = () => {
    const matrix = sudoku.map((row) =>
      row.map((num) => (num < 1 ? Number(num.toString().split(".")[1]) : ""))
    );
    setInput(matrix);
  };

  const onStartBtnClick = () => {
    if (["solved", "withdrew"].includes(status)) {
      createSudoku();
      setStatus(null);
    } else {
      setInput(getSudoku());
      setStatus("withdrew");
    }
  };

  const onRestartBtnClick = () => {
    resetInput();
    setStatus(`restarted-${Date.now()}`);
  };

  const onLevelChange = (event) => {
    setLevel(event.target.value);
  };

  useEffect(() => {
    createSudoku();
  }, []);

  useEffect(() => {
    if (sudoku) {
      // Crea o reinicia la matriz de las respuestas del jugador.
      resetInput();

      /* Crea el arreglo con las índices de las pistas del sudoku. En el sudoku,
         los números menores que uno (0.N) indican que son pistas.
         Reemplaza dichos valores por su índices. Los que son mayores o iguales
         que uno, los reemplaza con un valor nulo. Posteriormente, elimina los
         valores nulos del arreglo.
      */
      setClues(
        sudoku.map((row) =>
          row
            .map((num, col) => (num < 1 ? col : null))
            .filter((val) => val !== null)
        )
      );
    }
  }, [sudoku]);

  useEffect(() => {
    createSudoku();
    setStatus(null);
  }, [level]);

  useEffect(() => {
    if (sudoku && getSudoku().toString() === input.toString()) {
      setStatus("solved");
    }
  }, [input]);

  return (
    <div className="sudoku">
      <h1>Sudoku</h1>

      <div className="top">
        <p className={isSolved() ? "solved" : ""}>
          {isSolved() ? "¡Sudoku resuelto!" : "Sin resolver"}
        </p>
        <select onChange={onLevelChange}>
          {Object.keys(levels).map((key, i) => (
            <option value={key} key={i}>
              {levels[key]}
            </option>
          ))}
        </select>
      </div>

      <SudokuContext value={[sudoku, input, setInput, clues, status]}>
        {sudoku && input && clues && <SudokuGrid />}
      </SudokuContext>

      <div className="buttons">
        {!isSolved() && <button onClick={onRestartBtnClick}>Reiniciar</button>}
        <button onClick={onStartBtnClick}>
          {isSolved() ? "Jugar de nuevo" : "Resolver"}
        </button>
      </div>

      <div className="rules">
        <h2>Cómo se juega</h2>
        <ol>
          <li>
            Cada fila debe contener los números del 1 al 9, sin repeticiones.
          </li>
          <li>
            Cada columna debe contener los números del 1 al 9, sin repeticiones.
          </li>
          <li>
            Cada bloque de 3x3 debe contener los números del 1 al 9, sin
            repeticiones.
          </li>
          <li>
            Si la casilla del número ingresado aparece en rojo, es porque no
            cumple con ninguna de las condiciones mencionadas anteriormente.
          </li>
          <li>
            El juego se da por finalizado cuando el mensaje <i>Sin resolver</i>{" "}
            pasa a <i>Sudoku resuelto.</i>
          </li>
          <li>
            Puedes cambiar la dificultad de los sudokus al desplegar el menú
            ubicado en la parte superior derecha del mismo.
          </li>
          <li>
            El botón <i>Reiniciar</i> borra todo lo que ingresaste y el botón{" "}
            <i>Resolver</i> te muestra la solución del sudoku, dando por
            finalizado el juego.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Sudoku;
