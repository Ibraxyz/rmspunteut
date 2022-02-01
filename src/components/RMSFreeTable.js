import React from 'react';
import { Paper, Table, TableContainer, TableRow, TableHead, TableCell, TableBody } from '@mui/material';

/** this table component is used to display array of array (2 dimensional array) */

const RMSFreeTable = ({ header, rows }) => {
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
                                key={row.tgl + '-collectorReportFreeTable'}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {
                                    row.map((r) => {
                                        return (<TableCell key={row + 'tbodyrow'} align="right">{r}</TableCell>)
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