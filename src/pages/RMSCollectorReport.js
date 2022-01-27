import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Typography, Table, TableContainer, TableRow, TableHead, TableCell, TableBody, Button } from '@mui/material';
import { db } from '../';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { invoicesData } from '../mock-data';

/** this pages reporting transaction based on collectors who processed the payment */

const Filter = ({ showData }) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Typography vairant={'subtitle2'} >Filter</Typography>
      <Button variant={'contained'} onClick={showData}>Tampilkan Data</Button>
    </Box>
  )
}
/** total ikk kolektor1 tgl 1 bulan x tahun x */
const RMSBaseTable = ({ header, rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              header.map((h) => {
                return <TableCell key={'tableCellHeader-' + h} align="right">{h}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow
                key={row.tgl + '-collectopReport'}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {
                  header.map((h) => {
                    return (<TableCell key={h + 'tbody'} align="right">{row[h]}</TableCell>)
                  })
                }
              </TableRow>
            )
          })}
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
  const [collectorList, setCollectorList] = useState([]);
  /** define column header array */
  const columnHeader = [];
  /** define table rows data state */
  const [rows, setRows] = useState([]);
  /** add tgl as first element of the array */
  columnHeader.push("tgl");
  /** get kolektor list from db */
  useEffect(() => {
    const userQuery = collection(db, `user`);
    const conditions = [
      where('role', '==', 1)
    ]
    const getKolektorList = async () => {
      try {
        /** temp aray for holding cuurent collecctor list from db */
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
        columnHeader.push('total');
        columnHeader.push('aksi');
        setColumnHeaderState(columnHeader);
      } catch (err) {
        console.log(err.message);
      }
    }
    getKolektorList();
  }, []);

  /** get data */
  const getInvoiceData = async () => {
    try {
      /** { tgl: 1, kolektor1: 0, kolektor2: 0, kolektor3: 0, total: 0, aksi: "lihat detail" } */
      const _rows = {};
      const obj = {};
      collectorList.forEach((collector) => {
        obj[collector] = 0;
      })
      invoicesData.forEach((inv) => {
        _rows[inv.hari] = {
          "tgl": inv.hari,
          ...obj,
          "aksi": "lihat detail"
        };
        _rows[inv.hari][inv.kolektor.name] = parseInt(_rows[inv.hari][inv.kolektor.name]) + parseInt(inv.biaya);
      })
      console.log(JSON.stringify(_rows));
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <>
      <PageContent>
        <Filter showData={getInvoiceData} />
        <RMSBaseTable header={columnHeaderState} rows={rows} />
      </PageContent>
    </>
  );
}

export default RMSCollectorReport;
