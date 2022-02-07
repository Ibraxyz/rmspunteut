import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatRupiah } from '../rms-utility/rms-utility';
import { Typography } from '@mui/material';

export default function RMSDisplayTable(props) {
    const [total, setTotal] = useState(0);
    const [totalBL, setTotalBL] = useState(0);
    const [totalRK, setTotalRK] = useState(0);
    const [totalTMB, setTotalTMB] = useState(0);
    const [totalEMPTY, setTotalEMPTY] = useState(0);
    const [groupedArray, setGroupedArray] = useState([]);
    useEffect(() => {
        props.startProcess();
        //group report based on blok
        const groupedObject = {};
        const groupedObjectArr = [];
        props.rows.forEach((row) => {
            if (groupedObject[row['blok']] === undefined) {
                groupedObject[row['blok']] = [row];
            } else {
                groupedObject[row['blok']] = [...groupedObject[row['blok']], row];
            }
        });
        const keys = Object.keys(groupedObject);
        for (let i = 0; i < keys.length; i++) {
            console.log('key', keys[i]);
            if (groupedObject[keys[i]].length > 0) {
                for (let j = 0; j < groupedObject[keys[i]].length; j++) {
                    groupedObjectArr.push(groupedObject[keys[i]][j]);
                }
            }
        }
        setGroupedArray(groupedObjectArr);
        //......
        let newTotal = 0; //total yang sudah bayar
        let totalBelumLunas = 0;
        let totalRK = 0;
        let totalTMB = 0;
        let totalEMPTY = 0;
        for (var i = 0; i < groupedObjectArr.length; i++) {
            if (groupedObjectArr[i]['status-invoice'] === 'LUNAS' && groupedObjectArr[i]['biaya'] !== 'RK' && groupedObjectArr[i]['biaya'] !== 'TMB' && groupedObjectArr[i]['biaya'] !== 'EMPTY') {
                newTotal += parseInt(groupedObjectArr[i].biaya);
                console.log('newTotal value inspect', newTotal);
            } else if (groupedObjectArr[i]['status-invoice'] === 'BELUM LUNAS' && groupedObjectArr[i]['biaya'] !== 'RK' && groupedObjectArr[i]['biaya'] !== 'TMB' && groupedObjectArr[i]['biaya'] !== 'EMPTY') {
                console.log(`biaya inspect what make its NaN ${groupedObjectArr[i]['blok']}|${groupedObjectArr[i]['nomor-rumah']}`, groupedObjectArr[i].biaya);
                totalBelumLunas += parseInt(groupedObjectArr[i].biaya);
                console.log('totalBelumLunas value inspect', totalBelumLunas);
            } else if (groupedObjectArr[i]['biaya'] === 'RK') {
                totalRK++;
            } else if (groupedObjectArr[i]['biaya'] === 'TMB') {
                totalTMB++;
            } else if (groupedObjectArr[i]['biaya'] === 'EMPTY') {
                totalEMPTY++;
            }
        }
        setTotal(newTotal);
        setTotalBL(totalBelumLunas);
        setTotalRK(totalRK);
        setTotalTMB(totalTMB);
        setTotalEMPTY(totalEMPTY);
        props.finishProcess();
    }, [])
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        {
                            props.tableHead.map((th, index) => {
                                return <TableCell key={`th-${th}-${index}`} align="left">{th}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        groupedArray.map((row, index) => {
                            return (
                                <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    {
                                        props.tableHead.map((th) => {
                                            let displayedAs = "";
                                            if (th === 'biaya') {
                                                displayedAs = `Rp.${formatRupiah(row[th])}`
                                            } if (th === 'nama-daftar-tagihan') {
                                                let tagihan = "";
                                                if (row[th] === null || row[th] === undefined || row[th] === "") {
                                                    //
                                                } else {
                                                    let namaDaftarTagihanObj = JSON.parse(row[th]);
                                                    namaDaftarTagihanObj.forEach((nama) => {
                                                        tagihan += `${nama} , `
                                                    });
                                                }
                                                displayedAs = tagihan
                                            } else {
                                                displayedAs = row[th];
                                            }
                                            return (
                                                <TableCell key={`tc-${th}-${index}`} align="left" sx={{ color: row['biaya'] === 'RK' || row['biaya'] === 'TMB' || row['biaya'] === 'EMPTY' ? 'red' : 'black' }}>{displayedAs}</TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })}
                    <TableRow>
                        <TableCell colSpan={props.tableHead.length - 1}>

                        </TableCell>
                        <TableCell >
                            <Typography variant={'subtitle2'}>Total Pendapatan</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant={'subtitle2'}>{`Rp.${formatRupiah(totalBL + total)}`}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={props.tableHead.length - 1}>

                        </TableCell>
                        <TableCell >
                            <Typography variant={'subtitle2'} >Total Lunas</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant={'subtitle2'} sx={{ color: 'green' }}>{`Rp.${formatRupiah(total)}`}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={props.tableHead.length - 1}>

                        </TableCell>
                        <TableCell >
                            <Typography variant={'subtitle2'}>Total Belum Lunas</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant={'subtitle2'} sx={{ color: 'red' }}>{`Rp.${formatRupiah(totalBL)}`}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={props.tableHead.length - 1}>

                        </TableCell>
                        <TableCell >
                            <Typography variant={'subtitle2'}>Total RK</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant={'subtitle2'}>{`${totalRK} Invoice(s)`}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={props.tableHead.length - 1}>

                        </TableCell>
                        <TableCell >
                            <Typography variant={'subtitle2'}>Total TMB</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant={'subtitle2'}>{`${totalTMB} invoice(s)`}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={props.tableHead.length - 1}>

                        </TableCell>
                        <TableCell >
                            <Typography variant={'subtitle2'}>Total EMPTY</Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant={'subtitle2'}>{`${totalEMPTY} invoice(s)`}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}