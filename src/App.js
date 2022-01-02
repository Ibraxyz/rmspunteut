import './App.css';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import React, { useEffect, useState, useRef } from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import LihatTagihan from './pages/LihatTagihan';
import RMSBreadCrumbs from "./components/RMSBreadCrumbs";
import { Container, Snackbar, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
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
import { defineMonthName, formatRupiah, getSeparatedDate, createReport, createIkkReport, getWhatsappLink } from './rms-utility/rms-utility';
//hooks
import useSnackbar from './hooks/useSnackbar';
//icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
//html to canvas
import html2canvas from 'html2canvas';

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
import useGroupedSelect from './hooks/useGroupedSelect';
import RMSInvoiceDetail from './components/RMSInvoiceDetail';
import { toDate } from 'date-fns';
import md5 from 'md5';

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
  const storage = getStorage();
  //ref to generated invoice image
  const invoiceImgRef = useRef();
  //use block hook
  //const [ic_st_blokItems] = useBlok();
  const [ic_st_blokItems, ic_st_setBlokItems] = useState([]);
  const [ic_st_an, ic_st_aazz, ic_st_tasbiII] = useGroupedSelect();
  const [cache_blok, set_cache_blok] = useState({}); //caching blok no rumah for 'hemat quota'
  //refresh blok no rumah list
  const refreshBlokList = async () => {
    //get latest update from db
  }
  //effect
  useEffect(() => {
    const blocks = [];
    ic_st_an.forEach((an) => {
      console.log(JSON.stringify(an));
      blocks.push(an);
    })
    ic_st_aazz.forEach((aazz) => {
      console.log(JSON.stringify(aazz));
      blocks.push(aazz);
    })
    ic_st_tasbiII.forEach((tasbi2) => {
      console.log(JSON.stringify(tasbi2));
      blocks.push(tasbi2);
    })
    ic_st_setBlokItems(blocks);
  }, [ic_st_an, ic_st_aazz, ic_st_tasbiII])
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
  const [ic_st_kmNomIsLoading, ic_st_setKmNomIsLoading] = useState(false);
  const [ic_st_isKMCompleteDialogShown, ic_st_setIsKMCompleteDialogShown] = useState(false);
  const [ic_st_kmCurrentPaidInv, ic_st_setKmCurrentPaidInv] = useState([]);
  const [ic_st_waNumber, ic_st_setWaNumber] = useState('');
  const [ic_st_waMessage, ic_st_setWaMessage] = useState('TEST MSG');
  const [ic_st_kmWaLink, ic_st_setKmWaLink] = useState("");
  useEffect(() => {
    console.log(getWhatsappLink(ic_st_waNumber, ic_st_waMessage));
    ic_st_setKmWaLink(
      getWhatsappLink(ic_st_waNumber, ic_st_waMessage)
    )
  }, [ic_st_waNumber, ic_st_waMessage])
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
        <Grid container spacing={3}>
          {
            ic_st_blokItems.map((blokItem) => {
              console.log('blokItem', JSON.stringify(blokItem));
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`-kolektor-grid-blok-${md5(blokItem.value + Date.now())}`}>
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
            ic_st_nomList.map((inv) => {
              return (
                ic_st_kmNomIsLoading ?
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={`kolektor-grid-nominal-loading-${inv.id}`}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                  :
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={`kolektor-grid-nominal-${inv.id}`}>
                    <Paper onClick={() => {
                      //test 
                      ic_st_setKmNomIsLoading(true);
                      //check the inv object
                      console.log(JSON.stringify(inv))
                      //prevent pay a paid invoice / RK/ TMB/ EMPTY
                      if (inv['status-invoice'] !== false || inv['biaya'] === 'EMPTY' || inv['biaya'] === 'TMB' || inv['biaya'] === 'RK') {
                        h_sf_showSnackbar('Invoice ini tidak bisa di bayar karena sudah lunas / RK / TMB / EMPTY', 'error');
                        ic_st_setKmNomIsLoading(false);
                        return;
                      }
                      //update the invoice to be paid
                      try {
                        const updateInv = async () => {
                          await updateDoc(doc(db, "invoice", inv['id']), {
                            'blok': ic_st_kmSelectedBlok,
                            'nomor-rumah': ic_st_kmSelectedNomor,
                            'biaya': inv['biaya'],
                            'dibayar': inv['biaya'],
                            'sisa': 0,
                            'tanggal-dibayar': Date.now(),
                            'kolektor': r_currentUser,
                            'status-invoice': true,
                          });
                          h_sf_showSnackbar(`Tagihan ${inv['kategori']} untuk blok ${inv['blok']} no. ${inv['nomor-rumah']} telah LUNAS`, 'success')
                          //reset states
                          ic_st_setKmActiveView('blok');
                          ic_st_kmSetSelectedBlok(null);
                          ic_st_kmSetSelectedNomor(null);
                          ic_st_kmSetSelectedBulan(null);
                          ic_st_kmSetSelectedTahun(null);
                          //update report
                          await createReport(ic_st_kmSelectedBlok, inv['kategori'], parseInt(inv['biaya']), r_currentUser);
                          h_sf_showSnackbar('Berhasil menambahkan laporan', 'success');
                          ic_st_setKmNomIsLoading(false)
                          //update ikk report if category is monthly
                          if (inv['kategori'] === 'bulanan') {
                            ic_st_setKmNomIsLoading(true);
                            await createIkkReport(inv['tahun'], inv['bulan'], ic_st_kmSelectedBlok, inv['nomor-rumah'], parseInt(inv['subtotal']), parseInt(inv['biaya']), r_currentUser);
                            h_sf_showSnackbar('Berhasil menambahkan laporan IKK', 'success');
                            ic_st_setKmNomIsLoading(false);
                          }
                          //show paid invoice dialog
                          ic_st_setIsKMCompleteDialogShown(true);
                          //map inv data to fit RMSINvoiceDetail input requirement
                          console.log('INV Inspect', JSON.stringify(inv)); //a single js obj
                          const keys = Object.keys(inv);
                          keys.forEach((k) => {
                            if (k === 'status-invoice') {
                              inv[k] = 'LUNAS';
                            }
                            if (k === 'nama-daftar-tagihan') {
                              inv[k] = JSON.stringify(inv['nama-daftar-tagihan']);
                            }
                            if (k === 'status-tagihan') {
                              inv[k] = 'LUNAS';
                            }
                            if (k === 'status-kelompok-tagihan') {
                              inv[k] = 'LUNAS';
                            }
                            if (k === 'tanggal-dibuat') {
                              inv[k] = toDate(inv['tanggal-dibuat'])
                            }
                            if (k === 'tanggal-aktif') {
                              inv[k] = toDate(inv['tanggal-aktif'])
                            }
                            if (k === 'tanggal-dibayar') {
                              inv[k] = toDate(inv['tanggal-dibayar'])
                            }
                            if (k === 'tagihan') {
                              inv[k] = JSON.stringify(inv['tagihan'])
                            }
                          })
                          inv["sudah-dibayar"] = parseInt(inv['biaya']);
                          inv["sisa"] = 0;
                          inv['kolektor'] = r_currentUser.name;
                          ic_st_setKmCurrentPaidInv([inv]);
                        }
                        updateInv();
                      } catch (err) {
                        h_sf_showSnackbar(err.message, 'error');
                        ic_st_setKmNomIsLoading(false);
                      }
                    }}>
                      <Box sx={{ padding: '10px' }} textAlign={'center'}>
                        {
                          inv['status-invoice'] === false ? <Typography content={'div'} variant={'subtitle2'} sx={{ color: 'red' }}>Bayar</Typography>
                            :
                            <Typography sx={{ color: 'green' }} content={'div'} variant={'subtitle2'}>{`Sudah Lunas`}</Typography>
                        }
                      </Box>
                      <Divider />
                      <Box sx={{ padding: '10px' }} textAlign={'center'}>
                        <Typography variant={'caption'}>ID : {inv.id}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ padding: '10px' }} textAlign={'center'}>
                        {
                          inv['nama-daftar-tagihan'] === null || inv['nama-daftar-tagihan'] === undefined ? 'no-data' : inv['nama-daftar-tagihan'].map((n) => <Typography key={n + Date.now()} content={'div'} variant={'caption'}>{n}</Typography>)
                        }
                      </Box>
                      <Divider />
                      <Box sx={{ padding: '10px' }} textAlign={'center'}>
                        {
                          inv['biaya'] === 'EMPTY' || inv['biaya'] === 'TMB' || inv['biaya'] === 'RK' ?
                            <Typography content={'div'} variant={'h2'}>{inv['biaya']}</Typography>
                            :
                            <Typography content={'div'} variant={'h2'}>{formatRupiah(parseInt(inv['biaya']))}</Typography>
                        }
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
        let numberList = [];
        //if cache not set yet, get it from db
        if (cache_blok[ic_st_kmSelectedBlok] === null || cache_blok[ic_st_kmSelectedBlok] === undefined) {
          h_sf_showSnackbar('getting data from db..', 'warning');
          const kk = await getDocs(query(collection(db, 'kk'), where('blok', '==', ic_st_kmSelectedBlok), orderBy("no_rumah")));
          kk.forEach((k) => {
            console.log(k.data()['no_rumah'])
            numberList.push(k.data()['no_rumah']);
          })
          const cacheObject = { ...cache_blok };
          cacheObject[ic_st_kmSelectedBlok] = numberList;
          set_cache_blok(cacheObject);
        } else {
          h_sf_showSnackbar('using cache', 'success');
          numberList = cache_blok[ic_st_kmSelectedBlok]
        }
        /** processing view */
        let view = [];
        const nArr = []; //array that help check for duplicating nomor-rumah
        numberList.forEach((n) => {
          //alert(n)
          //filter out same nomor rumah
          if (nArr.includes(n)) {
            //the number already pushed,.. so the view will not displaying it
            console.log('the number already pushed,.. so the view will not displaying it');
          } else {
            nArr.push(n);
            view.push(
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`-kolektor-grid-nomor-${md5(n + Date.now())}`}>
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
          }
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
      ic_st_setKmNomIsLoading(true);
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
          nomList.push({ id: nom.id, ...nom.data() })
        });
        ic_st_setNomList(nomList);
        ic_st_setKmNomIsLoading(false);
      } catch (err) {
        console.log(err.message);
        ic_st_setKmNomIsLoading(false);
      }
    }
    if (ic_st_kmSelectedTahun != null) {
      getNominalList();
    }
  }, [ic_st_kmSelectedTahun])
  onAuthStateChanged(auth, (user) => {
    try {
      if (user) { //user is signed in
        console.log('onAuthStateChanged get called');
        ic_st_setUser(user);
      } else {
        // User is signed out
        ic_st_setUser(null);
      }
    } catch (err) {
      console.log(err.message);
      h_sf_showSnackbar(err.message, 'error');
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
          {/** Paid Invoice Dialog (KM) ic_st_isKMCompleteDialogShown */}
          <Dialog open={ic_st_isKMCompleteDialogShown}>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
            <Divider />
            <DialogContent>
              <RMSInvoiceDetail
                ref={invoiceImgRef}
                isOpen={true}
                currentRow={ic_st_kmCurrentPaidInv}
                handleBackButton={() => ic_st_setIsKMCompleteDialogShown(false)}
              >
                {/** <QRCode size={64} value={ic_st_currentSelectedRowData.length > 0 ? ic_sf_constructQRData() : 'invalid'} /> */}
              </RMSInvoiceDetail>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Stack direction={'column'}>
                <TextField sx={{ marginBottom: '5px' }} type={'number'} onChange={(e) => { ic_st_setWaNumber(e.target.value) }}></TextField>
                {/** <a href={ic_st_kmWaLink} style={{ textDecoration: 'none' }}> **/}
                <Button startIcon={<WhatsAppIcon />} sx={{ width: '100%' }} variant={'contained'} onClick={() => {
                  ic_st_setIsKMCompleteDialogShown(false);
                  //download the image first, in case we will need it later

                  const downloadImage = async () => {
                    const element = invoiceImgRef.current;
                    const canvas = await html2canvas(element);
                    console.log('IMG CANVAS INSPECT', canvas);
                    const data = canvas.toDataURL('image/jpg');
                    console.log('IMG DATA INSPECT', data);
                    //upload to firebase storage
                    console.log('ic_st_kmCurrentPaidInv INSPECTO', JSON.stringify(ic_st_kmCurrentPaidInv));
                    const id = ic_st_kmCurrentPaidInv[0]['id'];
                    try {
                      const storageRef = ref(storage, `invoices-${id}.png`);
                      //upload data
                      await uploadString(storageRef, data, 'data_url').then((snapshot) => {
                        console.log('data url snapshot', snapshot);
                        console.log('Uploaded a data_url string!');
                      });
                      //Get the download URL
                      getDownloadURL(storageRef)
                        .then((url) => {
                          //save the url in to the state
                          ic_st_setWaMessage(url);
                          //click the link to download programmatically
                          const link = document.createElement('a');
                          if (typeof link.download === 'string') {
                            link.href = data;
                            link.download = `invoices-${id}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } else {
                            window.open(data);
                          }
                        })
                        .catch((error) => {
                          // A full list of error codes is available at
                          // https://firebase.google.com/docs/storage/web/handle-errors
                          switch (error.code) {
                            case 'storage/object-not-found':
                              // File doesn't exist
                              break;
                            case 'storage/unauthorized':
                              // User doesn't have permission to access the object
                              break;
                            case 'storage/canceled':
                              // User canceled the upload
                              break;

                            // ...

                            case 'storage/unknown':
                              // Unknown error occurred, inspect the server response
                              break;
                          }
                          h_sf_showSnackbar(error.code, 'error');
                        })
                    } catch (err) {
                      h_sf_showSnackbar(err.message, 'error');
                      console.log(err.message);
                    }
                  };

                  const sendToWa = () => {
                    const link = document.createElement('a');
                    link.href = ic_st_kmWaLink;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }

                  const finishProcess = async () => {
                    try {
                      await downloadImage();
                      sendToWa();
                    } catch (err) {
                      h_sf_showSnackbar(err.message, 'error');
                    }
                  }

                  finishProcess();
                }}>Kirim ke WA</Button>
                {/** </a> */}
              </Stack>
            </DialogActions>
          </Dialog>
        </Box>
      }
    </>
  );
}

export default App;
