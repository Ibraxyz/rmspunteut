import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Typography } from '@mui/material';
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

const Table = ({ header }) => {
  return (
    <div>
      {
        header.map((h) => {
          return (
            <h3 key={'header-' + h}>{h}</h3>
          )
        })
      }
    </div>
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
        const userCollection = await getDocs(query(userQuery, ...conditions));
        userCollection.forEach((doc) => {
          console.log(JSON.stringify(doc.data()))
          const docData = doc.data();
          /** push kolektors name and id to the columnHeader array */
          columnHeader.push(`${docData["name"]} (${docData["uid"]})`);
        });
        /** finally, add total as the last element of the columnHeader array */
        columnHeader.push('TOTAL');
        columnHeader.push('AKSI');
        setColumnHeaderState(columnHeader);
      } catch (err) {
        console.log(err.message);
      }
    }
    getKolektorList();
  }, [])
  return (
    <>
      <PageContent>
        <Filter />
        <Table header={columnHeaderState} />
      </PageContent>
    </>
  );
}

export default RMSCollectorReport;
