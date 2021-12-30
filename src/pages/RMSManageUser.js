import React, { useState, useEffect } from 'react';
//material ui
import { Paper, Typography, Box, LinearProgress, Divider, Chip, Stack, Grid, Button, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
//db
import { db } from '../index';
//firestore
import { doc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
//rms
import RMSSelect from '../components/RMSSelect';
import RMSSnackbar from '../components/RMSSnackbar';
//hooks
import useSnackbar from '../hooks/useSnackbar';

const top_determineRole = (role) => {
    let determinedRoleTitle = '-';
    switch (role) {
        case 0:
            determinedRoleTitle = 'Baru Daftar';
            break;
        case 1:
            determinedRoleTitle = 'Kolektor';
            break;
        case 2:
            determinedRoleTitle = 'Admin';
            break;
        case 3:
            determinedRoleTitle = 'Super Admin';
            break;
        default:
            break;
    }
    return determinedRoleTitle;
}

const renderButton = (params) => {
    return (
        <Box>
            <RMSSelect handleChange={(newVal) => { params.value.handleChange(newVal) }} value={params.value.value} items={[0, 1, 2, 3].map((i) => { return { 'text': top_determineRole(i), 'value': i } })} />
        </Box>
    )
}

const top_columns = [
    { field: 'name', headerName: 'Nama', width: 150 },
    { field: 'role', headerName: 'Role', width: 200, renderCell: renderButton },
];

const RMSManageUser = (props) => {
    const [ic_st_user, ic_st_setUser] = useState([]);
    const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    useEffect(() => {
        //load all user
        const getUsers = async () => {
            try {
                ic_st_setIsLoading(true);
                const q = query(collection(db, "user")); //, where("role", "==", 0)
                const users = await getDocs(q);
                const userList = [];
                users.forEach((usr) => {
                    userList.push({
                        id: usr.id,
                        name: usr.data().name,
                        role: {
                            value: usr.data().role,
                            handleChange: (newVal) => {
                                const updateUserRole = async () => {
                                    try {
                                        await updateDoc(doc(db, 'user', usr.id), {
                                            role: newVal
                                        })
                                        h_sf_showSnackbar(`Role untuk ${usr.data().name} telah diubah menjadi ${top_determineRole(newVal)}`,'success')
                                        //refresh to get updated data
                                        getUsers();
                                    } catch (err) {
                                        console.log(err.message);
                                        h_sf_showSnackbar(err.message,'error')
                                    }
                                }
                                updateUserRole();
                            }
                        },
                    });
                });
                ic_st_setUser(userList);
                ic_st_setIsLoading(false);
            } catch (err) {
                console.log(err.message);
                ic_st_setIsLoading(false);
            }
        }
        getUsers();
    }, [])
    return (
        <Paper>
            <LinearProgress color="secondary" sx={{ display: ic_st_isLoading ? 'default' : 'none' }} />
            <Box sx={{ padding: '10px' }}>
                <Typography variant={'subtitle2'} content={'div'}>Pengaturan User</Typography>
            </Box>
            <Divider />
            <Box sx={{ padding: '10px', height: '600px' }}>
                <DataGrid rows={ic_st_user} columns={top_columns} sx={{ minHeight: '400px', height: '100%' }} />
            </Box>
            {/** snack bar */}
            <RMSSnackbar
                isOpen={h_st_isSnackbarShown}
                handleClose={() => h_sf_closeSnackbar()}
                severity={h_st_severity}
                message={h_st_message} />
        </Paper>
    )
}

export default RMSManageUser;