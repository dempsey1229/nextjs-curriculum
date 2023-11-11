'use client';
import { FormControlLabel, Switch } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import TableDragSelect from './TableDragSelect';

const Curriculum = () => {
  const router = useRouter();
  const pathName = usePathname();
  const timeSlot = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'X',
    'A',
    'B',
    'C',
    'D',
  ];
  const [cells, setCells] = useState(
    Array.from({ length: 15 }, (e) => Array(7).fill(false))
  );
  const [checked, setChecked] = useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  function getSelectedCellInfo() {
    // return cell's row and column if its value is true
    const selectedCell = cells.flatMap((row, rowIndex) =>
      row
        .map((cell, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          value: cell,
        }))
        .filter((cell) => cell.value)
    );
    const selectedCellString = selectedCell.reduce((accu, curr, idx) => {
      return accu + `{${curr.row}-${curr.col}},`;
    }, '');
    return selectedCellString;
  }

  useEffect(() => {
    const selectedCell = cells.flatMap((row, rowIndex) =>
      row
        .map((cell, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          value: cell,
        }))
        .filter((cell) => cell.value)
    );
    const selectedCellString = selectedCell.reduce((accu, curr, idx) => {
      return accu + `{${curr.row}-${curr.col}},`;
    }, '');

    router.push(
      `${pathName}${
        selectedCellString === '' ? '' : '?selectedCells='
      }${selectedCellString}`
    );
  }, [cells, pathName, router]);

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
        color: 'black',
        minWidth: '700px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <FormControlLabel
          value="start"
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label={checked ? 'Select Mode' : 'Cancel Mode'}
          labelPlacement="end"
        />
      </div>
      <div className="tableContainer">
        <div> 已選時段：{getSelectedCellInfo()}</div>

        <TableDragSelect value={cells} onChange={setCells} addMode={checked}>
          <tr>
            <td className="cell-disabled" />
            <td className="cell-disabled">Mon</td>
            <td className="cell-disabled">Tue</td>
            <td className="cell-disabled">Wed</td>
            <td className="cell-disabled">Thu</td>
            <td className="cell-disabled">Fri</td>
            <td className="cell-disabled">Sat</td>
          </tr>

          {Array(14)
            .fill(null)
            .map((_, row) => {
              return (
                <tr key={`tr-${row}`}>
                  {Array(7)
                    .fill(null)
                    .map((__, col) => {
                      if (col === 0) {
                        return (
                          <td key={`td-${col}`} className="cell-disabled">
                            {timeSlot[row]}
                          </td>
                        );
                      } else return <td key={`td-${col}`} />;
                    })}
                </tr>
              );
            })}
        </TableDragSelect>
      </div>
    </div>
  );
};
export default Curriculum;
