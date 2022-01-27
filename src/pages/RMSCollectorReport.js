import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Typography, Table, TableContainer, TableRow, TableHead, TableCell, TableBody, Button } from '@mui/material';
import { db } from '../';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';

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
  /** get data  */
  const getInvoiceData = async () => {
    /** prevent processing data if data === null 
    if (bulan === null || tahun === null) {
      alert('Mohon pilih bulan dan tahun');
      return;
    }
    */
    /** holder for invoice data */

    /** get invoices data */
    try {
      //const invoicesData = await getDocs(query(collection(db, `invoice`), where('bulan', '==', 1), where('tahun', '==', 2022),  where('status', '==', true)));
      /** after below forEach iteration, the desired data format will be like this :
       * const rows = [
       * {"tgl" : "1",kolektor1 : totalKolektor1,kolektor2 : totalKolektor2,total : totalSeluruhKolektorPadaTgl1,aksi : lihat detail},
       * {"tgl" : "2",kolektor1 : totalKolektor1,kolektor2 : totalKolektor2,total : totalSeluruhKolektorPadaTgl2,aksi : lihat detail},
       * {"tgl" : "3",kolektor1 : totalKolektor1,kolektor2 : totalKolektor2,total : totalSeluruhKolektorPadaTgl3,aksi : lihat detail},
       * ]
       */
      const _rows = [];

      for (var idx = 1; idx <= 31; idx++) {
        const obj = {
          "tgl": idx,
        }

        collectorList.forEach((name) => {
          const total = 0;
          /** we will iterate through invoices obj and extract the total for this collector out of it. */
          obj[name] = total;
        })

        obj["total"] = 0;
        obj["aksi"] = 'Lihat Detail';

        _rows.push(obj);
      }

      setRows(_rows);

      /** check rows object before putting it to the state */
      console.log('Check rows data', JSON.stringify(_rows));
    } catch (err) {
      console.log(err.message);
    }
  }

  /** get data ver2 */
  const getInvoiceData2 = async () => {
    try {
      const invoicesData = await getDocs(query(collection(db, `invoice`), where('bulan', '==', 1), where('tahun', '==', 2022)));
      const _invoicesData = [];
      invoicesData.forEach((doc) => {
        _invoicesData.push({
          id: doc.id,
          ...doc.data()
        })
      });
      console.log('_invoiceeData',JSON.stringify(_invoicesData));
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <>
      <PageContent>
        <Filter showData={getInvoiceData2} />
        <RMSBaseTable header={columnHeaderState} rows={rows} />
      </PageContent>
    </>
  );
}

export default RMSCollectorReport;
