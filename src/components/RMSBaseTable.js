import React from 'react';
import { Box, Paper, Divider, Typography, Table, TableContainer, TableRow, TableHead, TableCell, TableBody, Button, TextField, Stack } from '@mui/material';

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

export default RMSBaseTable;