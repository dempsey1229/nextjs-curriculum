import { useRef, useEffect, ReactNode, MouseEventHandler } from 'react';

type CellPropsType = {
  disabled: boolean;
  beingSelected: boolean;
  selected: boolean;
  onTouchStart: MouseEventHandler;
  onTouchMove: MouseEventHandler;
  children: JSX.Element;
  addMode: boolean;
};

const Cell = ({
  disabled,
  beingSelected,
  selected,
  onTouchStart,
  onTouchMove,
  children,
  addMode,
  ...props
}: CellPropsType) => {
  const tdRef = useRef<HTMLTableCellElement>(null);
  useEffect(() => {
    const handleTouchStart = (e: any) => {
      if (!disabled) {
        onTouchStart(e);
      }
    };

    const handleTouchMove = (e: any) => {
      if (!disabled) {
        onTouchMove(e);
      }
    };
    if (tdRef.current) {
      //   debugger;
      tdRef.current.addEventListener('touchstart', handleTouchStart);
      tdRef.current.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (tdRef.current) {
        tdRef.current.removeEventListener('touchstart', handleTouchStart);
        tdRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [disabled, onTouchStart, onTouchMove]);

  let cellClassName = disabled ? 'cell-disabled' : 'cell-enabled';
  if (selected) {
    cellClassName += ' cell-selected';
  }
  if (beingSelected && addMode) {
    cellClassName += ' cell-being-selected-select';
  }
  if (beingSelected && !addMode) {
    cellClassName += ' cell-being-selected-cancel';
  }
  //   console.log(tdRef.current);
  return (
    <td
      ref={tdRef}
      className={`cell ${cellClassName}`}
      onMouseDown={!disabled ? onTouchStart : undefined}
      onMouseMove={!disabled ? onTouchMove : undefined}
      {...props}
    >
      {children || <span>&nbsp;</span>}
    </td>
  );
};

export default Cell;
