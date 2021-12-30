import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable(props) {
  const [total,setTotal] = useState(0);
  useEffect(()=>{
    let newTotal = 0;
    for(var i=0;i<props.rows.length;i++){
      newTotal += parseInt(props.rows[i].biaya);
    }
    setTotal(newTotal);
  },[])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell align="left">Nama Iuran</TableCell>
            <TableCell align="left">Biaya</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => {
            return (
              <TableRow
                key={index + 1}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="left">{row.jenis}</TableCell>
                <TableCell align="left">{row.biaya}</TableCell>
              </TableRow>
            )
          })}
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="left">{total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}