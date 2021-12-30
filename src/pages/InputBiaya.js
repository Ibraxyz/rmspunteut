import React, { useState, useEffect } from "react";

import { Box, Paper, Stack, Button, Snackbar, Alert } from "@mui/material";
import RMSTextField from "../components/RMSTextField";
import RMSAlert from "../components/RMSAlert";
import useDataOperations from "../hooks/useDataOperations";
//redux
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";
//firestore
import { addDoc, doc, setDoc, collection } from "firebase/firestore";
//db
import { db } from '../index';

const InputBiaya = (props) => {
    //reduxs
    const r_currentPathState = useSelector((state) => state.currentPath);
    const dispatch = useDispatch();
    const { updateCurrentPath } = bindActionCreators(actionCreators, dispatch);
    //hooks
    const [isLoading, data, addData, getData, editData, deleteData] = useDataOperations("biaya");
    //effects
    useEffect(() => {
        updateCurrentPath("Input Biaya Custom");
    }, [])
    //state
    const [biaya, setBiaya] = useState(null);
    const [jenis, setJenis] = useState(null);
    const [isFilterDangerALertShow, setIsFilterDangerAlertShow] = useState(false);
    //objects
    const obj = {
        "jenis": jenis,
        "biaya": biaya
    }
    //alert visibility state
    const [isSuccessCreatingTagihanShow, setIsSuccessCreatingTagihanShow] = useState(false);
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                <Box sx={{ padding: "10px" }}>
                    <Stack direction={"column"}>
                        <RMSAlert isOpen={isFilterDangerALertShow} message={"Mohon isi inputan yang masih kosong"} setIsOpen={() => { setIsFilterDangerAlertShow(false) }} />
                        <RMSTextField isError={((jenis === null || jenis.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={"default"} label={"Jenis"} helperText={"Masukkan Nama Biaya"} value={jenis} handleChange={(value) => setJenis(value)} />
                        <RMSTextField isError={false} isRequired={true} type="number" displayFilter={"default"} label={"Biaya"} helperText={"Masukkan Biaya"} value={biaya} handleChange={(value) => setBiaya(value)} type={'number'} />
                        <Button sx={{ margin: "5px" }} variant={"contained"} onClick={async () => {
                            setIsFilterDangerAlertShow(false);
                            if (
                                (jenis === null || jenis.length === 0) || //ok
                                (biaya === null || biaya.length === 0)
                            ) {
                                setIsFilterDangerAlertShow(true);
                                return;
                            } else {
                                //await addData(obj);
                                try {
                                    await addDoc(collection(db, "biaya"), obj);
                                    setIsSuccessCreatingTagihanShow(true);
                                    setIsFilterDangerAlertShow(false);
                                    setJenis("");
                                    setBiaya("");
                                }catch(err){
                                    console.log(err.message);
                                    alert(err.message);
                                }
                            }
                        }}>Simpan Biaya</Button>
                    </Stack>
                </Box>
            </Paper>
            <Snackbar open={isSuccessCreatingTagihanShow} autoHideDuration={2000} onClose={() => { setIsSuccessCreatingTagihanShow(false) }}>
                <Alert onClose={() => { setIsSuccessCreatingTagihanShow(false) }} severity="success" sx={{ width: '100%' }}>
                    Biaya berhasil disimpan.
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default InputBiaya;