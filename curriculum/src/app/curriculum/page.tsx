'use client';
import { useState } from 'react';
import TableDragSelect from './TableDragSelect';
import React from 'react';
import { Typography, Switch, FormControlLabel } from '@mui/material';

const Curriculum = () => {
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

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', color: 'black' }}>
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
          // labelPlacement={checked ? 'end' : 'start'}
          labelPlacement="end"
        />
      </div>
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
  );
};
export default Curriculum;
