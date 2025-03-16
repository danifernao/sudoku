import { SudokuContext } from "./Sudoku";
import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function SudokuGridInput({ row, col, getSibling }) {
  const [_, input, setInput, clues, status] = useContext(SudokuContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef();

  const isValid = (array) => {
    if (array[row][col] === "") {
      return true;
    }

    // Verifica que el valor ingresado no esté repetido en la columna de la celda.
    for (let i = 0; i < array.length; i++) {
      if (i !== row && array[i][col] === array[row][col]) {
        return false;
      }
    }

    // Verifica que el valor ingresado no esté repetido en la fila de la celda.
    for (let i = 0; i < array.length; i++) {
      if (i !== col && array[row][i] === array[row][col]) {
        return false;
      }
    }

    // Verifica que el valor ingresado no esté repetido en el bloque 3x3 de la celda.
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let i = blockRow; i < blockRow + 3; i++) {
      for (let j = blockCol; j < blockCol + 3; j++) {
        if (!(i === row && j === col) && array[i][j] === array[row][col]) {
          return false;
        }
      }
    }

    return true;
  };

  const changeInput = (key = null) => {
    if (key) {
      const isNumber = /^[1-9]$/.test(key);
      if (key !== inputRef.current.value) {
        const array = Array.from(input);
        const value = isNumber ? Number(key) : "";
        array[row][col] = value;
        setInput(array);
        inputRef.current.classList.toggle("invalid", !isValid(array));
      }
      if (isNumber) {
        const sibling = getSibling(null, row + 1, col + 1);
        sibling.focus();
      }
    }
  };

  const onKeyDown = (event) => {
    const isNumber = /^[1-9]$/.test(event.key);
    if (["Backspace", "Delete"].includes(event.key) || isNumber) {
      changeInput(event.key);
    }
    event.preventDefault();
  };

  useEffect(() => {
    setIsDisabled(["solved", "withdrew"].includes(status));
    if (status && status.match(/^(solved|withdrew|restarted)/)) {
      inputRef.current.classList.remove("invalid");
    }
  }, [status]);

  useEffect(() => {
    setIsVisible(clues[row].includes(col));
  }, [clues]);

  return (
    <input
      type="number"
      className={`number-input ${isVisible ? "clue" : ""}`}
      data-row={row + 1}
      data-col={col + 1}
      disabled={isVisible || isDisabled}
      value={input[row][col]}
      onChange={() => null}
      onKeyDown={onKeyDown}
      ref={inputRef}
    />
  );
}

SudokuGridInput.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  getSibling: PropTypes.func,
};

export default SudokuGridInput;
