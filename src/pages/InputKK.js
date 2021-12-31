import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Stack, Button, Snackbar, Alert, Divider, Typography, Container } from "@mui/material";
import RMSTextField from "../components/RMSTextField";
import RMSSelect from "../components/RMSSelect";
import RMSDatePicker from "../components/RMSDatePicker";
import RMSAlert from "../components/RMSAlert";
import useInputForm from "../hooks/useInputForm";
import useInputValidation from "../hooks/useInputValidation";
import { db } from '../index';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import RMSSwitch from '../components/RMSSwitch';
import { getSeparatedDate } from "../rms-utility/rms-utility";
import { homeObj } from "../bulk-upload/home-object.js";
import { collection, addDoc } from 'firebase/firestore';

const InputKK = (props) => {
    const typoRef = useRef();
    const statusKeaktifan = [
        {
            "text": "Aktif",
            "value": true
        },
        {
            "text": "Tidak Aktif",
            "value": false
        }
    ]
    const [
        submitAction,
        isSuccessCreatingTagihanShow,
        setIsSuccessCreatingTagihanShow
    ] = useInputForm('kk');
    const [blok, setBlok] = useState("");
    const [email, setEmail] = useState("");
    const [hp, setHp] = useState("");
    const [noKk, setNoKk] = useState("");
    const [noRumah, setNoRumah] = useState("");
    const [tanggalBergabung, setTanggalBergabung] = useState(""); //ok
    const [telp, setTelp] = useState(""); //ok
    const [statusAktif, setStatusAktif] = useState(true);
    const [kategoriBangunan, setKategoriBangunan] = useState("");
    const [listKategoriBangunan, setListKategoriBangunan] = useState([]);
    const [namaBiaya, setNamaBiaya] = useState([]);
    const [idBiayaBulanan, setIdBiayaBulanan] = useState([]);
    const [biayaBulanan, setBiayaBulanan] = useState([]);
    const [pureListKategori, setPureListKategori] = useState([]);
    const [isManuallyInputIKK, setIsManuallyInputIKK] = useState(true);
    const [isRumahKosong, setIsRumahKosong] = useState(false);
    const [isTMB, setIsTMB] = useState(false);
    const now = getSeparatedDate(Date.now());
    const obj = {
        "biaya-bulanan": biayaBulanan,
        "kategori-bangunan": kategoriBangunan,
        "nama-biaya-bulanan": namaBiaya,
        "id-biaya-bulanan": idBiayaBulanan,
        "no_kk": noKk,//ok
        "blok": blok, //ok
        "no_rumah": noRumah,
        "telp": telp,
        "hp": hp,
        "email": email,
        "status": statusAktif,
        "tanggal_bergabung": Date.now(),
        "bulan-bergabung": now.month,
        "tahun-bergabung": now.year,
        "rumah-kosong": isRumahKosong, //not used here anymore
        "tmb": isTMB, //not used here anymore
    }
    const [isAlertShown, setIsAlertShown, validateInput] = useInputValidation();
    useEffect(() => {
        const getListKategori = async () => {
            try {
                const listKategori = await getDoc(doc(db, 'bb', 'bb1'));
                if (listKategori.exists()) {
                    setPureListKategori(listKategori.data().biaya);
                    setIdBiayaBulanan(listKategori.id);
                    setNamaBiaya(listKategori.data().jenis);
                    setListKategoriBangunan(Object.keys(listKategori.data().biaya).map((lk) => {
                        return {
                            'text': lk,
                            'value': lk,
                        }
                    }));
                } else {
                    console.log('no such document');
                }
            } catch (err) {
                console.log(err);
            }
        }
        getListKategori();
    }, []);
    const bulkUpload = async () => {
        for (let i = 0; i < homeObj.length; i++) {
            try {
                const docRef = await addDoc(collection(db, 'kk'), {
                    "blok": homeObj[i]['blok'],
                    "no_rumah": homeObj[i]['no'],
                    "biaya-bulanan": homeObj[i]['ikk']
                });
                console.log("Document written with ID: ", docRef.id);
                typoRef.current.innerHTML = `${homeObj[i]['blok']} | ${homeObj[i]['no']} telah ditambahkan.. | ${i}/${homeObj.length} ( ${Math.ceil((i / homeObj.length) * 100)} %)`;
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            if (i === 500 || i === 1000 || i === 1500 || i === 2000 || i === 2500 || i === 3000) {
                setTimeout(() => {
                    console.log('break...');
                }, 1000)
            }
        }
    }
    useEffect(() => {
        if (!isManuallyInputIKK) {
            setBiayaBulanan(pureListKategori[kategoriBangunan]);
        }
    }, [kategoriBangunan])
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                {/**
                  * <Box sx={{ padding: '10px' }}>
                    <Button variant={'contained'} onClick={() => {
                        bulkUpload();
                    }}>Bulk Upload</Button>
                    <Typography sx={{ marginLeft: '5px' }} variant={'caption'} ref={typoRef}>0</Typography>
                </Box>
                  */}
                <Box sx={{ padding: '10px' }}>
                    <RMSSwitch label={'IKK berdasarkan kategori bangunan'} handleChange={(v) => { setBiayaBulanan([]); setIsManuallyInputIKK(!v) }} />
                </Box>
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'h6'} content={'div'}>Input KK</Typography>
                    <Typography variant={'caption'} content={'div'}>Pada form input kk ini, input yang harus diisi hanya ( kategori bangunan / biaya bulanan ), blok dan nomor rumah saja. Inputan yang lain hanya opsional.</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: "10px" }}>
                    <Stack direction={"column"}>
                        <RMSAlert isOpen={isAlertShown} message={"Mohon isi inputan yang bertanda (*)"} setIsOpen={() => { setIsAlertShown(false) }} />
                        {
                            isManuallyInputIKK === true ?
                                <RMSTextField isError={biayaBulanan.length === 0 && isAlertShown} isRequired={true} displayFilter={"default"} label={"Besar IKK Bulanan"} helperText={"Masukkan besar IKK secara manual"} value={biayaBulanan} handleChange={(value) => { setBiayaBulanan(value); }} />
                                :
                                <RMSSelect isError={false} isRequired={true} displayFilter={"default"} label={"Kategori Bangunan"} helperText={"Masukkan Kategori Bangunan"} value={kategoriBangunan} items={listKategoriBangunan} handleChange={(value) => { setKategoriBangunan(value); }} />
                        }
                        <RMSTextField isError={blok.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Blok"} helperText={"Masukkan Blok"} value={blok} handleChange={(value) => setBlok(value)} />
                        <RMSTextField isError={noRumah.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={noRumah} handleChange={(value) => setNoRumah(value)} />
                        <RMSTextField isError={false} isRequired={false} displayFilter={"default"} label={"Nomor KK (Opsional)"} helperText={"Masukkan Nomor KK"} value={noKk} handleChange={(value) => setNoKk(value)} />
                        <RMSTextField isError={false} isRequired={false} displayFilter={"default"} label={"Email (Opsional)"} helperText={"Masukkan Email"} value={email} handleChange={(value) => setEmail(value)} />
                        <RMSTextField isError={false} isRequired={false} displayFilter={"default"} label={"HP (Opsional)"} helperText={"Masukkan Nomor HP"} value={hp} handleChange={(value) => setHp(value)} />
                        {/** <RMSDatePicker isError={tanggalBergabung.length === 0 && isAlertShown ? true : false} isRequired={false} displayFilter={"default"} label={"Tanggal Bergabung"} helperText={"Tanggal Bergabung"} value={tanggalBergabung} handleChange={(value) => setTanggalBergabung(value)} /> **/}
                        <RMSTextField isError={false} isRequired={false} displayFilter={"default"} label={"Nomor Telp (Opsional)"} helperText={"Masukkan Nomor Telp"} value={telp} handleChange={(value) => setTelp(value)} />
                        {/**
                         * <Box sx={{ padding: '10px' }}>
                            <RMSSwitch label={'Rumah Kosong'} handleChange={(v) => { setIsRumahKosong(v); }} />
                        </Box>
                        <Box sx={{ padding: '10px' }}>
                            <RMSSwitch label={'Tidak Mau Bayar'} handleChange={(v) => { setIsTMB(v); }} />
                        </Box>
                         */}
                        {/** <RMSSelect isError={false} isRequired={true} displayFilter={"default"} items={statusKeaktifan} label={"Status"} helperText={"Masukkan Status"} value={statusAktif} handleChange={(value) => setStatusAktif(value)} /> **/}
                        <Button sx={{ margin: "5px" }} variant={"contained"} onClick={async () => {
                            if (validateInput([
                                //noKk,
                                isManuallyInputIKK ? biayaBulanan : kategoriBangunan,
                                noRumah,
                                blok,
                                //email,
                                //hp,
                                //telp,
                                //statusAktif,
                                //tanggalBergabung
                            ])) {
                                try {
                                    await submitAction(obj);
                                    const blokList = await getDoc(doc(db, `blok/${obj.blok}`));
                                    if (!blokList.exists()) {
                                        await setDoc(doc(db, `blok/${obj.blok}`), {
                                            "nama": obj.blok,
                                        })
                                    }
                                    //await baddData()
                                    setBlok("");
                                    setEmail("");
                                    setHp("");
                                    setNoKk("");
                                    setNoRumah("");
                                    setTanggalBergabung(""); //ok
                                    setTelp(""); //ok
                                    setStatusAktif("");
                                    setIsSuccessCreatingTagihanShow(true);
                                } catch (error) {
                                    console.log(error.message);
                                }
                            }
                        }}>Input KK</Button>
                    </Stack>
                </Box>
            </Paper>
            <Snackbar open={isSuccessCreatingTagihanShow} autoHideDuration={2000} onClose={() => { setIsSuccessCreatingTagihanShow(false) }}>
                <Alert onClose={() => { setIsSuccessCreatingTagihanShow(false) }} severity="success" sx={{ width: '100%' }}>
                    KK berhasil diinput.
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default InputKK;
