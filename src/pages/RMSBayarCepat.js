import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Select, MenuItem, Typography, Button, Stack, TextField } from '@mui/material';
import useBlok from '../hooks/useBloks';
import useGroupedSelect from '../hooks/useGroupedSelect';
import { db } from '../';
import { where, collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import RMSFreeTable from '../components/RMSFreeTable';

const RMSBayarCepat = () => {
    const [ic_st_an, ic_st_aazz, ic_st_tasbiII] = useGroupedSelect();
    const [blok, setBlok] = useState("");
    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState("");
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const r_currentUser = useSelector((state) => state.currentUser);
    const showData = async () => {
        if (blok === "" || bulan === "" || tahun === "") {
            alert('Mohon isi semua input');
            return;
        }
        try {
            setIsLoading(true);
            const ref = collection(db, 'invoice');
            const conditions = [
                where('bulan', '==', parseInt(bulan)),
                where('tahun', '==', parseInt(tahun)),
                where('blok', '==', blok),
            ]
            const invoices = await getDocs(query(ref, ...conditions));
            const _rows = [];
            invoices.forEach((invoice) => {
                const invoiceData = invoice.data();
                _rows.push([
                    `${invoiceData['blok']} ${invoiceData['nomor-rumah']}`,
                    invoiceData.bulan,
                    invoiceData.tahun,
                    invoiceData['status-invoice'] === false ? 'BELUM LUNAS' : 'LUNAS',
                    <Button variant={'contained'} onClick={async () => {
                        try {
                            await updateDoc(doc(db, `invoice/${invoice.id}`), {
                                "status-invoice": true,
                                "sudah-dibayar": invoiceData['biaya'],
                                "sisa": 0,
                                "kolektor": r_currentUser
                            })
                            showData();
                        } catch (err) {
                            console.log(err.message);
                            alert(err.message);
                        }
                    }} disabled={invoiceData['status-invoice']}>
                        Bayar
                    </Button>
                ]);
            })
            setRows(_rows);
            setIsLoading(false);
        } catch (err) {
            console.log(err.message);
            alert(err.message);
            setIsLoading(false);
        }
    }
    return (
        <>
            <Box sx={{ marginBottom: '15px' }}>
                <Paper>
                    <Box sx={{ padding: '10px' }}>
                        <Stack spacing={1} direction={'row'}>
                            <Select label={'Blok'} onChange={(e) => setBlok(e.target.value)}>
                                {
                                    ic_st_an.map((blok) => {
                                        return (
                                            <MenuItem value={blok.value} >{blok.text}</MenuItem>
                                        )
                                    })
                                }
                                <Divider />
                                {
                                    ic_st_aazz.map((blok) => {
                                        return (
                                            <MenuItem value={blok.value} >{blok.text}</MenuItem>
                                        )
                                    })
                                }
                                <Divider />
                                {
                                    ic_st_tasbiII.map((blok) => {
                                        return (
                                            <MenuItem value={blok.value} >{blok.text}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                            <TextField label={'Bulan'} onChange={(e) => setBulan(e.target.value)} />
                            <TextField label={'Tahun'} onChange={(e) => setTahun(e.target.value)} />
                            <Button variant={"contained"} onClick={showData}>
                                Tampilkan Data
                            </Button>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }}>
                        {
                            isLoading ? "Loading ... "
                                :
                                <RMSFreeTable
                                    header={['Alamat', 'Bulan', 'Tahun', 'Status', 'Aksi']}
                                    rows={rows}
                                />
                        }
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default RMSBayarCepat;