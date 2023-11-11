'use client';
import { Children, useEffect, useState } from 'react';
import _ from 'lodash';
import React from 'react';
import Cell from './Cell';

type TableDragSelectProps = {
  children: React.ReactNode;
  value: boolean[][];
  onChange: (newState: any) => void;
  addMode: boolean;
};

const TableDragSelect = ({
  children,
  value,
  onChange,
  addMode,
}: TableDragSelectProps) => {
  const [selectionState, setSelectionState] = useState<{
    selectionStarted: boolean;
    startRow: number | null;
    startColumn: number | null;
    endRow: number | null;
    endColumn: number | null;
    addMode: boolean;
  }>({
    selectionStarted: false,
    startRow: null,
    startColumn: null,
    endRow: null,
    endColumn: null,
    addMode,
  });

  useEffect(() => {
    const handleTouchEndWindow = (e: any) => {
      const isLeftClick = e.button === 0;
      const isTouch = e.type !== 'mousedown';
      if (selectionState.selectionStarted && (isLeftClick || isTouch)) {
        // console.log(selectionState);
        const updatedValue = _.cloneDeep(value);
        const minRow = Math.min(
          selectionState.startRow || 0,
          selectionState.endRow || 0
        );
        const maxRow = Math.max(
          selectionState.startRow || 0,
          selectionState.endRow || 0
        );

        for (let row = minRow; row <= maxRow; row++) {
          const minColumn = Math.min(
            selectionState.startColumn || 0,
            selectionState.endColumn || 0
          );
          const maxColumn = Math.max(
            selectionState.startColumn || 0,
            selectionState.endColumn || 0
          );

          for (let column = minColumn; column <= maxColumn; column++) {
            updatedValue[row][column] = selectionState.addMode;
          }
        }

        setSelectionState((prev) => ({ ...prev, selectionStarted: false }));
        onChange(updatedValue);
      }
    };

    window.addEventListener('mouseup', handleTouchEndWindow);
    window.addEventListener('touchend', handleTouchEndWindow);

    return () => {
      window.removeEventListener('mouseup', handleTouchEndWindow);
      window.removeEventListener('touchend', handleTouchEndWindow);
    };
  }, [
    onChange,
    selectionState,
    selectionState.addMode,
    selectionState.endColumn,
    selectionState.endRow,
    selectionState.selectionStarted,
    selectionState.startColumn,
    selectionState.startRow,
    value,
  ]);

  const handleTouchStartCell = (e: MouseEvent | TouchEvent) => {
    const isLeftClick = 'button' in e ? e.button === 0 : true;
    const isTouch = e.type !== 'mousedown';
    if (!selectionState.selectionStarted && (isLeftClick || isTouch)) {
      e.preventDefault();
      const { row, column } = eventToCellLocation(e);
      setSelectionState({
        selectionStarted: true,
        startRow: row,
        startColumn: column,
        endRow: row,
        endColumn: column,
        addMode: addMode,
      });
    }
  };
  const handleTouchMoveCell = (e: MouseEvent | TouchEvent) => {
    const isTouch = e.type === 'touchmove';
    if (selectionState.selectionStarted) {
      e.preventDefault();
      // 邊緣滾動
      const x = isTouch
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      const y = isTouch
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;
      console.log(x, y);

      const threshold = 100;
      const container = document.getElementsByClassName('tableContainer')[0];
      if (container) {
        const containerRect = container.getBoundingClientRect();
        console.log(
          containerRect.top,
          containerRect.left,
          containerRect.bottom,
          containerRect.right
        );

        // Check if pointer is too close to the left edge
        if (x - containerRect.left < threshold) {
          container.scrollTo({
            left: container.scrollLeft - 10,
            behavior: 'auto',
          });
        }
        // Check if pointer is too close to the right edge
        else if (containerRect.right - x < threshold) {
          container.scrollTo({
            left: container.scrollLeft + 10,
            behavior: 'auto',
          });
        }

        // Check if pointer is too close to the top edge
        if (y - containerRect.top < threshold) {
          container.scrollTo({
            top: container.scrollTop - 10,
            behavior: 'auto',
          });
        }
        // Check if pointer is too close to the bottom edge
        else if (containerRect.bottom - y < threshold) {
          container.scrollTo({
            top: container.scrollTop + 10,
            behavior: 'auto',
          });
        }
      }

      const { row, column } = eventToCellLocation(e);
      if (row <= 0 || column <= 0) return;
      const { startRow, startColumn, endRow, endColumn } = selectionState;

      if (endRow !== row || endColumn !== column) {
        setSelectionState((prevState) => ({
          ...prevState,
          endRow: row,
          endColumn: column,
        }));
      }
    }
  };

  const eventToCellLocation = (e: MouseEvent | TouchEvent) => {
    let target;
    if ('touches' in e) {
      const touch = e.touches[0];
      target = document.elementFromPoint(touch.clientX, touch.clientY);
    } else {
      target = e.target as Node;
      while (target && target.nodeName !== 'TD') {
        target = target.parentNode;
      }
    }
    const index = {
      row:
        ((target as HTMLTableCellElement)?.parentNode as HTMLTableRowElement)
          ?.rowIndex ?? 0,
      column: (target as HTMLTableCellElement)?.cellIndex ?? 0,
    };
    // console.log(index);
    return index;
  };

  const isCellBeingSelected = (row: number, column: number) => {
    const minRow = Math.min(
      selectionState.startRow as number,
      selectionState.endRow as number
    );
    const maxRow = Math.max(
      selectionState.startRow as number,
      selectionState.endRow as number
    );
    const minColumn = Math.min(
      selectionState.startColumn as number,
      selectionState.endColumn as number
    );
    const maxColumn = Math.max(
      selectionState.startColumn as number,
      selectionState.endColumn as number
    );
    // console.log(selectionState);
    return (
      selectionState.selectionStarted &&
      row >= minRow &&
      row <= maxRow &&
      column >= minColumn &&
      column <= maxColumn
    );
  };

  const renderRows = () => {
    return Children.map(children, (tr, i) => {
      if (!React.isValidElement(tr)) return null;
      return (
        <tr key={i} {...tr.props}>
          {Children.map(tr.props.children, (cell, j) => (
            <Cell
              key={j}
              disabled={i === 0 || j === 0}
              onTouchStart={handleTouchStartCell}
              onTouchMove={handleTouchMoveCell}
              selected={value[i][j]}
              beingSelected={isCellBeingSelected(i, j)}
              {...cell.props}
            >
              {cell.props.children}
            </Cell>
          ))}
        </tr>
      );
    });
  };

  return (
    <table className="table-drag-select">
      <tbody
        style={{
          display: 'block',
          //   minWidth: '600px',
          //   overflow: 'scroll',
        }}
      >
        {renderRows()}
      </tbody>
    </table>
  );
};
export default TableDragSelect;
