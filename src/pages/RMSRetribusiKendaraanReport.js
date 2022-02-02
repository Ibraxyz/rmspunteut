import React, { useState } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import RMSTFDLayout from '../components/RMSTFDLayout';
import RMSMonthlyFilter from '../components/RMSMonthlyFilter';
import { db } from '../';
import { where, doc, collection, getDocs, getDoc, query } from 'firebase/firestore';
import RMSFreeTable from '../components/RMSFreeTable';
import { formatRupiah } from '../rms-utility/rms-utility';

const RMSRetribusiKendaraanReport = () => {
    const [bulan, setBulan] = useState(null);
    const [tahun, setTahun] = useState(null);
    const [header, setHeader] = useState([]);
    const [rows, setRows] = useState([]);
    const [teamFeeRows, setTeamFeeRows] = useState([]);
    const [nominalTotalRows, setNominalTotalRows] = useState([]);
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
        /** construct nominal total */
        const _nominalTotal = {};
        /** construct the grand total */
        const grandTotal = {};
        grandTotal["TGL"] = 0;
        /** construct the header */
        const _header = ["TGL"];
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
                _nominalTotal[brkData[key]] = 0; /** nominal total rows */
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
                /** grand total preps */
                Object.keys(dailyReportDetail).forEach((dkey) => {
                    grandTotal[`${team.name}_${dkey}`] = 0;
                })
                /** header */
                Object.keys(dailyReportDetail).forEach((d) => {
                    if (d !== 'total') {
                        _header.push(d);
                    }
                })
                _header.push(team.name);
            })
            _header.push("TOTAL");
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
                _nominalTotal[invoiceData.biaya] += 1;
            });
            grandTotal["grandTotal"] = 0;
            //console.log(JSON.stringify(parsedReport));
            /** construct final rows */
            const _rows = [];
            Object.keys(parsedReport).forEach((key) => {
                const flat = [];
                flat.push(key); //day column value [TGL]
                /** row total */
                let rowTotal = 0;
                Object.keys(parsedReport[key]).forEach((k) => {
                    Object.keys(parsedReport[key][k]).forEach((_k) => {
                        flat.push(parsedReport[key][k][_k]);
                        if (_k === 'total') {
                            rowTotal += parsedReport[key][k][_k];
                            grandTotal[`grandTotal`] += parsedReport[key][k][_k];
                        }
                        /** grand total */
                        grandTotal[`${k}_${[_k]}`] += parsedReport[key][k][_k];
                    });
                })
                console.log('row total', rowTotal);
                flat.push(rowTotal); //total in particular date
                _rows.push(flat);
            })
            console.log(JSON.stringify(_header));
            /** remove all the thouzand decimal from nominal column name in the header and replace with R*/
            const zeroFreeHeader = _header.map((_h) => {
                let num = parseInt(_h)
                if (!isNaN(num)) {
                    num = num / 1000 + 'R';
                    _h = num;
                }
                return _h;
            })
            setHeader(zeroFreeHeader);
            console.log('grand total', JSON.stringify(grandTotal));
            /** remove all the zeros valued cell on rows */
            const zeroFreeRows = _rows.map((row) => {
                return row.map((r) => {
                    if (r === 0) {
                        r = "";
                    }
                    return formatRupiah(r);
                })
            })
            const flattedGrandTotal = [];
            Object.keys(grandTotal).forEach((key) => {
                flattedGrandTotal.push(formatRupiah(grandTotal[key]));
            })
            /** replace all the zero elements from flattened grand total with white spaces : this is used to avoid displaying zero at the bottom of the table (TGL column) */
            flattedGrandTotal[0] = "";
            zeroFreeRows.push(flattedGrandTotal);
            setRows(zeroFreeRows);
            /** construct the team fee */
            const _totalFeeRows = {};
            let totalTFR = 0;
            TEAM.forEach((t) => {
                console.log('vinspect', grandTotal[`${t.name}_total`]);
                totalTFR += grandTotal[`${t.name}_total`] / 10;
                _totalFeeRows[`${t.name}`] = formatRupiah(grandTotal[`${t.name}_total`] / 10);
            });
            console.log(JSON.stringify(_totalFeeRows));
            const totalFeeRowsArr = [];
            Object.keys(_totalFeeRows).forEach((key) => {
                totalFeeRowsArr.push([key, _totalFeeRows[key]]);
            })
            /** add total to team fee rows */
            totalFeeRowsArr.push(["TOTAL", formatRupiah(totalTFR)])
            setTeamFeeRows(totalFeeRowsArr);
            console.log(JSON.stringify(_nominalTotal));
            /** convert _nominalTotal Object into a 2D Array */
            const nominalTotalArr = [];
            let totalTransactions = 0;
            Object.keys(_nominalTotal).forEach((key) => {
                nominalTotalArr.push([key, _nominalTotal[key]]);
                totalTransactions += _nominalTotal[key];
            })
            /** add total to nominalTotalArr */
            nominalTotalArr.push(["TOTAL", totalTransactions])
            setNominalTotalRows(nominalTotalArr);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <>
            <div style={{ marginBottom: '20px' }}>
                <RMSTFDLayout>
                    <Typography>Laporan Retribusi Kendaraan Bulan {bulan} Tahun {tahun} </Typography>
                    <RMSMonthlyFilter handleBulanChange={handleBulanChange} handleTahunChange={handleTahunChange} showData={showData} />
                    <RMSFreeTable header={header} rows={rows} />
                </RMSTFDLayout>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Paper>
                    <Box sx={{ padding: '10px' }}>
                        <Typography>Fee Retribusi Kendaraan 10% bulan {bulan} Tahun {tahun} </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }}>
                        <RMSFreeTable header={["TEAM", "JUMLAH"]} rows={teamFeeRows} />
                    </Box>
                </Paper>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Paper>
                    <Box sx={{ padding: '10px' }}>
                        <Typography>Jumlah Transaksi Bulan {bulan} Tahun {tahun} </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }}>
                        <RMSFreeTable header={["Nominal", "JUMLAH"]} rows={nominalTotalRows} />
                    </Box>
                </Paper>
            </div>
        </>
    )
};

export default RMSRetribusiKendaraanReport;
