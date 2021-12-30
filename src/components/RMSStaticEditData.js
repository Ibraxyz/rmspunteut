import React, { useState, useEffect } from 'react';
import { Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RMSTextField from "../components/RMSTextField";
import RMSDatePicker from './RMSDatePicker';

const RMSStaticEditData = (props) => {
    //states
    const [ic_st_id, ic_st_setId] = useState([]);
    const [ic_st_kelompokTagihan, ic_st_setKelompokTagihan] = useState([]);
    const [ic_st_tagihan, ic_st_setTagihan] = useState([]);
    const [ic_st_biaya, ic_st_setBiaya] = useState([]);
    const [ic_st_sudahDibayar, ic_st_setSudahDibayar] = useState([]);
    const [ic_st_pembayaranSekarang, ic_st_setPembayaranSekarang] = useState(0);
    const [ic_st_sisa, ic_st_setSisa] = useState([]);
    const [ic_st_statusTagihan, ic_st_setStatusTagihan] = useState([]);
    const [ic_st_statusKelompokTagihan, ic_st_setStatusKelompokTagihan] = useState([]);
    const [ic_st_blok, ic_st_setBlok] = useState([]);
    const [ic_st_nomorRumah, ic_st_setNomorRumah] = useState([]);
    const [ic_st_nomorKk, ic_st_setNomorKk] = useState([]);
    const [ic_st_nomorTelpon, ic_st_setNomorTelpon] = useState([]);
    const [ic_st_nomorHp, ic_st_setNomorHp] = useState([]);
    const [ic_st_email, ic_st_setEmail] = useState([]);
    const [ic_st_tanggalDibuat, ic_st_setTanggalDibuat] = useState([]);
    const [ic_st_tanggalAktif, ic_st_setTanggalAktif] = useState([]);
    const [ic_st_tanggalDibayar, ic_st_setTanggalDibayar] = useState([]);
    //functions
    const ic_sf_reset = () => {
        props.selectedRows.map((row) => {
            ic_st_setId(row['id']);
            ic_st_setKelompokTagihan(row['kelompok-tagihan']);
            ic_st_setTagihan(row['tagihan']);
            ic_st_setBiaya(parseInt(row['biaya']));
            ic_st_setSudahDibayar(parseInt(row['sudah-dibayar']));
            ic_st_setSisa(parseInt(row['sisa']));
            ic_st_setStatusTagihan(row['status-tagihan']);
            ic_st_setStatusKelompokTagihan(row['status-kelompok-tagihan']);
            ic_st_setPembayaranSekarang(0);
            ic_st_setBlok(row['blok']);
            ic_st_setNomorRumah(row['nomor-rumah']);
            ic_st_setNomorTelpon(row['nomor-telpon']);
            ic_st_setNomorKk(row['nomor-kk']);
            ic_st_setNomorHp(row['nomor-hp']);
            ic_st_setEmail(row['email']);
            ic_st_setTanggalDibuat(row['tanggal-dibuat']);
            ic_st_setTanggalDibayar(row['tanggal-dibayar']);
            ic_st_setTanggalAktif(row['tanggal-aktif']);
        })
    }
    const handlePembayaranChange = (value) => {
        console.log('sisa', parseInt(props.selectedRows[0]['sisa']));
        if (value > parseInt(props.selectedRows[0]['sisa'])) {
            ic_st_setPembayaranSekarang(parseInt(props.selectedRows[0]['sisa']));
        } else if (value < 0) {
            ic_st_setPembayaranSekarang(0);
        } else {
            ic_st_setPembayaranSekarang(value);
        }
    }
    //effects
    useEffect(() => {
        //populate edit inputs initial value
        if (props.selectedRows.length > 0) {
            ic_sf_reset();
        }
    }, [props.selectedRows])
    useEffect(() => {
        //calculate remaining payment
        const ue_calculateRemainingValue = parseInt(ic_st_biaya) - (parseInt(ic_st_pembayaranSekarang) + parseInt(ic_st_sudahDibayar));
        ic_st_setSisa(ue_calculateRemainingValue === NaN ? 0 : ue_calculateRemainingValue);
        ic_st_setStatusTagihan(parseInt(ic_st_biaya) - (parseInt(ic_st_pembayaranSekarang) + parseInt(ic_st_sudahDibayar)) === 0 ? 'LUNAS' : 'BELUM LUNAS');
    }, [ic_st_biaya, ic_st_sudahDibayar, ic_st_pembayaranSekarang]);
    return (
        <>
            <Dialog open={props.isOpen}>
                <DialogTitle>Pembayaran Tagihan</DialogTitle>
                <Divider />
                <DialogContent ref={null}>
                    <Stack spacing={2} direction={"column"}>
                        <Typography variant="subtitle2" display={'block'} sx={{ opacity: 0.4 }}>id faktur : {ic_st_kelompokTagihan}</Typography>
                        <Typography variant="subtitle2" display={'block'}>{ic_st_tagihan}</Typography>
                        <Typography variant="caption" display={'block'}>Biaya : {ic_st_biaya}</Typography>
                        <Typography variant="caption" display={'block'}>Sudah Dibayar : {ic_st_sudahDibayar}</Typography>
                        <Typography variant="caption" display={'block'}>Sisa : {ic_st_sisa}</Typography>
                        <Typography variant="caption" display={'block'} sx={{ color: ic_st_statusTagihan === 'BELUM LUNAS' ? 'red' : 'green' }}>{ic_st_statusTagihan}</Typography>
                        <Divider />
                        {/** ic_st_pembayaranSekarang */}
                        <RMSTextField
                            isError={false}
                            isRequired={true}
                            displayFilter={"default"}
                            label={'Bayar Sejumlah'}
                            helperText={'Jumlah Pembayaran Sekarang'}
                            value={ic_st_pembayaranSekarang}
                            type={'number'}
                            handleChange={(value) => handlePembayaranChange(value)} />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Stack direction="column" spacing={1} sx={{ width: '100%' }} >
                        <Button startIcon={<RotateLeftIcon />} onClick={ic_sf_reset} variant="outlined" disabled={false}>Reset</Button>
                        <Button startIcon={<CancelIcon />} onClick={props.cancelEdit} variant="outlined" disabled={false}>Batal</Button>
                        <Button startIcon={<CheckIcon />} onClick={() => {
                            props.updateData(ic_st_id, 'tagihan', {
                                'sudah-dibayar': parseInt(ic_st_pembayaranSekarang) + parseInt(ic_st_sudahDibayar),
                                'status-tagihan': ic_st_statusTagihan === 'BELUM LUNAS' ? false : true,
                                'sisa': parseInt(ic_st_sisa),
                                'tanggal-dibayar': Date.now()
                            });
                        }} variant="contained" disabled={false}>Update</Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default RMSStaticEditData;
