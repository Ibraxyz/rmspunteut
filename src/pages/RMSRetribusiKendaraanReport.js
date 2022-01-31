import React, { useState } from 'react';
import { Typography } from '@mui/material';
import RMSTFDLayout from '../components/RMSTFDLayout';
import RMSMonthlyFilter from '../components/RMSMonthlyFilter';
import RMSBaseTable from '../components/RMSBaseTable';
import { db } from '../';
import { where, doc, collection, getDocs, getDoc, query } from 'firebase/firestore';

const RMSRetribusiKendaraanReport = () => {
    const [bulan, setBulan] = useState(null);
    const [tahun, setTahun] = useState(null);
    const [header, setHeader] = useState([]);
    const [rows, setRows] = useState([]);
    const handleBulanChange = (e) => {
        setBulan(e.target.value);
        console.log(e.target.value);
    }
    const handleTahunChange = (e) => {
        setTahun(e.target.value)
        console.log(e.target.value);
    }
    const showData = async () => {
        // rows => TGL TEAM I 5R 10R 15R TEAM II 5R 10R 15R TEAM III 5R 10R 15R TOTAL
        if (bulan === null || tahun === null) {
            alert('Bulan dan tahun harus diisi');
            return;
        }
        try {
            const dailyReportDetail = {
                "total": 0,
            };
            const brk = await getDoc(doc(db, 'brk/brk1'));
            const brkData = brk.data().biaya;
            Object.keys(brkData).forEach((key) => {
                dailyReportDetail[brkData[key]] = 0;
            })
            const TEAM = [
                {
                    "name": "TEAM_I",
                    "value": 1,
                },
                {
                    "name": "TEAM_II",
                    "value": 2,
                },
                {
                    "name": "TEAM_III",
                    "value": 3,
                }
            ]
            const dailyReport = {}
            TEAM.forEach((team) => {
                dailyReport[team.name] = { ...dailyReportDetail }
            })
            const report = {};
            for (let i = 1; i <= 31; i++) {
                report[i] = { ...dailyReport }
            }
            const reportString = JSON.stringify(report);
            const parsedReport = JSON.parse(reportString);
            /** process the invoices **/
            const ref = collection(db, `invoice`);
            const conditions = [
                where('bulan', '==', parseInt(bulan)),
                where('tahun', '==', parseInt(tahun)),
                where('kategori', '==', 'retribusi'),
            ]
            const invoices = await getDocs(query(ref, ...conditions));
            invoices.forEach((invoice) => {
                const invoiceData = invoice.data();
                console.log('invoiceData.team.name', invoiceData.team.name);
                parsedReport[invoiceData.hari][invoiceData.team.name][invoiceData.biaya] = parseInt(parsedReport[invoiceData.hari][invoiceData.team.name][invoiceData.biaya]) + 1;
            })
            console.log(JSON.stringify(parsedReport));
            /** construct final rows 
            const _rows = [];
            Object.keys(report).forEach((key) => {
                _rows.push();
            }) */
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <RMSTFDLayout>
            <Typography>Laporan Retribusi Kendaraan Bulan {bulan} Tahun {tahun} </Typography>
            <RMSMonthlyFilter handleBulanChange={handleBulanChange} handleTahunChange={handleTahunChange} showData={showData} />
            <RMSBaseTable header={header} rows={rows} />
        </RMSTFDLayout>
    )
};

export default RMSRetribusiKendaraanReport;
