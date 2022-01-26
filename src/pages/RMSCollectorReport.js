import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Typography, Table, TableContainer, TableRow, TableHead, TableCell, TableBody } from '@mui/material';
import { db } from '../';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';

/** this pages reporting transaction based on collectors who processed the payment */

const Filter = () => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Typography vairant={'subtitle2'} >Filter</Typography>
    </Box>
  )
}
/** total ikk kolektor1 tgl 1 bulan x tahun x */
const RMSBaseTable = ({ header }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              header.map((h) => {
                return <TableCell key={'tableCellHeader-'+h} align="right">{h}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {/**
           * {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
           */}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const PageContent = ({ children }) => {
  const [filter, table] = children;
  return (
    <Paper>
      {/** filter */}
      <Box sx={{ padding: '10px' }}>
        {filter}
      </Box>
      <Divider />
      {/** table */}
      <Box sx={{ padding: '10px' }}>
        {table}
      </Box>
    </Paper>
  )
}

function RMSCollectorReport() {
  /** table column header : tgl, kolektor1 , kolektor2, kolektor3, total  */
  /** define current active filter */
  const [bulan, setBulan] = useState(null);
  const [tahun, setTahun] = useState(null);
  /** define current columnHeader state */;
  const [columnHeaderState, setColumnHeaderState] = useState([]);
  /** hold collector list state */
  const [collectorList,setCollectorList] = useState([]);
  /** define column header array */
  const columnHeader = [];
  /** add tgl as first element of the array */
  columnHeader.push("TGL");
  /** get kolektor list from db */
  useEffect(() => {
    const userQuery = collection(db, `user`);
    const conditions = [
      where('role', '==', 1)
    ]
    const getKolektorList = async () => {
      try {
        /** temp aray fro holding cuurent collecctor list from db */
        const currentCollectorList = [];
        const userCollection = await getDocs(query(userQuery, ...conditions));
        userCollection.forEach((doc) => {
          console.log(JSON.stringify(doc.data()))
          const docData = doc.data();
          /** push kolektors name and id to the columnHeader array */
          columnHeader.push(`${docData["name"]}`);
          currentCollectorList.push(docData["name"]);
        });
        /** update current collector list state */
        setCollectorList(currentCollectorList);
        /** finally, add total as the last element of the columnHeader array */
        columnHeader.push('TOTAL');
        columnHeader.push('AKSI');
        setColumnHeaderState(columnHeader);
      } catch (err) {
        console.log(err.message);
      }
    }
    getKolektorList();
  }, []);
  /** get data  */
  const getInvoiceData = async () => {
    /** prevent processing data if data === null */
    if (bulan === null || tahun === null) {
      alert('Mohon pilih bulan dan tahun');
      return;
    }
    /** holder for invoice data */

    /** get invoices data */
    try {
      const invoicesData = await getDocs(query(collection(db, `invoice`), where('bulan', '==', bulan), where('tahun', '==', tahun)));
      invoicesData.forEach((doc) => {
        
      })
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <>
      <PageContent>
        <Filter />
        <RMSBaseTable header={columnHeaderState} />
      </PageContent>
    </>
  );
}

export default RMSCollectorReport;
