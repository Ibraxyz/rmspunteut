import React from 'react';
import { Paper, Divider, } from '@mui/material';

const Filter = ({ header }) => {
  return (
    <div>
      {
        header.map((h) => {
          return (
            <h3>{h}</h3>
          )
        })
      }
    </div>
  )
}

function RMSCollectorReport() {
  return (
    <div>
      {/** filter bulan tahun hari */}
      <Filter header={["Kolektor1", "Kolektor2", "Kolektor3"]} />
      {/** tampilan table  */}
    </div>
  );
}

export default RMSCollectorReport;
