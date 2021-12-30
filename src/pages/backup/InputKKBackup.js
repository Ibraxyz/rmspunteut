/**
import React, { useState } from "react";

import { Box, Paper, Stack, Button, Snackbar, Alert } from "@mui/material";
import RMSTextField from "../components/RMSTextField";
import RMSSelect from "../components/RMSSelect";
import RMSDatePicker from "../components/RMSDatePicker";
import useDataOperations from "../hooks/useDataOperations";
import usePathUpdater from "../hooks/usePathUpdater";
import RMSAlert from "../components/RMSAlert";

const InputKK = (props) => {
    //redux 
    const [r_state] = usePathUpdater("Input KK");
    const [isLoading, data, addData, getData, editData, deleteData] = useDataOperations("kk");
    const [blok, setBlok] = useState("");
    const [email, setEmail] = useState("");
    const [hp, setHp] = useState("");
    const [noKk, setNoKk] = useState("");
    const [noRumah, setNoRumah] = useState("");
    const [tanggalBergabung, setTanggalBergabung] = useState(""); //ok
    const [telp, setTelp] = useState(""); //ok
    const [statusAktif, setStatusAktif] = useState("");
    const [isFilterDangerALertShow, setIsFilterDangerAlertShow] = useState(false);
    const obj = {
        "no_kk": noKk,//ok
        "blok": blok, //ok
        "no_rumah": noRumah,
        "telp": telp,
        "hp": hp,
        "email": email,
        "status": statusAktif,
        "tanggal_bergabung": tanggalBergabung
    }
    //alert visibility state
    const [isSuccessCreatingTagihanShow, setIsSuccessCreatingTagihanShow] = useState(false);
    //constant
    const statusKeaktifan = [
        {
            "text": "Aktif",
            "value": true
        },
        {
            "text": "Tidak Aktif",
            "value": true
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
    const submitAction = async () => {
        setIsFilterDangerAlertShow(false);
        if (
            noKk.length === 0
            || noRumah.length === 0
            || blok.length === 0
            || email.length === 0
            || hp.length === 0
            || telp.length === 0
            || statusAktif.length === 0) {
            setIsFilterDangerAlertShow(true);
            return
        } else {
            await addData(obj);
            //reset input value
            setBlok("");
            setEmail("");
            setHp("");
            setNoKk("");
            setNoRumah("");
            setTanggalBergabung(""); //ok
            setTelp(""); //ok
            setStatusAktif("");
            //show success message
            setIsSuccessCreatingTagihanShow(true);
        }
    }
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                <Box sx={{ padding: "10px" }}>
                    <Stack direction={"column"}>
                        <RMSAlert isOpen={isFilterDangerALertShow} message={"Mohon isi inputan yang masih kosong"} setIsOpen={() => { setIsFilterDangerAlertShow(false) }} />
                        <RMSTextField isError={noKk.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor KK"} helperText={"Masukkan Nomor KK"} value={noKk} handleChange={(value) => setNoKk(value)} />
                        <RMSSelect isError={blok.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} items={bloks} label={"Blok"} helperText={"Masukkan Blok"} value={blok} handleChange={(value) => setBlok(value)} />
                        <RMSTextField isError={noRumah.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={noRumah} handleChange={(value) => setNoRumah(value)} />
                        <RMSTextField isError={email.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} label={"Email"} helperText={"Masukkan Email"} value={email} handleChange={(value) => setEmail(value)} />
                        <RMSTextField isError={hp.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} label={"HP"} helperText={"Masukkan Nomor HP"} value={hp} handleChange={(value) => setHp(value)} />
                        <RMSDatePicker isError={tanggalBergabung.length === 0 && isFilterDangerALertShow ? true : false} isRequired={false} displayFilter={"default"} label={"Tanggal Bergabung"} helperText={"Tanggal Bergabung"} value={tanggalBergabung} handleChange={(value) => setTanggalBergabung(value)} />
                        <RMSTextField isError={telp.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Telp"} helperText={"Masukkan Nomor Telp"} value={telp} handleChange={(value) => setTelp(value)} />
                        <RMSSelect isError={statusAktif.length === 0 && isFilterDangerALertShow ? true : false} isRequired={true} displayFilter={"default"} items={statusKeaktifan} label={"Status"} helperText={"Masukkan Status"} value={statusAktif} handleChange={(value) => setStatusAktif(value)} />
                        <Button sx={{ margin: "5px" }} variant={"contained"} onClick={async () => {
                            await submitAction();
                        }}>Input KK</Button>
                    </Stack>
                </Box>
            </Paper>
            <Snackbar open={isSuccessCreatingTagihanShow} autoHideDuration={2000} onClose={() => { }}>
                <Alert onClose={() => { setIsSuccessCreatingTagihanShow(false)}} severity="success" sx={{ width: '100%' }}>
                    KK berhasil diinput.
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default InputKK;

*/