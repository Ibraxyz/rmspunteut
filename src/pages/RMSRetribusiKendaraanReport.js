import React, { useState } from 'react';
import { Typography } from '@mui/material';
import RMSTFDLayout from '../components/RMSTFDLayout';
import RMSMonthlyFilter from '../components/RMSMonthlyFilter';
import { db } from '../';
import { where, doc, collection, getDocs, getDoc, query } from 'firebase/firestore';
import RMSFreeTable from '../components/RMSFreeTable';

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
        /** construct the header */
        const _header = [];
        /** construct the rows */
        if (bulan === null || tahun === null) {
            alert('Bulan dan tahun harus diisi');
            return;
        }
        try {
            const dailyReportDetail = {};
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
            dailyReportDetail["total"] = 0;
            const dailyReport = {}
            TEAM.forEach((team) => {
                dailyReport[team.name] = { ...dailyReportDetail }
                /** header */
                Object.keys(dailyReportDetail).forEach((d) => {
                    if (d !== 'total') {
                        _header.push(d);
                    }
                })
                _header.push(team.name);
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
                parsedReport[invoiceData.hari][invoiceData.team.name][invoiceData.biaya] = parseInt(parsedReport[invoiceData.hari][invoiceData.team.name][invoiceData.biaya]) + 1;
                parsedReport[invoiceData.hari][invoiceData.team.name]["total"] = parseInt(parsedReport[invoiceData.hari][invoiceData.team.name]["total"]) + parseInt(invoiceData.biaya);
            });
            //console.log(JSON.stringify(parsedReport));
            /** construct final rows */
            const _rows = [];
            Object.keys(parsedReport).forEach((key) => {
                const flat = [];
                Object.keys(parsedReport[key]).forEach((k) => {
                    Object.keys(parsedReport[key][k]).forEach((_k) => {
                        flat.push(parsedReport[key][k][_k]);
                    });
                })
                _rows.push(flat);
            })
            console.log(JSON.stringify(_header));
            console.log(JSON.stringify(_rows));
            setHeader(_header);
            setRows(_rows);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <RMSTFDLayout>
            <Typography>Laporan Retribusi Kendaraan Bulan {bulan} Tahun {tahun} </Typography>
            <RMSMonthlyFilter handleBulanChange={handleBulanChange} handleTahunChange={handleTahunChange} showData={showData} />
            <RMSFreeTable header={header} rows={rows} />
        </RMSTFDLayout>
    )
};

export default RMSRetribusiKendaraanReport;
