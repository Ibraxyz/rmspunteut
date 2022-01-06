import React, { useState, useEfect, useEffect } from 'react';
import { Paper, Divider, Box, Typography, Button, LinearProgress, Stack, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import useGroupedSelect from '../hooks/useGroupedSelect';
import RMSGroupedSelect from '../components/RMSGroupedSelect';
import RMSTextField from '../components/RMSTextField';
import RMSSnackbar from '../components/RMSSnackbar';
import useSnackbar from '../hooks/useSnackbar';
import { db } from '../index';
import { doc, updateDoc, collection, query, getDocs, where, deleteDoc } from 'firebase/firestore';
import RMSCleanTable from '../components/RMSCleanTable';

const RMSCheckData = (props) => {
    const tableHead = ['blok', 'nomor-rumah', 'biaya', 'aksi'];
    const [ic_st_an, ic_st_aazz, ic_st_tasbiII] = useGroupedSelect();
    const [ic_st_blok, ic_st_setBlok] = useState(null);
    const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    const [ic_st_editedObj, ic_st_setEditedObj] = useState({});
    const [ic_st_rows, ic_st_setRows] = useState([]);
    const [ic_st_isEditOpen, ic_st_setIsEditOpen] = useState(false);
    const [ic_st_currentStagedId, ic_st_setCurrentStagedId] = useState([]);
    const tampilkanData = async () => {
        if (ic_st_blok === null) {
            h_sf_showSnackbar('Mohon pilih blok yang akan ditampilkan.', 'error');
            return;
        } else {
            ic_st_setIsLoading(true);
            try {
                const ref = collection(db, 'invoice');
                const conditions = [
                    where('biaya', '==', 'B'),
                ]; 
                const bloks = await getDocs(query(ref, ...conditions));
                const arr = [];
                bloks.forEach((doc) => {
                    arr.push({ id: doc.id, ...doc.data() });
                });
                const arrWithAction = [];
                arr.forEach((ar) => {
                    arrWithAction.push({
                        ...ar,
                        edit: () => {
                            //alert(`edit ${ar.id}`)
                            //ic_st_setEditedObj(ar)
                            ic_st_setCurrentStagedId(ar.id);
                            ic_st_setEditedObj({
                                "nomor-rumah": ar['nomor-rumah'],
                                "biaya": ar['biaya']
                            })
                            ic_st_setIsEditOpen(true);
                        },
                        hapus: () => {
                            //ic_st_setCurrentStagedId(ar.id);
                            deleteData(ar.id);
                        }
                    });
                })
                ic_st_setRows(arrWithAction);
                ic_st_setIsLoading(false);
            } catch (err) {
                h_sf_showSnackbar(err.message, 'error');
                console.log(err.message);
                ic_st_setIsLoading(false);
            }
        }
    }
    const deleteData = async (id) => {
        try {
            await deleteDoc(doc(db, `kk/${id}`));
            await tampilkanData();
            h_sf_showSnackbar(`Data dengan id ${id} berhasil dihapus`, 'success');
            ic_st_setIsEditOpen(false);
        } catch (err) {
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsEditOpen(false);
        }
    }
    const updateData = async (id, obj) => {
        let isZeroLengthAvailable = false;
        Object.keys(obj).forEach((o) => {
            if (obj[o] === "") {
                isZeroLengthAvailable = true;
            }
        })
        if (isZeroLengthAvailable === true) {
            h_sf_showSnackbar('Input tidak boleh ada yang kosong');
            return;
        }
        try {
            await updateDoc(doc(db, `invoice/${id}`), obj);
            await tampilkanData();
            h_sf_showSnackbar(`Data dengan id ${id} berhasil diupdate`, 'success');
            ic_st_setIsEditOpen(false);
        } catch (err) {
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsEditOpen(false);
        }
    }
    //check edited obj
    useEffect(() => {
        console.log('ic_st_editedObj', JSON.stringify(ic_st_editedObj));
    }, [ic_st_editedObj]);
    return (
        <Box>
            {
                ic_st_isLoading ?
                    <LinearProgress /> : <></>
            }
            <Paper sx={{ marginBottom: "20px" }}>
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Filter KK</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} alignItems={'start'}>
                        <RMSGroupedSelect
                            aazz={ic_st_aazz}
                            an={ic_st_an}
                            tasbiII={ic_st_tasbiII}
                            handleChange={(value) => {
                                ic_st_setBlok(value);
                            }}
                        />
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button variant={'contained'} onClick={tampilkanData}>Tampilkan Data</Button>
                </Box>
            </Paper>
            <Paper>
                {
                    ic_st_isLoading ?
                        <LinearProgress /> : <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Detail KK</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    {
                        ic_st_isLoading ? '' :
                            <RMSCleanTable
                                tableHead={tableHead}
                                rows={ic_st_rows}
                            />
                    }
                </Box>
            </Paper>
            {/** snack bar */}
            <RMSSnackbar
                handleClose={h_sf_closeSnackbar}
                isOpen={h_st_isSnackbarShown}
                severity={h_st_severity}
                message={h_st_message}
            />
            {/** Edit Dialog */}
            <Dialog open={ic_st_isEditOpen}>
                <DialogTitle>Edit KK {ic_st_blok}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack>
                        {
                            tableHead.map((th) => {
                                if (th != 'aksi' && th != 'blok') {
                                    return (
                                        <RMSTextField isError={false} helperText={`Masukkan ${th}`} label={th} value={ic_st_editedObj[th]} handleChange={(v) => {
                                            let obj = { ...ic_st_editedObj };
                                            obj[th] = v;
                                            console.log(JSON.stringify(obj))
                                            ic_st_setEditedObj(obj);
                                        }} />
                                    )
                                }
                            })
                        }
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    {/** batal */}
                    <Button variant={'contained'} onClick={() => ic_st_setIsEditOpen(false)}>Batal</Button>
                    {/** edit */}
                    <Button variant={'outlined'} onClick={() => updateData(ic_st_currentStagedId, ic_st_editedObj)} disabled={ic_st_isLoading}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default RMSCheckData;