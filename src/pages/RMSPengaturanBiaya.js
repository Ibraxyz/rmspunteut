import React, { useState, useEffect } from 'react';
import { Box, Paper, Divider, Button, Typography, Stack, LinearProgress, Container } from '@mui/material';
//redux
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";
//rms
import RMSTextField from '../components/RMSTextField';
import RMSSnackbar from '../components/RMSSnackbar';
//firestore
import { addDoc, doc, setDoc, getDoc } from "firebase/firestore";
//db
import { db } from '../index';
//hooks
import useSnackbar from '../hooks/useSnackbar';

/**
 * 
 * Biaya Bulanan : BB
 * Biaya Perawatan Lingkungan Pembangunan dan Renovasi Rumah : BPLPRR
 * Biaya Retribusi Kendaraan : BRK
 * Biaya Retribusi lingkungan : BRL
 * 
 */

/** biaya bulanan, biaya retribusi */

const RMSPengaturanBiaya = (props) => {
    //hooks - snackbar
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    //redux
    const r_currentPathState = useSelector((state) => state.currentPath);
    const dispatch = useDispatch();
    const { updateCurrentPath } = bindActionCreators(actionCreators, dispatch);
    //biaya bulanan state
    const [ic_st_bbName, ic_st_setBbName] = useState(null);
    const [ic_st_bb0, ic_st_setBb0] = useState(null);
    const [ic_st_bb1, ic_st_setBb1] = useState(null);
    const [ic_st_bb2, ic_st_setBb2] = useState(null);
    const [ic_st_bb3, ic_st_setBb3] = useState(null);
    const [ic_st_bb4, ic_st_setBb4] = useState(null);
    const [ic_st_bb5, ic_st_setBb5] = useState(null);
    const [ic_st_bb6, ic_st_setBb6] = useState(null);
    const [ic_st_bb7, ic_st_setBb7] = useState(null);
    const [ic_st_bb8, ic_st_setBb8] = useState(null);
    //BPLPRR state
    const [ic_st_bplprr0, ic_st_setBplprr0] = useState(null);
    const [ic_st_bplprr1, ic_st_setBplprr1] = useState(null);
    const [ic_st_bplprr2, ic_st_setBplprr2] = useState(null);
    const [ic_st_bplprr3, ic_st_setBplprr3] = useState(null);
    //BRK state
    const [ic_st_brk0, ic_st_setBrk0] = useState(null);
    const [ic_st_brk1, ic_st_setBrk1] = useState(null);
    const [ic_st_brk2, ic_st_setBrk2] = useState(null);
    const [ic_st_brk3, ic_st_setBrk3] = useState(null);
    const [ic_st_brk4, ic_st_setBrk4] = useState(null);
    const [ic_st_brk5, ic_st_setBrk5] = useState(null);
    const [ic_st_brk6, ic_st_setBrk6] = useState(null);
    //BRL state
    const [ic_st_brl0, ic_st_setBrl0] = useState(null);
    const [ic_st_brl1, ic_st_setBrl1] = useState(null);
    const [ic_st_brl2, ic_st_setBrl2] = useState(null);
    const [ic_st_brl3, ic_st_setBrl3] = useState(null);
    const [ic_st_brl4, ic_st_setBrl4] = useState(null);
    const [ic_st_brl5, ic_st_setBrl5] = useState(null);
    const [ic_st_brl6, ic_st_setBrl6] = useState(null);
    const [ic_st_brl7, ic_st_setBrl7] = useState(null);
    const [ic_st_brl8, ic_st_setBrl8] = useState(null);
    //is loading
    const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
    //functions - get biaya bulanan
    const getBiayaBulanan = async () => {
        try {
            ic_st_setIsLoading(true);
            const docSnap = await getDoc(doc(db, 'bb', 'bb1'));
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const data = docSnap.data();
                ic_st_setBbName(data['jenis']);
                ic_st_setBb0(data['biaya']['TYPE 0-100']);
                ic_st_setBb1(data['biaya']['TYPE 101-200']);
                ic_st_setBb2(data['biaya']['TYPE 201-300']);
                ic_st_setBb3(data['biaya']['TYPE 310-400']);
                ic_st_setBb4(data['biaya']['Rumah Mewah/Ukuran type 401 keatas']);
                ic_st_setBb5(data['biaya']['SUPERMARKET']);
                ic_st_setBb6(data['biaya']['BANK/PERKANTORAN/PINTU']);
                ic_st_setBb7(data['biaya']['RUKO/PINTU']);
                ic_st_setBb8(data['biaya']['USAHA LAIN-LAIN/PINTU']);
                h_sf_showSnackbar('Data Biaya Bulanan berhasil di load...', 'success');
                ic_st_setIsLoading(false);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                h_sf_showSnackbar('No such document!', 'error');
                ic_st_setIsLoading(false);
            }
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsLoading(false);
        }
    }
    //functions - get biaya bplprr
    const getBiayaBplprr = async () => {
        try {
            ic_st_setIsLoading(true);
            const docSnap = await getDoc(doc(db, 'bplprr', 'bplprr1'));
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const data = docSnap.data();
                ic_st_setBplprr0(data['biaya']['0 s/d 50 m2']);
                ic_st_setBplprr1(data['biaya']['51 s/d 100 m2']);
                ic_st_setBplprr2(data['biaya']['101 s/d 200 m2']);
                ic_st_setBplprr3(data['biaya']['201 s/d Keatas (Bertingkat)']);
                h_sf_showSnackbar('Data Biaya BPLPRR berhasil di load...', 'success');
                ic_st_setIsLoading(false);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                h_sf_showSnackbar('No such document!', 'error');
                ic_st_setIsLoading(false);
            }
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsLoading(false);
        }
    }
    //functions - get biaya BRK
    const getBiayaBRK = async () => {
        try {
            ic_st_setIsLoading(true);
            const docSnap = await getDoc(doc(db, 'brk', 'brk1'));
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const data = docSnap.data();
                ic_st_setBrk0(data['biaya']['Kendaraan Mobil Kontainer']);
                ic_st_setBrk1(data['biaya']['Kendaraan Mobil Intrakuler']);
                ic_st_setBrk2(data['biaya']['Kendaraan Mobil Mixer / Molen']);
                ic_st_setBrk3(data['biaya']['Kendaraan Mobil Fuso']);
                ic_st_setBrk4(data['biaya']['Kendaraan Mobil Cold Diesel']);
                ic_st_setBrk5(data['biaya']['Kendaraan Mobil Pick-Up/Mobil Box']);
                ic_st_setBrk6(data['biaya']['Becak Bawa Barang']);
                h_sf_showSnackbar('Data Biaya BRK berhasil di load...', 'success');
                ic_st_setIsLoading(false);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                h_sf_showSnackbar('No such document!', 'error');
                ic_st_setIsLoading(false);
            }
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsLoading(false);
        }
    }
    //functions - get biaya BRL
    const getBiayaBRL = async () => {
        try {
            ic_st_setIsLoading(true);
            const docSnap = await getDoc(doc(db, 'brl', 'brl1'));
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const data = docSnap.data();
                ic_st_setBrl0(data['biaya']['Pemakaian Jasa Anggota Satpam/Orang']);
                ic_st_setBrl1(data['biaya']['Uang Kebersihan Pesta']);
                ic_st_setBrl2(data['biaya']['Sebar Brosur/Rim']);
                ic_st_setBrl3(data['biaya']['Pemasangan Spanduk Jalur Utama/hari/m2']);
                ic_st_setBrl4(data['biaya']['Pemasangan Spanduk Jalur Biasa/hari/m2']);
                ic_st_setBrl5(data['biaya']['Pemasangan Umbul-umbul Jalur Utama/tiang/hari']);
                ic_st_setBrl6(data['biaya']['Pemasangan Umbul-umbul Jalur Biasa/tiang/hari']);
                ic_st_setBrl7(data['biaya']['Pemasangan Plang Nama, Neon Box Jalur Utama/hari/m2']);
                ic_st_setBrl8(data['biaya']['Pemasangan Plang Nama, Neon Box Jalur Biasa/hari/m2']);
                h_sf_showSnackbar('Data Biaya BRL berhasil di load...', 'success');
                ic_st_setIsLoading(false);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                h_sf_showSnackbar('No such document!', 'error');
                ic_st_setIsLoading(false);
            }
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsLoading(false);
        }
    }
    //effects
    useEffect(() => {
        updateCurrentPath("Pengaturan Biaya");
        //get biaya bulanan 
        getBiayaBulanan();
        //get biaya BPLPRR
        getBiayaBplprr();
        //get biaya retribusi kendaraan
        getBiayaBRK();
        //get biaya retribusi lingkungan
        getBiayaBRL();
    }, []);
    //functions
    const ic_af_updateBbData = async () => {
        if (ic_st_bb0 === null || ic_st_bb1 === null || ic_st_bb2 === null || ic_st_bb3 === null || ic_st_bb4 === null || ic_st_bb5 === null || ic_st_bb6 === null || ic_st_bb7 === null || ic_st_bb8 === null) {
            h_sf_showSnackbar('Inputan tidak boleh ada yang kosong', 'error');
        } else {
            try {
                await setDoc(doc(db, "bb", "bb1"), {
                    "jenis": ic_st_bbName,
                    "biaya": {
                        "TYPE 0-100": parseInt(ic_st_bb0),
                        "TYPE 101-200": parseInt(ic_st_bb1),
                        "TYPE 201-300": parseInt(ic_st_bb2),
                        "TYPE 310-400": parseInt(ic_st_bb3),
                        "Rumah Mewah/Ukuran type 401 keatas": parseInt(ic_st_bb4),
                        "SUPERMARKET": parseInt(ic_st_bb5),
                        "BANK/PERKANTORAN/PINTU": parseInt(ic_st_bb6),
                        "RUKO/PINTU": parseInt(ic_st_bb7),
                        "USAHA LAIN-LAIN/PINTU": parseInt(ic_st_bb8),
                    }
                });
                h_sf_showSnackbar('Biaya bulanan berhasil diupdate.', 'success');
            } catch (err) {
                console.log(err.message);
                h_sf_showSnackbar(err.message, 'error');
            }
        }
    }
    const ic_af_updateBplprrData = async () => {
        if (ic_st_bplprr0 === null || ic_st_bplprr1 === null || ic_st_bplprr2 === null || ic_st_bplprr3 === null) {
            h_sf_showSnackbar('Inputan tidak boleh ada yang kosong', 'error');
        } else {
            try {
                await setDoc(doc(db, "bplprr", "bplprr1"), {
                    "jenis": 'Biaya Perawatan Lingkungan Pembangunan dan Renovasi Rumah',
                    "biaya": {
                        '0 s/d 50 m2': parseInt(ic_st_bplprr0),
                        '51 s/d 100 m2': parseInt(ic_st_bplprr1),
                        '101 s/d 200 m2': parseInt(ic_st_bplprr2),
                        '201 s/d Keatas (Bertingkat)': parseInt(ic_st_bplprr3),
                    }
                });
                h_sf_showSnackbar('Biaya BPLPRR berhasil diupdate.', 'success');
            } catch (err) {
                console.log(err.message);
                h_sf_showSnackbar(err.message, 'error');
            }
        }
    }
    const ic_af_updateBrkData = async () => {
        if (ic_st_bplprr0 === null || ic_st_bplprr1 === null || ic_st_bplprr2 === null || ic_st_bplprr3 === null) {
            h_sf_showSnackbar('Inputan tidak boleh ada yang kosong', 'error');
        } else {
            try {
                await setDoc(doc(db, "brk", "brk1"), {
                    "jenis": 'Biaya Retribusi Kendaraan',
                    "biaya": {
                        'Kendaraan Mobil Kontainer': parseInt(ic_st_brk0),
                        'Kendaraan Mobil Intrakuler': parseInt(ic_st_brk1),
                        'Kendaraan Mobil Mixer / Molen': parseInt(ic_st_brk2),
                        'Kendaraan Mobil Fuso': parseInt(ic_st_brk3),
                        'Kendaraan Mobil Cold Diesel': parseInt(ic_st_brk4),
                        'Kendaraan Mobil Pick-Up/Mobil Box': parseInt(ic_st_brk5),
                        'Becak Bawa Barang': parseInt(ic_st_brk6),
                    }
                });
                h_sf_showSnackbar('Biaya BRK berhasil diupdate.', 'success');
            } catch (err) {
                console.log(err.message);
                h_sf_showSnackbar(err.message, 'error');
            }
        }
    }
    const ic_af_updateBrlData = async () => {
        if (ic_st_bplprr0 === null || ic_st_bplprr1 === null || ic_st_bplprr2 === null || ic_st_bplprr3 === null) {
            h_sf_showSnackbar('Inputan tidak boleh ada yang kosong', 'error');
        } else {
            try {
                await setDoc(doc(db, "brl", "brl1"), {
                    "jenis": 'Biaya Retribusi Kendaraan',
                    "biaya": {
                        'Pemakaian Jasa Anggota Satpam/Orang': parseInt(ic_st_brl0),
                        'Uang Kebersihan Pesta': parseInt(ic_st_brl1),
                        'Sebar Brosur/Rim': parseInt(ic_st_brl2),
                        'Pemasangan Spanduk Jalur Utama/hari/m2': parseInt(ic_st_brl3),
                        'Pemasangan Spanduk Jalur Biasa/hari/m2': parseInt(ic_st_brl4),
                        'Pemasangan Umbul-umbul Jalur Utama/tiang/hari': parseInt(ic_st_brl5),
                        'Pemasangan Umbul-umbul Jalur Biasa/tiang/hari': parseInt(ic_st_brl6),
                        'Pemasangan Plang Nama, Neon Box Jalur Utama/hari/m2': parseInt(ic_st_brl7),
                        'Pemasangan Plang Nama, Neon Box Jalur Biasa/hari/m2': parseInt(ic_st_brl8),
                    }
                });
                h_sf_showSnackbar('Biaya BRL berhasil diupdate.', 'success');
            } catch (err) {
                console.log(err.message);
                h_sf_showSnackbar(err.message, 'error');
            }
        }
    }
    return (
        <Box>
            <Paper sx={{ marginBottom: '40px' }}>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Biaya Bulanan</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'column'}>
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Nama Biaya Bulanan"} value={ic_st_bbName} handleChange={(v) => { ic_st_setBbName(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya TYPE 0-100"} value={ic_st_bb0} handleChange={(v) => { ic_st_setBb0(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya TYPE 101-200"} value={ic_st_bb1} handleChange={(v) => { ic_st_setBb1(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya 201-300"} value={ic_st_bb2} handleChange={(v) => { ic_st_setBb2(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya  301-400"} value={ic_st_bb3} handleChange={(v) => { ic_st_setBb3(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Rumah Mewah/Ukuran type 401 keatas"} value={ic_st_bb4} handleChange={(v) => { ic_st_setBb4(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya SUPERMARKET"} value={ic_st_bb5} handleChange={(v) => { ic_st_setBb5(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya BANK/PERKANTORAN/PINTU"} value={ic_st_bb6} handleChange={(v) => { ic_st_setBb6(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya RUKO/PINTU"} value={ic_st_bb7} handleChange={(v) => { ic_st_setBb7(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya USAHA LAIN-LAIN/PINTU"} value={ic_st_bb8} handleChange={(v) => { ic_st_setBb8(v) }} />
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button onClick={async () => {
                        await getBiayaBulanan();
                    }} sx={{ marginRight: '5px' }}>Reset</Button>
                    <Button variant={'contained'} onClick={async () => {
                        await ic_af_updateBbData();
                        await getBiayaBulanan();
                    }} disabled={ic_st_isLoading} >Update</Button>
                </Box>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
            </Paper>
            <Paper sx={{ marginBottom: '40px' }}>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Biaya Perawatan Lingkungan Pembangunan dan Renovasi Rumah</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'column'}>
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya 0 s/d 50 m2"} value={ic_st_bplprr0} handleChange={(v) => { ic_st_setBplprr0(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya 51 s/d 100 m2"} value={ic_st_bplprr1} handleChange={(v) => { ic_st_setBplprr1(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya 101 s/d 200 m2"} value={ic_st_bplprr2} handleChange={(v) => { ic_st_setBplprr2(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya 201 s/d Keatas (Bertingkat)"} value={ic_st_bplprr3} handleChange={(v) => { ic_st_setBplprr3(v) }} />
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button onClick={() => { getBiayaBplprr(); }} sx={{ marginRight: '5px' }}>Reset</Button>
                    <Button variant={'contained'} onClick={async () => { await ic_af_updateBplprrData(); await getBiayaBplprr(); }}>Update</Button>
                </Box>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
            </Paper>
            <Paper sx={{ marginBottom: '40px' }}>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Biaya Retribusi Kendaraan</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'column'}>
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Kendaraan Mobil Kontainer"} value={ic_st_brk0} handleChange={(v) => { ic_st_setBrk0(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Kendaraan Mobil Intrakuler"} value={ic_st_brk1} handleChange={(v) => { ic_st_setBrk1(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Kendaraan Mobil Mixer / Molen"} value={ic_st_brk2} handleChange={(v) => { ic_st_setBrk2(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Kendaraan Mobil Fuso"} value={ic_st_brk3} handleChange={(v) => { ic_st_setBrk3(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Kendaraan Mobil Cold Diesel"} value={ic_st_brk4} handleChange={(v) => { ic_st_setBrk4(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Kendaraan Mobil Pick-Up/Mobil Box"} value={ic_st_brk5} handleChange={(v) => { ic_st_setBrk5(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Becak Bawa Barang"} value={ic_st_brk6} handleChange={(v) => { ic_st_setBrk6(v) }} />
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button onClick={() => { getBiayaBRK(); }} sx={{ marginRight: '5px' }}>Reset</Button>
                    <Button variant={'contained'} onClick={async () => { await ic_af_updateBrkData(); await getBiayaBRK(); }}>Update</Button>
                </Box>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
            </Paper>
            <Paper sx={{ marginBottom: '40px' }}>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Biaya Retribusi lingkungan</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'column'}>
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemakaian Jasa Anggota Satpam/Orang"} value={ic_st_brl0} handleChange={(v) => { ic_st_setBrl0(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Uang Kebersihan Pesta"} value={ic_st_brl1} handleChange={(v) => { ic_st_setBrl1(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Sebar Brosur/Rim"} value={ic_st_brl2} handleChange={(v) => { ic_st_setBrl2(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemasangan Spanduk Jalur Utama/hari/m2"} value={ic_st_brl3} handleChange={(v) => { ic_st_setBrl3(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemasangan Spanduk Jalur Biasa/hari/m2"} value={ic_st_brl4} handleChange={(v) => { ic_st_setBrl4(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemasangan Umbul-umbul Jalur Utama/tiang/hari"} value={ic_st_brl5} handleChange={(v) => { ic_st_setBrl5(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemasangan Umbul-umbul Jalur Biasa/tiang/hari"} value={ic_st_brl6} handleChange={(v) => { ic_st_setBrl6(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemasangan Plang Nama, Neon Box Jalur Utama/hari/m2"} value={ic_st_brl7} handleChange={(v) => { ic_st_setBrl7(v) }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={""} helperText={"Masukkan Biaya Pemasangan Plang Nama, Neon Box Jalur Biasa/hari/m2"} value={ic_st_brl8} handleChange={(v) => { ic_st_setBrl8(v) }} />
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button onClick={() => { getBiayaBRL(); }} sx={{ marginRight: '5px' }}>Reset</Button>
                    <Button variant={'contained'} onClick={async () => { await ic_af_updateBrlData(); await getBiayaBRL() }}>Update</Button>
                </Box>
                {
                    ic_st_isLoading ? <LinearProgress /> : <></>
                }
            </Paper>
            {/** snack bar */}
            <RMSSnackbar
                isOpen={h_st_isSnackbarShown}
                handleClose={() => h_sf_closeSnackbar()}
                severity={h_st_severity}
                message={h_st_message} />
        </Box>
    )
}
export default RMSPengaturanBiaya;