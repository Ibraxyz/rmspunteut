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
        setBulan(e.target.value)
    }
    const handleTahunChange = (e) => {
        setTahun(e.target.value)
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
            console.log(JSON.stringify(brk.data()))
            const brkData = brk.data().biaya;
            const biayaList = [];
            Object.keys(brkData).forEach((key) => {
                biayaList.push(brkData[key]);
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
            /** process the invoices **/
            const ref = collection(db, `invoice`);
            const conditions = [
                where('bulan', '==', bulan),
                where('tahun', '==', tahun),
                where('kategori', '==', 'retribusi'),
            ]
            const invoices = await getDocs(query(ref, ...conditions))
            invoices.forEach((invoice) => {
                report[invoice.hari][invoice.team.name][invoice.biaya] = parseInt(report[invoice.hari][invoice.team.name][invoice.biaya]) + 1;
                report[invoice.hari][invoice.team.name]["total"] = parseInt(report[invoice.hari][invoice.team.name]["total"]) + parseInt(report[invoice.hari][invoice.team.name][invoice.biaya])
            })
            console.log(JSON.stringify(report));
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
