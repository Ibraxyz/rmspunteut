import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Typography, Button, TextField, Stack } from '@mui/material';
import { db } from '../';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
//import { invoicesData } from '../mock-data';
import { formatRupiah } from '../rms-utility/rms-utility';
import RMSBaseTable from '../components/RMSBaseTable';
import RMSMonthlyFilter from '../components/RMSMonthlyFilter';
/** this pages reporting transaction based on collectors who processed the payment */

const PageContent = ({ children }) => {
  const [title, filter, table] = children;
  return (
    <Paper>
      {/** title */}
      <Box sx={{ padding: '10px' }}>
        {title}
      </Box>
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
  /** table column header : tgl, kolektor1 , kolektor2, kolektor3, ... ,total  */
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
        /** temp aray for holding cuurent collector list from db */
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
        setColumnHeaderState(columnHeader);
      } catch (err) {
        console.log(err.message);
      }
    }
    getKolektorList();
  }, []);

  /** get data */
  const getInvoiceData = async () => {
    if (bulan === null || bulan === "" || tahun === null || tahun === "") {
      alert('Mohon isi bulan dan tahun');
      return;
    }
    try {
      /** { tgl: 1, kolektor1: 0, kolektor2: 0, kolektor3: 0, total: 0, aksi: "lihat detail" } */
      //get invoices data from the db
      const ref = collection(db, `invoice`);
      const conditions = [
        where('bulan', '==', parseInt(bulan)),
        where('tahun', '==', parseInt(tahun)),
        where('status-invoice', '==', true),
        where('kategori', '==', 'bulanan')
      ];
      const invoicesDataRaw = await getDocs(query(ref, ...conditions));
      const invoicesData = [];
      invoicesDataRaw.forEach((doc) => {
        invoicesData.push({
          "id": doc.id,
          ...doc.data()
        })
      });
      console.log(JSON.stringify(invoicesData))
      const _rows = {};
      const collectorTotalObj = {}; /** this is holder for collector achievement e.g : {"k1":10,"k2":20,"k3":30}  */
      collectorList.forEach((collector) => {
        collectorTotalObj[collector] = 0; /** at first we init each collector achievement to 0 */
      })
      const collectorTotalDaily = {}; /** this object hold daily collector;s achievement */
      for (let i = 1; i <= 31; i++) {
        collectorTotalDaily[i] = { ...collectorTotalObj }; /** init all dates , so after this process, this object will contain dates field, which each field is contain collectorTotalObj */
      }
      const collectorMonthlyTotal = { ...collectorTotalObj }; /** this holds per collector monthly total per month */
      for (let i = 0; i < invoicesData.length; i++) { /** iterate over invoice data to get all the needs */
        if (!isNaN(parseInt((invoicesData[i].biaya)))) {
          collectorTotalDaily[invoicesData[i].hari][invoicesData[i].kolektor.name] = parseInt(collectorTotalDaily[invoicesData[i].hari][invoicesData[i].kolektor.name]) + parseInt(invoicesData[i].biaya);
          let total = 0;
          Object.keys(collectorTotalDaily[invoicesData[i].hari]).forEach((key) => {
            total += parseInt(collectorTotalDaily[invoicesData[i].hari][key]);
          })
          collectorMonthlyTotal[invoicesData[i].kolektor.name] = parseInt(collectorMonthlyTotal[invoicesData[i].kolektor.name]) + parseInt(invoicesData[i].biaya);
          const rupiahVersion = {};
          Object.keys((collectorTotalDaily[invoicesData[i].hari])).forEach((key) => {
            rupiahVersion[key] = formatRupiah(collectorTotalDaily[invoicesData[i].hari][key])
          })
          _rows[invoicesData[i].hari] = {
            "tgl": invoicesData[i].hari,
            ...rupiahVersion,
            "total": formatRupiah(total),
          }
        }
      }
      console.log(JSON.stringify(_rows));
      console.log(JSON.stringify(collectorMonthlyTotal));
      let readyRows = [];
      Object.keys(_rows).forEach((key) => {
        readyRows.push(_rows[key]);
      })
      let grandTotal = 0;
      Object.keys(collectorMonthlyTotal).forEach((key) => {
        grandTotal += collectorMonthlyTotal[key];
      })
      /** format rupiah : collectorMonthlyTotal */
      Object.keys(collectorMonthlyTotal).forEach((key) => {
        collectorMonthlyTotal[key] = formatRupiah(collectorMonthlyTotal[key]);
      })
      readyRows.push({
        "tgl": "Total",
        ...collectorMonthlyTotal,
        "total": formatRupiah(grandTotal),
        "aksi": "-"
      });
      setRows(readyRows);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <PageContent>
        <Typography variant='subtitle2'>Laporan IKK per kolektor bulan {bulan} tahun {tahun} </Typography>
        <RMSMonthlyFilter showData={getInvoiceData} handleBulanChange={(e) => setBulan(e.target.value)} handleTahunChange={(e) => setTahun(e.target.value)} />
        <RMSBaseTable header={columnHeaderState} rows={rows} />
      </PageContent>
    </>
  );
}

export default RMSCollectorReport;
