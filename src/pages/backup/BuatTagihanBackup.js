/** 
import React, { useState, useEffect } from "react";

import { Box, Paper, Stack, Button, Snackbar, Alert } from "@mui/material";
import RMSTextField from "../components/RMSTextField";
import RMSSelect from "../components/RMSSelect";
import RMSDatePicker from "../components/RMSDatePicker";
import useDataOperations from "../hooks/useDataOperations";
//redux
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";

const BuatTagihan = (props) => {
    //redux 
    const r_currentPathState = useSelector((state) => state.currentPath);
    const dispatch = useDispatch();
    const { updateCurrentPath } = bindActionCreators(actionCreators, dispatch);

    useEffect(() => {
        updateCurrentPath("Buat Tagihan");
    },[])
    const nowDate = Date.now();
    const [isLoading, data, addData, getData, editData, deleteData] = useDataOperations("tagihan");
    const [biaya, setBiaya] = useState(null);
    const [blok, setBlok] = useState(null);
    const [email, setEmail] = useState(null);
    const [hp, setHp] = useState(null);
    const [jenis, setJenis] = useState(null);
    const [noKk, setNoKk] = useState(null);
    const [noRumah, setNoRumah] = useState(null);
    const [nomorTagihan, setNomorTagihan] = useState(null);
    const [sisa, setSisa] = useState(null);
    const [sudahLunas, setSudahLunas] = useState(null); //ok
    const [sudahDibayar, setSudahDibayar] = useState(null); //ok
    const [tanggalAktif, setTanggalAktif] = useState(null);
    const [tanggalDibayar, setTanggalDibayar] = useState(null); //ok
    const [tanggalDibuat, setTanggalDibuat] = useState(null); //ok
    const [telp, setTelp] = useState(null); //ok
    const obj = {
        "biaya": biaya, //ok
        "blok": blok, //ok
        "email": email, //ok
        "hp": hp,//ok
        "jenis": jenis,//ok
        "no_kk": noKk,//ok
        "no_rumah": noRumah, //ok
        "no_tagihan": nomorTagihan, //ok
        "sisa": sisa, //ok
        "sudahLunas": false,//ok
        "sudah_dibayar": 0,//ok
        "tanggal_aktif": tanggalAktif,//ok
        "tanggal_dibayar": tanggalDibayar,
        "tanggal_dibuat": tanggalAktif, //change later
        "telp": "873849343"
    }
    //alert visibility state
    const [isSuccessCreatingTagihanShow, setIsSuccessCreatingTagihanShow] = useState(false);
    //constant
    const statusTagihan = [
        {
            "text": "Belum Lunas",
            "value": "belum lunas"
        },
        {
            "text": "Lunas",
            "value": "lunas"
        }
    ]
    const jenisTagihan = [
        {
            "text": "Iuran Keamanan",
            "value": "iuran keamanan"
        },
        {
            "text": "Iuran Kebersihan",
            "value": "iuran kebersihan"
        }
    ]
    const bloks = [
        {
            "text": "A",
            "value": "A"
        },
        {
            "text": "B",
            "value": "B"
        },
        {
            "text": "C",
            "value": "C"
        },
        {
            "text": "D",
            "value": "D"
        },
        {
            "text": "E",
            "value": "E"
        }
    ]
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                <Box sx={{ padding: "10px" }}>
                    <Stack direction={"column"}>
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="number" label={"Biaya"} helperText={"Masukkan Biaya"} value={biaya} handleChange={(value) => setBiaya(value)} />
                        <RMSSelect isError={false} isRequired={true} displayFilter={"default"} items={bloks} label={"Blok"} helperText={"Masukkan Blok"} value={blok} handleChange={(value) => setBlok(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="email" label={"Email"} helperText={"Masukkan Email"} value={email} handleChange={(value) => setEmail(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="number" label={"HP"} helperText={"Masukkan Nomor HP"} value={hp} handleChange={(value) => setHp(value)} />
                        <RMSSelect isError={false} isRequired={true} displayFilter={"default"} items={jenisTagihan} label={"Jenis"} helperText={"Masukkan Jenis"} value={jenis} handleChange={(value) => setJenis(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={"Nomor KK"} helperText={"Masukkan Nomor KK"} value={noKk} handleChange={(value) => setNoKk(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={noRumah} handleChange={(value) => setNoRumah(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={"Nomor Tagihan"} helperText={"Masukkan Nomor Tagihan"} value={nomorTagihan} handleChange={(value) => setNomorTagihan(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="number" label={"Sisa"} helperText={"Sisa Pembayaran"} value={sisa} handleChange={(value) => setSisa(value)} />
                        <RMSSelect isError={false} isRequired={true} displayFilter={"default"} items={statusTagihan} label={"Status Tagihan"} helperText={"Masukkan Status Tagihan"} value={sudahLunas} handleChange={(value) => setSudahLunas(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} label={"Sudah Dibayar"} helperText={"Jumlah Sudah Dibayar"} value={sudahDibayar} handleChange={(value) => setSudahDibayar(value)} />
                        <RMSDatePicker isError={false} isRequired={true} displayFilter={"default"} label={"Tanggal Aktif"} helperText={"Tanggal tagihan"} value={tanggalAktif} handleChange={(value) => setTanggalAktif(value)} />
                        <RMSDatePicker isError={false} isRequired={true} displayFilter={"default"} label={"Tanggal Dibuat"} helperText={"Tanggal Tagihan Dibuat"} value={tanggalDibuat} handleChange={(value) => setTanggalDibuat(value)} />
                        <RMSDatePicker isError={false} isRequired={true} displayFilter={"default"} label={"Tanggal Dibayar"} helperText={"Tanggal Pembayaran"} value={tanggalDibayar} handleChange={(value) => setTanggalDibayar(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="number" label={"Nomor Telp"} helperText={"Masukkan Nomor Telp"} value={telp} handleChange={(value) => setTelp(value)} />
                        <Button sx={{ margin: "5px" }} variant={"contained"} onClick={async () => {
                            await addData(obj);
                            setIsSuccessCreatingTagihanShow(true);
                        }}>Buat Tagihan</Button>
                    </Stack>
                </Box>
            </Paper>
            <Snackbar open={isSuccessCreatingTagihanShow} autoHideDuration={2000} onClose={() => { }}>
                <Alert onClose={() => { }} severity="success" sx={{ width: '100%' }}>
                    Tagihan berhasil dibuat.
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default BuatTagihan; */