import React, { useState, useEffect } from "react";
import { getTime } from 'date-fns';
import md5 from 'md5';
import {
    Box,
    Paper,
    Stack,
    Button,
    Snackbar,
    Alert,
    Tabs,
    Tab,
    CircularProgress,
    Typography
} from "@mui/material";
import RMSTextField from "../components/RMSTextField";
import RMSSelect from "../components/RMSSelect";
import RMSDatePicker from "../components/RMSDatePicker";
import RMSAlert from "../components/RMSAlert";
import useInputForm from "../hooks/useInputForm";
import useInputValidation from "../hooks/useInputValidation";
import useDataOperations from "../hooks/useDataOperations";

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

const BuatTagihan = (props) => {
    const nowDate = Date.now();
    const [b_isLoading, b_data, b_addData, b_getData, b_editData, b_deleteData] = useDataOperations('biaya');
    const [k_isLoading, k_data, k_addData, k_getData, k_editData, k_deleteData] = useDataOperations('kk');
    const [t_isLoading, t_data, t_addData, t_getData, t_editData, t_deleteData] = useDataOperations('tagihan');
    const [f_isLoading, f_data, f_addData, f_getData, f_editData, f_deleteData] = useDataOperations('faktur');
    const [isCircularProgressShown, setIsCircularProgressShown] = useState(false);
    const [biaya, setBiaya] = useState("");
    const [blok, setBlok] = useState("");
    const [email, setEmail] = useState("");
    const [hp, setHp] = useState("");
    const [jenis, setJenis] = useState("");
    const [noKk, setNoKk] = useState("");
    const [noRumah, setNoRumah] = useState("");
    const [nomorTagihan, setNomorTagihan] = useState("");
    const [sisa, setSisa] = useState("");
    const [sudahLunas, setSudahLunas] = useState(""); //ok
    const [sudahDibayar, setSudahDibayar] = useState(""); //ok
    const [tanggalAktif, setTanggalAktif] = useState("");
    const [tanggalDibayar, setTanggalDibayar] = useState(""); //ok
    const [tanggalDibuat, setTanggalDibuat] = useState(""); //ok
    const [kelompokTagihan, setKelompokTagihan] = useState("");
    const [statusKelompokTagihan, setStatusKelompokTagihan] = useState(false);
    //buat tagihan otomatis
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [tanggalAkhir, setTanggalAkhir] = useState(null);
    const [telp, setTelp] = useState(""); //ok
    const [generateMultipleBillsProgressLong, setGenerateMultipleBillsProgressLong] = useState(0);
    const [rmsAlertMessage, setRmsAlertMessage] = useState("Mohon isi inputan yang masih kosong");
    const obj = {
        "biaya": biaya, //ok
        "blok": blok, //ok
        "email": email, //ok
        "hp": hp,//ok
        "jenis": jenis,//ok
        "no_kk": noKk,//ok
        "no_rumah": noRumah, //ok
        "no_tagihan": nomorTagihan, //ok
        "kelompok_tagihan": kelompokTagihan,
        "status_kelompok_tagihan": statusKelompokTagihan,
        "sisa": sisa, //ok
        "sudahLunas": sudahLunas,//ok
        "sudah_dibayar": sudahDibayar,//ok
        "tanggal_aktif": tanggalAktif,//ok
        "tanggal_dibayar": tanggalDibayar,
        "tanggal_dibuat": tanggalAktif, //change later
        "telp": telp
    }
    const [
        submitAction,
        isSuccessCreatingTagihanShow,
        setIsSuccessCreatingTagihanShow
    ] = useInputForm('tagihan');
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
    const bloks =  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((alphabet) => { return { "text": alphabet, "value": alphabet } });
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [isAlertShown, setIsAlertShown, validateInput] = useInputValidation();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    useEffect(() => {
        const getData = async () => {
            await b_getData([]);
            await k_getData([]);
        }
        getData();
    }, [])
    const generateMultipleBills = async () => {
        //individual bill object
        const obj = {
            "biaya": biaya, //ok
            "blok": blok, //ok
            "email": email, //ok
            "nomor-hp": hp,//ok
            "tagihan": jenis,//ok
            "nomor-kk": noKk,//ok
            "nomor_rumah": noRumah, //ok
            "nomor-tagihan": nomorTagihan, //ok
            "kelompok-tagihan": kelompokTagihan,
            "status-kelompok-tagihan": statusKelompokTagihan,
            "sisa": sisa, //ok
            "status-tagihan": sudahLunas,//ok
            "sudah-dibayar": sudahDibayar,//ok
            "tanggal-aktif": tanggalAktif,//ok
            "tanggal-dibayar": tanggalDibayar,
            "tanggal-dibuat": tanggalAktif, //change later
            "nomor-telpon": telp
        }
        //invoice obj
        const invObj = {
            "nomor-faktur" : "",
            "bills" : [{
                "id" : 1,
                "name" : "test"
            },{
                "id" : 2,
                "name" : "test2"
            },{
                "id" : 3,
                "name" : "test3"
            }],
        }
        //generate multiple bills
        if (k_data.length == 0 || b_data.length == 0) {
            setRmsAlertMessage(`Tidak ada data ${k_data.length === 0 && b_data.length === 0 ? 'kk dan tagihan' : k_data.length === 0 ? 'kk' : 'tagihan'}`);
            setIsAlertShown(true);
            return;
        } else {
            console.log("generating multiple bills...");
            let progressCounter = 0;
            let totalDataLength = k_data.length * b_data.length;
            let step = 100 / totalDataLength;
            for (var i = 0; i < k_data.length; i++) {
                for (var j = 0; j < b_data.length; j++) {
                    //input tagihan j untuk kk i
                    console.log(`input tagihan ${j} untuk kk ${i}`);
                    //console.log(`b_data[${j}]`, JSON.stringify(b_data[j]));
                    obj["biaya"] = b_data[j].biaya === undefined ? "undefined" : b_data[j].biaya;
                    obj["blok"] = k_data[i].blok === undefined ? "undefined" : k_data[i].blok;
                    obj["email"] = k_data[i].email === undefined ? "undefined" : k_data[i].email;
                    obj["tagihan"] = b_data[j].jenis === undefined ? "undefined" : b_data[j].jenis;
                    obj["nomor-kk"] = k_data[i].no_kk === undefined ? "undefined" : k_data[i].no_kk;
                    obj["nomor_rumah"] = k_data[i].no_rumah === undefined ? "undefined" : k_data[i].no_rumah;
                    obj["nomor-tagihan"] = md5(k_data[i].no_kk + "" + b_data[j].biaya + "" + tanggalAktif);
                    obj["sisa"] = b_data[j].biaya === undefined ? "undefined" : b_data[j].biaya;
                    obj["status-tagihan"] = false;
                    obj["kelompok-tagihan"] = md5(k_data[i].no_kk + "" + tanggalAktif);
                    //here add script to upload data to faktur collection
                    invObj["nomor-faktur"] = obj["kelompok-tagihan"];
                    obj["status-kelompok-tagihan"] = false;
                    obj["sudah-dibayar"] = 0;
                    obj["tanggal-aktif"] = getTime(tanggalAktif);
                    obj["tanggal-dibayar"] = getTime(tanggalDibayar);
                    obj["tanggal-dibuat"] = Date.now();
                    obj["nomor-telpon"] = k_data[i].telp === undefined ? "undefined" : k_data[i].telp;
                    obj["nomor-hp"] = k_data[i].hp=== undefined ? "undefined" : k_data[i].hp;
                    try {
                        await t_addData(obj);
                        await f_addData(invObj);
                        setGenerateMultipleBillsProgressLong(progressCounter);
                    } catch (error) {
                        setRmsAlertMessage("Error");
                        setIsAlertShown(true);
                    }
                    progressCounter += step;
                }
            }
        }
    }
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTabIndex} onChange={(event, newValue) => { setActiveTabIndex(newValue) }} aria-label="basic tabs example">
                        <Tab label="Manual" {...a11yProps(0)} />
                        <Tab label="Otomatis" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                {/** buat tagihan manual */}
                <Box sx={{ padding: "10px", display: activeTabIndex == 0 ? "default" : "none" }}>
                    <Stack direction={"column"}>
                        <RMSAlert isOpen={isAlertShown} message={rmsAlertMessage} setIsOpen={() => { setIsAlertShown(false) }} />
                        <RMSTextField isError={biaya.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Biaya"} helperText={"Masukkan Biaya"} value={biaya} handleChange={(value) => setBiaya(value)} />
                        <RMSSelect isError={blok.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} items={bloks} label={"Blok"} helperText={"Masukkan Blok"} value={blok} handleChange={(value) => setBlok(value)} />
                        <RMSTextField isError={email.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="email" label={"Email"} helperText={"Masukkan Email"} value={email} handleChange={(value) => setEmail(value)} />
                        <RMSTextField isError={hp.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"HP"} helperText={"Masukkan Nomor HP"} value={hp} handleChange={(value) => setHp(value)} />
                        <RMSSelect isError={jenis.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} items={jenisTagihan} label={"Jenis"} helperText={"Masukkan Jenis"} value={jenis} handleChange={(value) => setJenis(value)} />
                        <RMSTextField isError={noKk.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor KK"} helperText={"Masukkan Nomor KK"} value={noKk} handleChange={(value) => setNoKk(value)} />
                        <RMSTextField isError={noRumah.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={noRumah} handleChange={(value) => setNoRumah(value)} />
                        <RMSTextField isError={nomorTagihan.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Tagihan"} helperText={"Masukkan Nomor Tagihan"} value={nomorTagihan} handleChange={(value) => setNomorTagihan(value)} />
                        <RMSTextField isError={sisa.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Sisa"} helperText={"Sisa Pembayaran"} value={sisa} handleChange={(value) => setSisa(value)} />
                        <RMSSelect isError={sudahLunas.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} items={statusTagihan} label={"Status Tagihan"} helperText={"Masukkan Status Tagihan"} value={sudahLunas} handleChange={(value) => setSudahLunas(value)} />
                        <RMSTextField isError={sudahDibayar.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Sudah Dibayar"} helperText={"Jumlah Sudah Dibayar"} value={sudahDibayar} handleChange={(value) => setSudahDibayar(value)} />
                        <RMSDatePicker isError={tanggalAktif.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Aktif"} helperText={"Tanggal tagihan"} value={tanggalAktif} handleChange={(value) => setTanggalAktif(getTime(value))} />
                        <RMSDatePicker isError={tanggalDibuat.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Dibuat"} helperText={"Tanggal Tagihan Dibuat"} value={tanggalDibuat} handleChange={(value) => setTanggalDibuat(value)} />
                        <RMSDatePicker isError={tanggalDibayar.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Dibayar"} helperText={"Tanggal Pembayaran"} value={tanggalDibayar} handleChange={(value) => setTanggalDibayar(value)} />
                        <RMSTextField isError={telp.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Nomor Telp"} helperText={"Masukkan Nomor Telp"} value={telp} handleChange={(value) => setTelp(value)} />
                        <RMSTextField isError={kelompokTagihan.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="text" label={"Kelompok Tagihan"} helperText={"Masukkan Kelompok Tagihan"} value={kelompokTagihan} handleChange={(value) => setKelompokTagihan(value)} />
                        {/** <RMSTextField isError={statusKelompokTagihan.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Nomor Telp"} helperText={"Masukkan Nomor Telp"} value={telp} handleChange={(value) => setTelp(value)} /> */}
                        <Button sx={{ margin: "5px" }} variant={"contained"} onClick={async () => {
                            if (validateInput([
                                biaya, //ok
                                blok, //ok
                                email, //ok
                                hp,//ok
                                jenis,//ok
                                noKk,//ok
                                noRumah, //ok
                                nomorTagihan, //ok
                                sisa, //ok
                                sudahLunas,//ok
                                sudahDibayar,//ok
                                tanggalAktif,//ok
                                tanggalDibayar,
                                tanggalAktif, //change later
                                telp
                            ])) {
                                try {
                                    await submitAction(obj);
                                    setBiaya("");
                                    setBlok("");
                                    setEmail("");
                                    setHp("");
                                    setJenis("");
                                    setNoKk("");
                                    setNoRumah("");
                                    setNomorTagihan("");
                                    setSisa("");
                                    setSudahLunas(""); //ok
                                    setSudahDibayar(""); //ok
                                    setTanggalAktif("");
                                    setTanggalDibayar(""); //ok
                                    setTanggalDibuat(""); //ok
                                    setTelp("");
                                    setIsSuccessCreatingTagihanShow(true);
                                } catch (error) {
                                    console.log(error.message);
                                }
                            }
                        }}>Buat Tagihan</Button>
                    </Stack>
                </Box>
                {/** buat tagihan otomatis */}
                <Box sx={{ padding: "10px", display: activeTabIndex == 1 ? "default" : "none" }}>
                    <Stack direction={"column"}>
                        <RMSAlert isOpen={isAlertShown} message={rmsAlertMessage} setIsOpen={() => { setIsAlertShown(false) }} />
                        <RMSDatePicker isError={tanggalAktif.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Aktif"} helperText={"Tanggal dimana tagihan berlaku."} value={tanggalAktif} handleChange={(value) => setTanggalAktif(value)} />
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ display: 'inline-flex' }}>
                                <CircularProgressWithLabel value={generateMultipleBillsProgressLong} />
                            </Box>
                        </Box>
                        <Button sx={{ margin: "5px" }} variant={"contained"}
                            onClick={
                                async () => {
                                    //alert(tanggalMulai);
                                    if (tanggalAktif == null) {
                                        setRmsAlertMessage("Mohon isi inputan tanggal");
                                        setIsAlertShown(true);
                                    } else if (tanggalMulai > tanggalAkhir) {
                                        setRmsAlertMessage("input tanggal invalid");
                                        setIsAlertShown(true);
                                    } else {
                                        await generateMultipleBills();
                                        setIsSuccessCreatingTagihanShow(true);
                                    }
                                }
                            }
                        >Buat Tagihan</Button>
                    </Stack>
                </Box>
            </Paper>
            <Snackbar open={isSuccessCreatingTagihanShow} autoHideDuration={2000} onClose={() => { setIsSuccessCreatingTagihanShow(false) }}>
                <Alert onClose={() => { setIsSuccessCreatingTagihanShow(false) }} severity="success" sx={{ width: '100%' }}>
                    Tagihan berhasil dibuat.
                </Alert>
            </Snackbar>
        </Box >
    )
}

export default BuatTagihan;

/**
 * [
        {
            "text": "Tanggal Mulai",
            "helperText": "Mulai dari tanggal",
            "value": "tanggal-awal", //select option stuff
            "propertyValue": [], //actual state value
            "type": "date",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(getTime(newValue), index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Tanggal Akhir",
            "helperText": "Sampai dengan tanggal",
            "value": "tanggal-akhir", //select option stuff
            "propertyValue": [], //actual state value
            "type": "date",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(getTime(newValue), index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
    ]
 */