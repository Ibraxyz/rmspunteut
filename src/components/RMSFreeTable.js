import React from 'react';
import { Paper, Table, TableContainer, TableRow, TableHead, TableCell, TableBody } from '@mui/material';

/** this table component is used to display array of array (2 dimensional array) */

const RMSFreeTable = ({ header, rows }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {
                            header.map((h, index) => {
                                return <TableCell key={'tableCellHeader-' + h + index * Math.random()} align="center">{h}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        return (
                            <TableRow
                                key={row.tgl + '-collectorReportFreeTable' + index * Math.random()}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {
                                    row.map((r, idx) => {
                                        return (<TableCell key={row + 'tbodyrow' + idx * Math.random()} align="center">{r}</TableCell>)
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

export default RMSFreeTable;