import './App.css';
import React, { useEffect, useState } from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import LihatTagihan from './pages/LihatTagihan';
import RMSBreadCrumbs from "./components/RMSBreadCrumbs";
import { Container, Snackbar } from "@mui/material";
import RMSTempDrawer from "./components/RMSTempDrawer";
import BuatTagihan from "./pages/BuatTagihan";
import Beranda from "./pages/Beranda";
import CetakKuitansi from "./pages/CetakKuitansi";
import LihatKK from "./pages/LihatKK";
import InputKK from "./pages/InputKK";
import InputBiaya from "./pages/InputBiaya";
import RMSSignUp from './pages/RMSSignUp';
//redux
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "./state/index";
//firebase auth
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
//firebase firestore
import { doc, getDoc, query, collection, where, getDocs, updateDoc, orderBy } from "firebase/firestore";
//db
import { db } from "./index";
//material ui
import { Paper, LinearProgress, Typography, Button, Box, Divider, Grid, Stack } from '@mui/material';
//rms
import RMSSnackbar from './components/RMSSnackbar';
//utililty
import { defineMonthName, formatRupiah, getSeparatedDate, createReport, createIkkReport } from './rms-utility/rms-utility';
//hooks
import useSnackbar from './hooks/useSnackbar';

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import LihatBiaya from './pages/LihatBiaya';
import RMSLihatInvoice from './pages/RMSLihatInvoice';
import RMSMakeInvoice from './pages/RMSMakeInvoice';
import RMSManageUser from './pages/RMSManageUser';
import { breakpoints } from '@mui/system';
import RMSPengaturanBiaya from './pages/RMSPengaturanBiaya';
import RMSBuatInvoiceUmum from './pages/RMSBuatInvoiceUmum';
import RMSReport from './pages/RMSReport';
import useBlok from './hooks/useBloks';

export const light = {
  palette: {
    type: 'light',
  },
}
export const dark = {
  palette: {
    type: 'dark',
  },
}

