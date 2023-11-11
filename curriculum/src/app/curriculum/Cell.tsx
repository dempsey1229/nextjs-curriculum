import { useRef, useEffect, ReactNode, MouseEventHandler } from 'react';

type CellPropsType = {
  disabled: boolean;
  beingSelected: boolean;
  selected: boolean;
  //   onTouchStart: (e: MouseEvent | TouchEvent) => void;
  onTouchStart: MouseEventHandler;
  //   onTouchMove: (e: MouseEvent | TouchEvent) => void;
  onTouchMove: MouseEventHandler;
  children: JSX.Element;
};

const Cell = ({
  disabled,
  beingSelected,
  selected,
  onTouchStart,
  onTouchMove,
  children,
  ...props
}: CellPropsType) => {
  const tdRef = useRef<HTMLTableCellElement>(null);
  useEffect(() => {
    const handleTouchStart = (e: any) => {
      console.log(disabled);
      if (!disabled) {
        onTouchStart(e);
      }
    };

    const handleTouchMove = (e: any) => {
      if (!disabled) {
        onTouchMove(e);
      }
    };
    // console.log('QQ');
    // console.log(tdRef.current);

    // window.addEventListener('touchstart', handleTouchStart);
    // window.addEventListener('touchmove', handleTouchMove);

    // return () => {
    //     window.removeEventListener('touchstart', handleTouchStart);
    //     window.removeEventListener('touchmove', handleTouchMove);
    // };
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
  if (beingSelected) {
    cellClassName += ' cell-being-selected';
  }
  //   console.log(tdRef.current);
  return (
    <td
      ref={tdRef}
      className={`cell ${cellClassName}`}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      {...props}
      //   style={{ width: 15 }}
    >
      {children || <span>&nbsp;</span>}
    </td>
  );
};

export default Cell;
