import React, { useState, useEffect } from 'react';
import { auth } from '../index';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
//redux
import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";
//material-ui
import { Snackbar, Alert, Box, Grid, Stack, Typography, Button, LinearProgress } from '@mui/material';
//images
import Dots from '../images/dots.jpg';
import RMSTextField from '../components/RMSTextField';
import Work from '../images/work.svg';
//db
import { db } from '../index';
import { collection, addDoc, setDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
//rms
import RMSSnackbar from '../components/RMSSnackbar';
import useSnackbar from '../hooks/useSnackbar';

const RMSSignUp = (props) => {
    //snackbar state
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    //function
    const ic_af_addUser = async (user) => {
        let obj = {
            'uid': user.uid,
            'displayName': user.displayName,
            'name': name,
            'email': user.email,
            'photoURL': user.photoURL,
            'role': 0,
        }
        try {
            await setDoc(doc(collection(db, "user"), user.uid), obj);
            // ...
            ic_st_setIsLoading(false);
            setMessage('User berhasil terdaftar');
            setIsSnackbarShown(true);
            setTimeout(() => {
                updateCurrentLoginStatus(true);
            }, 2000)
        } catch (err) {
            console.log(err.message);
            ic_st_setIsLoading(false);
            setMessage(err.message);
            setIsSnackbarShown(true);
        }
    }
    //redux 
    const ic_rd_dispatch = useDispatch();
    const { updateCurrentLoginStatus } = bindActionCreators(actionCreators, ic_rd_dispatch);
    const ic_sf_createUser = (email, password) => {
        ic_st_setIsLoading(true);
        if (name.length === 0) {
            h_sf_showSnackbar('Mohon isi nama Anda..', 'error');
            ic_st_setIsLoading(false);
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('sign up user credential', user);
                ic_af_addUser(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                updateCurrentLoginStatus(false);
                console.log(errorMessage);
                if (errorCode === 'auth/email-already-in-use') {
                    setMessage('Email ini sudah pernah terdaftar, harap gunakan email yang lain.');
                } else if (errorCode === 'auth/invalid-email') {
                    setMessage('Alamat email tidak valid. Harap periksa kembali alamat email yang anda input.');
                } else {
                    setMessage(errorMessage + ' | ' + error.code);
                }
                setIsSnackbarShown(true);
                ic_st_setIsLoading(false);
            });
    }
    const ic_sf_signInExistingUser = (email, password) => {
        ic_st_setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/invalid-email') {
                    setMessage('Alamat email tidak valid. Harap periksa kembali alamat email yang anda input.');
                } else if (errorCode === 'auth/wrong-password') {
                    setMessage('Alamat email atau password tidak valid');
                } else {
                    setMessage(errorMessage + ' | ' + error.code);
                }
                setIsSnackbarShown(true);
                ic_st_setIsLoading(false);
            });
    }
    const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
    const [ic_st_isLoginPage, ic_st_setIsLoginPage] = useState(false);
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [name, setName] = useState([]);
    const [isSnackbarShown, setIsSnackbarShown] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        return () => {
            console.log('rmssignup unmounted')
        };
    }, [])
    return (
        <Box sx={{ display: props.display }}>
            <LinearProgress color="secondary" sx={{ display: ic_st_isLoading ? 'default' : 'none' }} />
            <Snackbar open={isSnackbarShown} autoHideDuration={2000} onClose={() => { setIsSnackbarShown(false) }}>
                <Alert onClose={() => { setIsSnackbarShown(false) }} severity="error" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Grid container>
                <Grid item sm={12} md={8} sx={{ display: { xs: 'block', sm: 'none', md: 'block' } }}>
                    <div alt={''} style={{ backgroundSize: 'cover', backgroundImage: `url(${Dots})`, height: '100vh' }} >

                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={4} sx={{ height: '100vh', backgroundColor: '#ffffff' }}>
                    <Stack sx={{ padding: 3, textAlign: 'center' }} spacing={2}>
                        <Typography variant="h4" gutterBottom component="div">
                            {ic_st_isLoginPage ? 'Masuk' : 'Daftar'}
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                            <img src={Work} alt="" style={{ marginTop: '10px', marginBottom: '10px', width: '45%', height: 'auto' }} />
                        </Box>
                        <Typography variant="subtitle1" gutterBottom component="div">
                            {
                                ic_st_isLoginPage ?
                                    'Masuk menggunakan email yang sudah terdaftar.'
                                    :
                                    'Daftar menggunakan email.'
                            }
                        </Typography>
                        {
                            ic_st_isLoginPage ? <></> : <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="text" label={"Nama lengkap"} helperText={"Nama lengkap anda"} value={name} handleChange={(value) => setName(value)} />
                        }
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="text" label={"Email"} helperText={"Masukkan Email"} value={email} handleChange={(value) => setEmail(value)} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={"default"} type="password" label={"Password"} helperText={"Masukkan Password"} value={password} handleChange={(value) => setPassword(value)} />
                        <Button sx={{ margin: "5px" }} variant={"contained"} onClick={ic_st_isLoginPage ? () => { ic_sf_signInExistingUser(email, password) } : () => ic_sf_createUser(email, password)} disabled={ic_st_isLoading} >{ic_st_isLoginPage ? 'Login' : 'Sign Up'} </Button>
                        {
                            ic_st_isLoginPage ?
                                <Typography onClick={() => ic_st_setIsLoginPage(false)} variant="subtitle1" gutterBottom component="div">Belum punya akun ? <span style={{ color: 'blue' }}>daftar</span></Typography>
                                :
                                <Typography onClick={() => ic_st_setIsLoginPage(true)} variant="subtitle1" gutterBottom component="div">Sudah punya akun ? <span style={{ color: 'blue' }}>login</span></Typography>
                        }
                    </Stack>
                </Grid>
            </Grid>
            <RMSSnackbar
                isOpen={h_st_isSnackbarShown}
                message={h_st_message}
                severity={h_st_severity}
                handleClose={h_sf_closeSnackbar}
            />
        </Box>
    )
}

export default RMSSignUp;