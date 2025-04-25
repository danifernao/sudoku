import SudokuGridInput from "./SudokuGridInput";
import { useEffect, useRef } from "react";

function SudokuGrid({ grid }: { grid: number[][] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  const getSibling = (
    key: string | null,
    dataRow: number,
    dataCol: number
  ): HTMLInputElement => {
    let row = Number(dataRow);
    let col = Number(dataCol);
    let elem = null;

    do {
      switch (key) {
        case "ArrowUp":
          col = row === 1 ? (col === 1 ? 9 : col - 1) : col;
          row = row === 1 ? 9 : row - 1;
          break;
        case "ArrowDown":
          col = row === 9 ? (col === 9 ? 1 : col + 1) : col;
          row = row === 9 ? 1 : row + 1;
          break;
        case "ArrowLeft":
          row = col === 1 ? (row === 1 ? 9 : row - 1) : row;
          col = col === 1 ? 9 : col - 1;
          break;
        default:
          row = col === 9 ? (row === 9 ? 1 : row + 1) : row;
          col = col === 9 ? 1 : col + 1;
          break;
      }

      elem = gridRef.current!.querySelector(
        `[data-row~="${row}"][data-col~="${col}"]`
      ) as HTMLInputElement;
    } while (elem.disabled);

    return elem;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      const elem = document.activeElement as HTMLElement;
      if (
        elem.nodeName === "INPUT" &&
        elem.classList.contains("number-input")
      ) {
        let row = Number(elem.dataset.row);
        let col = Number(elem.dataset.col);
        const sibling = getSibling(event.key, row, col) as HTMLElement;
        sibling.focus();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="grid" ref={gridRef}>
      {grid.map((row, i) => {
        return row.map((_, j) => (
          <div className="cell" key={j}>
            <SudokuGridInput row={i} col={j} getSibling={getSibling} />
          </div>
        ));
      })}
    </div>
  );
}

export default SudokuGrid;