function App() {
  //use block hook
  const [ic_st_blokItems] = useBlok();
  //redux 
  const dispatch = useDispatch();
  const { updateCurrentLoginStatus, updateCurrentUser } = bindActionCreators(actionCreators, dispatch);
  const r_currentPathState = useSelector((state) => state.currentPath);
  const r_currentLoginStatus = useSelector((state) => state.currentLoginStatus);
  const r_currentUser = useSelector((state) => state.currentUser);
  //state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [ic_st_user, ic_st_setUser] = useState(null);
  const [ic_st_kmActiveView, ic_st_setKmActiveView] = useState('blok');
  const [ic_st_kmSelectedBlok, ic_st_kmSetSelectedBlok] = useState(null);
  const [ic_st_kmSelectedNomor, ic_st_kmSetSelectedNomor] = useState(null);
  const [ic_st_kmSelectedBulan, ic_st_kmSetSelectedBulan] = useState(null);
  const [ic_st_kmSelectedTahun, ic_st_kmSetSelectedTahun] = useState(null);
  //ops state
  const [ic_st_numberListOpsView, ic_st_setNumberListOpsView] = useState([]);
  const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
  const [ic_st_nomList, ic_st_setNomList] = useState([]);
  //snackbar
  const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
  //firebase auth
  const auth = getAuth();
  //handle logout operation
  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('user is signed out');
      updateCurrentLoginStatus(false);
    }).catch((error) => {
      // An error happened.
      console.log(error.message);
    });
  }
  const ic_sf_decideKMView = (type) => {
    if (type === 'blok') {
      return (
        <Grid container spacing={5}>
          {
            ic_st_blokItems.map((blokItem) => {
              return (
                <Grid item xs={6} md={4} lg={3} xl={2} key={`kolektor-grid-blok-${blokItem.value}`}>
                  <Paper onClick={() => { ic_st_setKmActiveView('nomor'); ic_st_kmSetSelectedBlok(blokItem.text) }}>
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'subtitle2'}>Blok</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'h2'}>{blokItem.text}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      )
    } else if (type === 'nomor') {
      return (
        <Grid container spacing={5}>
          {
            ic_st_numberListOpsView
          }
        </Grid>
      )
    } else if (type === 'nominal') {
      return (
        <Grid container spacing={5}>
          {
            ic_st_nomList.map((nominal) => {
              return (
                <Grid item xs={12} md={6} lg={6} xl={6} key={`kolektor-grid-nominal-${nominal}`}>
                  <Paper onClick={() => {
                    const getInvoice = async () => {
                      try {
                        setIsLoading(true);
                        console.log('Getting invoices...')
                        const q = query(collection(db, "invoice"), where("blok", "==", ic_st_kmSelectedBlok), where("nomor-rumah", "==", `${ic_st_kmSelectedNomor}`), where("bulan", "==", ic_st_kmSelectedBulan), where("tahun", "==", ic_st_kmSelectedTahun), where("status-invoice", "==", false))
                        const querySnapshot = await getDocs(q);
                        const invoices = [];
                        querySnapshot.forEach((doc) => {
                          console.log(doc.id, " => ", doc.data());
                          invoices.push({ id: doc.id, ...doc.data() });
                        });
                        console.log(`invoices result : ${JSON.stringify(invoices)}`)
                        if (invoices.length === 0) {
                          //alert('tidak ada data');
                          h_sf_showSnackbar('Tidak ada data', 'error');
                          setIsLoading(false);
                        } else if (invoices.length > 1) {
                          h_sf_showSnackbar('Invoice lebih dari satu', 'error');
                          setIsLoading(false);
                        } else {
                          //prevent updating paid bills
                          if (invoices['status-invoice'] === true) {
                            h_sf_showSnackbar(`Tagihan untuk ${invoices[0]['blok']} no. ${invoices[0]['nomor-rumah']} untuk bulan ${defineMonthName(invoices[0]['bulan'])} tahun ${invoices[0]['tahun']} sudah LUNAS`, 'error')
                            return;
                          }
                          //update document
                          await updateDoc(doc(db, "invoice", invoices[0]['id']), {
                            'blok': ic_st_kmSelectedBlok,
                            'nomor-rumah': ic_st_kmSelectedNomor,
                            'biaya': nominal,
                            'dibayar': nominal,
                            'sisa': 0,
                            'tanggal-dibayar': Date.now(),
                            'kolektor': r_currentUser,
                            'status-invoice': true,
                          });
                          h_sf_showSnackbar(`Tagihan untuk ${invoices[0]['blok']} no. ${invoices[0]['nomor-rumah']} untuk bulan ${defineMonthName(invoices[0]['bulan'])} tahun ${invoices[0]['tahun']} sudah LUNAS`, 'success')
                          //reset states
                          ic_st_setKmActiveView('blok');
                          ic_st_kmSetSelectedBlok(null);
                          ic_st_kmSetSelectedNomor(null);
                          ic_st_kmSetSelectedBulan(null);
                          ic_st_kmSelectedTahun(null);
                          setIsLoading(false);
                        }
                        //create report
                        await createReport(ic_st_kmSelectedBlok, 'bulanan', nominal, r_currentUser);
                        h_sf_showSnackbar('Berhasil menambahkan laporan', 'success');
                        //create ikk report
                        await createIkkReport(invoices[0]['tahun'], invoices[0]['bulan'], ic_st_kmSelectedBlok, invoices[0]['nomor-rumah'], invoices[0]['subtotal'], invoices[0]['biaya'], r_currentUser);
                        h_sf_showSnackbar('Berhasil menambahkan laporan IKK', 'success');
                      } catch (err) {
                        console.log(err.message);
                        setIsLoading(false);
                      }
                    }
                    if (isLoading === true) {
                      h_sf_showSnackbar('Sedang proses...', 'warning')
                    } else {
                      getInvoice();
                    }
                  }}>
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'subtitle2'}>Bayar</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'h2'}>{formatRupiah(nominal)}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      )
    } else if (type === 'bulan') {
      return (
        <Grid container spacing={5}>
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bln) => {
              return (
                <Grid item xs={12} md={6} lg={6} xl={6} key={`kolektor-grid-bulan-${bln}`}>
                  <Paper onClick={() => {
                    ic_st_setKmActiveView('tahun');
                    ic_st_kmSetSelectedBulan(bln);
                  }}>
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'subtitle2'}>Bulan</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'h4'}>{defineMonthName(bln)}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      )
    } else if (type === 'tahun') {
      return (
        <Grid container spacing={5}>
          {
            [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040].map((thn) => {
              return (
                <Grid item xs={12} md={6} lg={6} xl={6} key={`kolektor-grid-tahun-${thn}`}>
                  <Paper onClick={() => {
                    ic_st_setKmActiveView('nominal');
                    ic_st_kmSetSelectedTahun(thn);
                  }}>
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'subtitle2'}>Tahun</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }} textAlign={'center'}>
                      <Typography content={'div'} variant={'h2'}>{thn}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      )
    }
  }
  const ic_sf_decideScreen = () => {
    if (r_currentLoginStatus === false) {
      return (
        <RMSSignUp display={'default'} />
      )
    } else if (r_currentLoginStatus === true) {
      if (r_currentUser.role > 1) {
        /** admin and super admin view */
        return (
          <Router>
            <div className="App" style={{ marginBottom: '100px' }}>
              <RMSTempDrawer isOpen={isDrawerOpen} handleClick={(bool) => setIsDrawerOpen(bool)} />
              <PrimarySearchAppBar title={r_currentPathState} handleMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} handleLogout={handleLogout} />
              <Container maxWidth="xl" style={{ paddingTop: "40px" }}>
                <RMSBreadCrumbs />
                <Route path="/" exact={true}>
                  <Beranda />
                </Route>
                <Route path="/lihat-invoice/:id">
                  <RMSLihatInvoice />
                </Route>
                <Route path="/buat-invoice">
                  <RMSMakeInvoice />
                </Route>
                <Route path="/buat-invoice-umum">
                  <RMSBuatInvoiceUmum />
                </Route>
                <Route path="/input-kk">
                  <InputKK />
                </Route>
                <Route path="/lihat-kk">
                  <LihatKK />
                </Route>
                <Route path="/cetak-kuitansi">
                  <CetakKuitansi />
                </Route>
                <Route path="/input-biaya">
                  <InputBiaya />
                </Route>
                <Route path="/lihat-laporan">
                  <RMSReport />
                </Route>
                <Route path="/pengaturan-biaya">
                  <RMSPengaturanBiaya />
                </Route>
                <Route path="/lihat-biaya">
                  <LihatBiaya />
                </Route>
                <Route path="/manage-user">
                  <RMSManageUser />
                </Route>
              </Container>
            </div>
          </Router>
        )
      } else if (r_currentUser.role === 1) { //kolektor mode
        return (
          <Box>
            <PrimarySearchAppBar title={'Mode Kolektor'} handleMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} handleLogout={handleLogout} />
            <Container sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
              <Box sx={{ padding: '10px' }}>
                <Button disabled={ic_st_kmActiveView === 'blok' ? true : false} variant={'contained'} onClick={() => {
                  switch (ic_st_kmActiveView) {
                    case 'nomor':
                      ic_st_setKmActiveView('blok');
                      ic_st_kmSetSelectedBlok(null);
                      break;
                    case 'bulan':
                      ic_st_setKmActiveView('nomor');
                      ic_st_kmSetSelectedNomor(null);
                      break;
                    case 'tahun':
                      ic_st_setKmActiveView('bulan');
                      ic_st_kmSetSelectedBulan(null);
                      break;
                    case 'nominal':
                      ic_st_setKmActiveView('tahun');
                      ic_st_kmSetSelectedTahun(null);
                      break;
                    default:
                      break;
                  }
                }}>Kembali</Button>
              </Box>
              {
                ic_st_kmSelectedBlok === null ? `` :
                  <Box sx={{ padding: '10px' }}>
                    {
                      ic_st_kmSelectedBlok === null ? `` :
                        <Typography variant={'caption'} content={'div'}>{`${ic_st_kmSelectedBlok}/`}</Typography>
                    }
                    {
                      ic_st_kmSelectedNomor === null ? `` :
                        <Typography variant={'caption'} content={'div'}>{`${ic_st_kmSelectedNomor}/`}</Typography>
                    }
                    {
                      ic_st_kmSelectedBulan === null ? `` :
                        <Typography variant={'caption'} content={'div'}>{`${defineMonthName(ic_st_kmSelectedBulan)}/`}</Typography>
                    }
                    {
                      ic_st_kmSelectedTahun === null ? `` :
                        <Typography variant={'caption'} content={'div'}>{`${ic_st_kmSelectedTahun}`}</Typography>
                    }
                  </Box>
              }
              <Divider />
              <Box sx={{ padding: '10px' }}>
                {
                  ic_sf_decideKMView(ic_st_kmActiveView)
                }
              </Box>
            </Container>
          </Box>
        )
      } else if (r_currentUser.role === 0) { //pending view
        /** account is on pending view */
        return (
          <Container sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
            <Paper>
              <Box sx={{ padding: '10px' }} textAlign={'center'}>
                <Typography variant={'h6'} content={'div'}>Terima kasih sudah melakukan pendaftaran.</Typography>
              </Box>
              <Divider />
              <Box sx={{ padding: '10px' }}>
                <Typography variant={'body2'} content={'div'} gutterBottom>
                  Hi {r_currentUser.name} ,Team kami akan memberikan anda akses masuk ke aplikasi apabila semua persyaratan yang dibutuhkan telah terpenuhi. Untuk saat ini anda bisa logout terlebih dahulu, nantinya apabila akses sudah kami berikan maka anda bisa login kembali dengan menggunakan email dan password terdaftar. Terima kasih.
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ padding: '10px' }} textAlign={'right'}>
                <Button variant={'contained'} onClick={handleLogout}>Logout</Button>
              </Box>
            </Paper>
          </Container>
        )
      }
    } else {
      return (
        <Paper sx={{ padding: '10px' }}>
          loading...
        </Paper>
      )
    }
  }
  useEffect(() => {
    console.log('ic_st_user tracker effect');
    setIsLoading(true);
    if (ic_st_user === null) {
      updateCurrentUser(null)
      updateCurrentLoginStatus(false);
    } else {
      //get user data from db
      try {
        const getDataFromDb = async () => {
          console.log('getting user db');
          const docSnap = await getDoc(doc(db, "user", ic_st_user.uid));
          if (docSnap.exists()) {
            updateCurrentUser(docSnap.data());
            setIsLoading(false);
            updateCurrentLoginStatus(true);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setIsLoading(false);
            updateCurrentLoginStatus(false);
          }
        }
        getDataFromDb();
      } catch (err) {
        console.log(err.message);
      }
    }
    setIsLoading(false);
  }, [ic_st_user]);
  useEffect(() => {
    if (r_currentUser !== null || r_currentUser !== undefined) {
      console.log('[r_currentUser] inspect ', r_currentUser)
    }
  }, [r_currentUser])
  useEffect(() => {
    const getNumberList = async () => {
      try {
        const kk = await getDocs(query(collection(db, 'kk'), where('blok', '==', ic_st_kmSelectedBlok)));
        const numberList = [];
        kk.forEach((k) => {
          console.log(k.data()['no_rumah'])
          numberList.push(k.data()['no_rumah']);
        })
        /** processing view */
        let view = [];
        numberList.forEach((n) => {
          //alert(n)
          view.push(
            <Grid item xs={6} md={4} lg={3} xl={2} key={`kolektor-grid-nomor-${n}`}>
              <Paper onClick={() => { ic_st_setKmActiveView('bulan'); ic_st_kmSetSelectedNomor(n) }}>
                <Box sx={{ padding: '10px' }} textAlign={'center'}>
                  <Typography content={'div'} variant={'subtitle2'}>Nomor</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }} textAlign={'center'}>
                  <Typography content={'div'} variant={'h2'}>{n}</Typography>
                </Box>
              </Paper>
            </Grid>
          )
        })
        ic_st_setNumberListOpsView(view);
      } catch (err) {
        console.log(err.message);
      }
    }
    if (ic_st_kmSelectedBlok !== null) {
      getNumberList();
    }
  }, ic_st_kmSelectedBlok)
  useEffect(() => {
    const getNominalList = async () => {
      try {
        let nomList = [];
        const conditions = [
          where('blok', '==', ic_st_kmSelectedBlok),
          where('nomor-rumah', '==', ic_st_kmSelectedNomor),
          where('bulan', '==', ic_st_kmSelectedBulan),
          where('tahun', '==', ic_st_kmSelectedTahun),
          where('status-invoice', '==', false)
        ]
        const nominalList = await getDocs(query(collection(db, 'invoice'), ...conditions))
        nominalList.forEach((nom) => {
          nomList.push(nom.data()['biaya'])
        });
        ic_st_setNomList(nomList);
      } catch (err) {
        console.log(err.message);
      }
    }
    if (ic_st_kmSelectedTahun != null) {
      getNominalList();
    }
  }, [ic_st_kmSelectedTahun])
  onAuthStateChanged(auth, (user) => {
    if (user) { //user is signed in
      console.log('onAuthStateChanged get called');
      ic_st_setUser(user);
    } else {
      // User is signed out
      ic_st_setUser(null);
    }
  });
  return (
    <>
      {
        <Box>
          <LinearProgress color="secondary" sx={{ display: isLoading ? 'default' : 'none' }} />
          {
            ic_sf_decideScreen()
          }
          {/** snack bar */}
          <RMSSnackbar
            isOpen={h_st_isSnackbarShown}
            handleClose={() => h_sf_closeSnackbar()}
            severity={h_st_severity}
            message={h_st_message} />
        </Box>
      }
    </>
  );
}

export default App;
