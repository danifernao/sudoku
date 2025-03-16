import { SudokuContext } from "./Sudoku";
import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function SudokuGridInput({ row, col, getSibling }) {
  const [_, input, setInput, clues, status] = useContext(SudokuContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef();

  const changeInput = (key = null) => {
    if (key) {
      const isNumber = /^[1-9]$/.test(key);
      if (key !== inputRef.current.value) {
        const array = Array.from(input);
        array[row][col] = isNumber ? Number(key) : "";
        setInput(array);
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
  };

  useEffect(() => {
    setIsDisabled(["solved", "withdrew"].includes(status));
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
