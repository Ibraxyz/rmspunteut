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
import { getSeparatedDate } from "../rms-utility/rms-utility";
import { connectFirestoreEmulator } from "@firebase/firestore";

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: props.isVisible ? 'inline-flex' : 'none' }}>
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

const RMSMakeInvoice = (props) => {
    const nowDate = Date.now();
    //const [b_isLoading, b_data, b_addData, b_getData, b_editData, b_deleteData] = useDataOperations('biaya');
    const [k_isLoading, k_data, k_addData, k_getData, k_editData, k_deleteData] = useDataOperations('kk');
    const [t_isLoading, t_data, t_addData, t_getData, t_editData, t_deleteData] = useDataOperations('tagihan');
    const [i_isLoading, i_data, i_addData, i_getData, i_editData, i_deleteData] = useDataOperations('invoice');
    const [isCircularProgressShown, setIsCircularProgressShown] = useState(false);
    const [ic_st_isProgressShown, ic_st_setIsProgressShown] = useState(false);
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
    ] = useInputForm('invoice');
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
    const bloks = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((alphabet) => { return { "text": alphabet, "value": alphabet } });
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
            //await b_getData([]);
            await k_getData([]);
        }
        getData();
    }, [])
    useEffect(() => {
        console.log('tanggal aktif adalah', tanggalAktif);
        console.log('tanggal aktif (getTime) adalah', getTime(tanggalAktif));
        try {
            const dateAktif = getSeparatedDate(tanggalAktif)
            console.log(JSON.stringify(dateAktif))
        } catch (err) {
            console.log(err.message);
        }
    }, [tanggalAktif])
    const generateMultipleBills = async () => {
        ic_st_setIsProgressShown(true);
        //tanggal aktif
        const activeDate = getSeparatedDate(tanggalAktif); //format tanggal aktif adalah Fri Dec 24 2021 12:13:51 GMT+0700 (Western Indonesia Time) bukan timestamp dlm bentuk ms
        //individual bill object
        const obj = {}
        //generate multiple bills
        if (k_data.length == 0) {
            setRmsAlertMessage(`Tidak ada data ${k_data.length === 0 ? 'kk dan tagihan' : k_data.length === 0 ? 'kk' : 'tagihan'}`);
            setIsAlertShown(true);
            return;
        } else {
            console.log("generating multiple bills...");
            let progressCounter = 0;
            let totalDataLength = k_data.length;
            let step = 100 / totalDataLength;
            for (var i = 0; i < k_data.length; i++) { //iterate over kk
                if (k_data['biaya-bulanan'] === 'TMB' || k_data['biaya-bulanan'] === 'RK' || k_data['biaya-bulanan'] === 'EMPTY') {
                    //do nothing
                    console.log('ikk is RK/TMB/EMPTY so not created..');
                    progressCounter += step;
                    setGenerateMultipleBillsProgressLong(progressCounter);
                } else {
                    let totalBiaya = k_data[i]['biaya-bulanan'];
                    let namaDaftarTagihan = [k_data[i]['nama-biaya-bulanan']];
                    let tagihanObject = [
                        {
                            biaya: totalBiaya,
                            id: k_data[i]['id-biaya-bulanan'],
                            jenis: `${k_data[i]['nama-biaya-bulanan']} | ${k_data[i]['kategori-bangunan']} ( x 1 )`,
                            qty: "1"
                        }
                    ]
                    //---------------------------------------------------------------------------------------------------
                    obj["subtotal"] = totalBiaya;
                    obj["potongan"] = 0;
                    obj["biaya"] = totalBiaya;
                    obj['banyak-biaya'] = 1;
                    obj["blok"] = k_data[i].blok === undefined ? "undefined" : k_data[i].blok;
                    obj["email"] = k_data[i].email === undefined ? "undefined" : k_data[i].email;
                    obj["tagihan"] = tagihanObject;
                    obj["nama-daftar-tagihan"] = namaDaftarTagihan;
                    obj["nomor-kk"] = k_data[i].no_kk === undefined ? "undefined" : k_data[i].no_kk;
                    obj["nomor-rumah"] = k_data[i].no_rumah === undefined ? "undefined" : k_data[i].no_rumah;
                    obj["sisa"] = totalBiaya;
                    obj["status-invoice"] = false;
                    obj["sudah-dibayar"] = 0;
                    obj["tanggal-aktif"] = getTime(tanggalAktif);
                    obj["tanggal-dibayar"] = getTime(tanggalDibayar);
                    obj["tanggal-dibuat"] = Date.now();
                    obj["nomor-telpon"] = k_data[i].telp === undefined ? "undefined" : k_data[i].telp;
                    obj["nomor-hp"] = k_data[i].hp === undefined ? "undefined" : k_data[i].hp;
                    obj["kolektor"] = '-';
                    obj['bulan'] = activeDate.month;
                    obj['tahun'] = activeDate.year;
                    obj['hari'] = activeDate.day;
                    obj['kategori'] = 'bulanan';
                    //obj['bulan'] = nowDa
                    try {
                        await i_addData(obj);
                        progressCounter += step;
                        setGenerateMultipleBillsProgressLong(progressCounter);
                    } catch (error) {
                        setRmsAlertMessage("Error");
                        setIsAlertShown(true);
                    }
                }
            }
            ic_st_setIsProgressShown(false);
            setGenerateMultipleBillsProgressLong(0);
        }
    }
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                {/** buat tagihan otomatis */}
                <Box sx={{ padding: "10px", display: "default" }}>
                    <Stack direction={"column"}>
                        <RMSAlert isOpen={isAlertShown} message={rmsAlertMessage} setIsOpen={() => { setIsAlertShown(false) }} />
                        <RMSDatePicker isError={tanggalAktif.length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Aktif"} helperText={"Tanggal dimana tagihan berlaku."} value={tanggalAktif} handleChange={(value) => {
                            setTanggalAktif(value)
                        }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ display: 'inline-flex' }}>
                                <CircularProgressWithLabel value={generateMultipleBillsProgressLong} isVisible={ic_st_isProgressShown} />
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
                    Invoice berhasil dibuat.
                </Alert>
            </Snackbar>
        </Box >
    )
}
export default RMSMakeInvoice;