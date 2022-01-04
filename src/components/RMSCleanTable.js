import React from 'react';
import { Table, Button } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const RMSCleanTable = (props) => {
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
                        props.rows.map((row, index) => {
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
                                            let displayedAs = row[th];
                                            if (th === 'aksi') {
                                                displayedAs =
                                                    <>
                                                        <Button sx={{ marginRight: '5px' }} onClick={row['edit']} startIcon={<EditIcon />} variant={'contained'}>Edit</Button>
                                                        <Button onClick={row['hapus']} variant={'outlined'} startIcon={<DeleteIcon />}>Hapus</Button>
                                                    </>
                                            }
                                            return (<TableCell align="left" >{displayedAs}</TableCell>)
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

export default RMSCleanTable;