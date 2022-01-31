import React, { useState, useEffect } from 'react';
import { Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box, Typography, Select, MenuItem, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RMSTextField from "../components/RMSTextField";
import RMSDatePicker from './RMSDatePicker';
//redux
import { useSelector } from "react-redux";
//utility
import { createReport, createIkkReport, getSeparatedDate } from '../rms-utility/rms-utility';
import RMSSnackbar from '../components/RMSSnackbar';
import useSnackbar from '../hooks/useSnackbar';
import { db } from '../';
import { getDocs, collection, where, query } from 'firebase/firestore';

const RMSPayInvoice = (props) => {
    //snackbar
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    //redux
    const r_currentUser = useSelector((state) => state.currentUser);
    //states
    const [ic_st_id, ic_st_setId] = useState([]);
    const [ic_st_kelompokTagihan, ic_st_setKelompokTagihan] = useState([]);
    const [ic_st_tagihan, ic_st_setTagihan] = useState([]);
    const [ic_st_biaya, ic_st_setBiaya] = useState([]);
    const [ic_st_sudahDibayar, ic_st_setSudahDibayar] = useState([]);
    const [ic_st_pembayaranSekarang, ic_st_setPembayaranSekarang] = useState(0);
    const [ic_st_sisa, ic_st_setSisa] = useState([]);
    const [ic_st_statusInvoice, ic_st_setStatusInvoice] = useState([]);
    const [ic_st_namaDaftarTagihan, ic_st_setNamaDaftarTagihan] = useState([]);
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
    const [ic_st_kategori, ic_st_setKategori] = useState([]);
    const [ic_st_bulan, ic_st_setBulan] = useState([]);
    const [ic_st_tahun, ic_st_setTahun] = useState([]);
    const [ic_st_subTotal, ic_st_setSubTotal] = useState([]);
    /** this state is used to fill the invoice data based on user input, if all of these values are null, the Date.now() will be used */
    const [ic_st_customBulan, ic_st_setCustomBulan] = useState(null);
    const [ic_st_customTahun, ic_st_setCustomTahun] = useState(null);
    const [ic_st_customDay, ic_st_setCustomDay] = useState(null);
    /** collector list state */
    const [collectorList, setCollectorList] = useState([]);
    /** selected collector list state */
    const [selectedCollector, setSelectedCollector] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    /** invoice team */
    const availableTeam = [{ "name": "TEAM_I", "value": 1 }, { "name": "TEAM_II", "value": 2 }, { "name": "TEAM_III", "value": 3 }];
    const [selectedTeam, setSelectedTeam] = useState(0);
    //functions
    const ic_sf_reset = () => {
        let namaDaftarTagihan = ``;
        props.selectedRows.map((row) => {
            JSON.parse(row['nama-daftar-tagihan']).forEach((ndt, index) => {
                namaDaftarTagihan += `${ndt} ${index === JSON.parse(row['nama-daftar-tagihan']).length - 1 ? `` : ` + `}`;
            });
            ic_st_setId(row['id']);
            ic_st_setKelompokTagihan(row['kelompok-tagihan']);
            ic_st_setTagihan(row['tagihan']);
            ic_st_setBiaya(parseInt(row['biaya']));
            ic_st_setSudahDibayar(parseInt(row['sudah-dibayar']));
            ic_st_setSisa(parseInt(row['sisa']));
            ic_st_setStatusInvoice(row['status-invoice']);
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
            ic_st_setNamaDaftarTagihan(JSON.parse((row['nama-daftar-tagihan'])));
            ic_st_setTagihan(JSON.parse((row['tagihan'])));
            ic_st_setKategori(row['kategori']);
            ic_st_setTahun(row['tahun']);
            ic_st_setBulan(row['bulan']);
            ic_st_setSubTotal(row['subtotal']);
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
    useEffect(() => {
        /** get collector list from db */
        const getCollectorList = async () => {
            try {
                const ref = collection(db, 'user');
                const conditions = [
                    where('role', '==', 1)
                ]
                const collectorList = await getDocs(query(ref, ...conditions));
                const fixCollectorLIst = [];
                collectorList.forEach((doc) => {
                    fixCollectorLIst.push(doc.data())
                })
                setCollectorList(fixCollectorLIst);
            } catch (err) {
                console.log(err.message);
            }
        }
        getCollectorList();
    }, [])
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
        ic_st_setStatusInvoice(parseInt(ic_st_biaya) - (parseInt(ic_st_pembayaranSekarang) + parseInt(ic_st_sudahDibayar)) === 0 ? 'LUNAS' : 'BELUM LUNAS');
    }, [ic_st_biaya, ic_st_sudahDibayar, ic_st_pembayaranSekarang]);
    return (
        <>
            <Dialog open={props.isOpen}>
                <DialogTitle>Pembayaran Tagihan</DialogTitle>
                <Divider />
                <DialogContent ref={null}>
                    <Stack spacing={1} direction={"column"}>
                        <Typography variant="subtitle2" display={'block'} sx={{ opacity: 0.4 }}>id faktur : {ic_st_id}</Typography>
                        {
                            ic_st_tagihan.map((ndt) => {
                                return (
                                    <Stack key={`ndt-${ndt['jenis']}-${ndt['biaya']}`} justifyContent={'space-between'} direction={'row'}>
                                        <Typography variant="caption" display={'block'}>{ndt.jenis}</Typography>
                                        <Typography variant="caption" display={'block'}>{ndt.biaya}</Typography>
                                    </Stack>
                                )
                            })
                        }
                        <Divider />
                        <Stack spacing={1} alignItems={'flex-end'}>
                            <Typography variant="subtitle2" display={'block'}>Total Biaya : {ic_st_biaya}</Typography>
                            <Typography variant="caption" display={'block'}>Sudah Dibayar : {ic_st_sudahDibayar}</Typography>
                            <Typography variant="caption" display={'block'}>Sisa : {ic_st_sisa}</Typography>
                            <Typography variant="caption" display={'block'} sx={{ color: ic_st_statusInvoice === 'BELUM LUNAS' ? 'red' : 'green' }}>{ic_st_statusInvoice}</Typography>
                        </Stack>
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
                        <Divider />
                        <Select title={"Pilih Kolektor"} label={"Pilih Kolektor"} onChange={(e) => {
                            //filter a collector obj with selected id
                            const _selectedCollectorObj = collectorList.filter((collector) => {
                                return collector.uid === e.target.value
                            })
                            setSelectedCollector(_selectedCollectorObj[0]); //the filtered obj is an array so we have to add [0] to make user the supplied value is not an array.
                        }}>
                            {
                                collectorList.map((collector) => {
                                    return (
                                        <MenuItem key={`kolektor-list-at-rmspayinvoice-${collector.uid}`} value={collector.uid} >{collector.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                        <Select title={"Pilih Team (Opsional)"} label={"Pilih Team (Opsional)"} onChange={(e) => {
                            //filter a collector obj with selected id
                            setSelectedTeam(e.target.value); //the filtered obj is an array so we have to add [0] to make user the supplied value is not an array.
                        }}>
                            {
                                availableTeam.map((team) => {
                                    return (
                                        <MenuItem key={`kolektor-list-at-rmspayinvoice-${team.value}`} value={team.value} >{team.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                        <TextField type="number" title="Hari" label="hari" onChange={(e) => {
                            setSelectedDay(e.target.value)
                        }} />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={1} sx={{ width: '100%' }} >
                        <Button startIcon={<RotateLeftIcon />} onClick={ic_sf_reset} variant="outlined" disabled={false}>Reset</Button>
                        <Button startIcon={<CancelIcon />} onClick={props.cancelEdit} variant="outlined" disabled={false}>Batal</Button>
                        <Button startIcon={<CheckIcon />} onClick={async () => {
                            if (selectedCollector === null) {
                                alert('Anda harus memilih kolektor untuk invoice ini.');
                                return;
                            } else if (selectedDay === null) {
                                alert('Anda harus masukkan tanggal tagihan dibayar');
                                return;
                            }
                            const now = Date.now();
                            const separatedDate = getSeparatedDate(now);
                            await props.updateData(ic_st_id, 'invoice', {
                                'sudah-dibayar': parseInt(ic_st_pembayaranSekarang) + parseInt(ic_st_sudahDibayar),
                                'status-invoice': ic_st_statusInvoice === 'BELUM LUNAS' ? false : true,
                                'sisa': parseInt(ic_st_sisa),
                                'tanggal-dibayar': Date.now(), /** later, never rely on this field, just stick with the separatedDate field on the document */
                                'hari': parseInt(selectedDay), //it was => ic_st_customDay === null ? separatedDate.day : ic_st_customDay
                                'bulan': ic_st_customBulan === null ? separatedDate.month : ic_st_customBulan,
                                'tahun': ic_st_customTahun === null ? separatedDate.year : ic_st_customTahun,
                                'kolektor': selectedCollector,// this was => r_currentUser === null ? '-' : r_currentUser,
                                'team': availableTeam.filter((t) => {
                                    return t.value === selectedTeam
                                })[0],
                            });
                            try {
                                //blok, category, nominal, currentUser
                                await createReport(ic_st_blok, ic_st_kategori, parseInt(ic_st_biaya), r_currentUser);
                                h_sf_showSnackbar('Berhasil menambahkan laporan', 'success');
                                //create ikk report
                                if (ic_st_kategori === 'bulanan') {
                                    await createIkkReport(ic_st_tahun, ic_st_bulan, ic_st_blok, ic_st_nomorRumah, parseInt(ic_st_subTotal), parseInt(ic_st_biaya), r_currentUser);
                                    h_sf_showSnackbar('Berhasil menambahkan laporan IKK', 'success');
                                }
                            } catch (err) {
                                console.log(err.message);
                                h_sf_showSnackbar(err.message, 'error');
                            }
                        }} variant="contained" disabled={false}>Update</Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            {/** snackbar */}
            <RMSSnackbar isOpen={h_st_isSnackbarShown} message={h_st_message} h_st_severity={h_st_severity} handleClose={h_sf_closeSnackbar} />
        </>
    )
}

export default RMSPayInvoice;
