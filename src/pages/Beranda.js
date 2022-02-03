import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";
import { Box, Paper, Grid, Stack, Typography, Button, Divider, Snackbar, Alert, LinearProgress } from '@mui/material';
import RMSLineChart from "../components/RMSLineChart";

//db
import { db } from '../index';

//firebase 
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, updateDoc, getDoc, setDoc } from "firebase/firestore";

//qr scanner
import { QrReader } from '@blackbox-vision/react-qr-reader';

//rms 
import RMSReportCard from "../components/RMSReportCard";

//util
import { formatRupiah, getSeparatedDate } from '../rms-utility/rms-utility';

const TopQRScanner = (props) => {
    useEffect(() => {
        console.log('TopQRScanner mounted');
        return () => {
            console.log('TOPQRScanner unmounted');
        }
    }, [])
    return (
        <Box sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {/** linear progress bar */}
            <Divider sx={{ marginBottom: '10px', marginTop: '10px' }} />
            <QrReader constraints={{ facingMode: 'environment' }}
                onResult={async (result, error) => {
                    if (!!result) {
                        props.setData(JSON.parse(result?.text));
                    }
                    if (!!error) {
                        console.info(error);
                    }
                }}
                style={{ width: '100%' }}
            />
            <Divider sx={{ marginTop: '10px' }} />
        </Box>
    )
}

const Beranda = () => {
    //redux 
    const dispatch = useDispatch();
    const r_currentUser = useSelector((state) => state.currentUser);
    const { updateCurrentPath } = bindActionCreators(actionCreators, dispatch);
    //functions
    const ic_af_updateData = async (id, collectionName, newField) => {
        ic_st_setIsProcessing(true);
        try {
            await updateDoc(doc(db, collectionName, id), newField);
            ic_st_setAlertMessage('Tagihan lunas.');
            ic_st_setMsgSeverity('success');
            ic_st_setIsSnackbarShown(true);
            setData({ ...data, ...newField }) //update state after successfully update db
            ic_st_setIsProcessing(false);
        } catch (err) {
            console.log(err.message);
            ic_st_setAlertMessage(err.message);
            ic_st_setMsgSeverity('error');
            ic_st_setIsSnackbarShown(true);
            ic_st_setIsProcessing(false);
        }
    }
    //const
    const graphData = {
        labels: [],
        datasets: [],
    };
    //state
    const [data, setData] = useState(null);
    const [ic_st_isProcessing, ic_st_setIsProcessing] = useState(false);
    const [ic_st_isQRShown, ic_st_setIsQRShown] = useState(false);
    const [ic_st_isSnackbarShown, ic_st_setIsSnackbarShown] = useState(false);
    const [ic_st_alertMessage, ic_st_setAlertMessage] = useState("");
    const [ic_st_msgSeverity, ic_st_setMsgSeverity] = useState('error');
    const [ic_st_bulan, ic_st_setBulan] = useState('');
    const [ic_st_tahun, ic_st_setTahun] = useState('');
    const [ic_st_totalPemasukanBulanIni, ic_st_setTotalPemasukanBulanIni] = useState(0);
    const [ic_st_totalPemasukanBulanKemarin, ic_st_setTotalPemasukanBulanKemarin] = useState(0);
    const [ic_st_totalPemasukanTahunIni, ic_st_setTotalPemasukanTahunIni] = useState(0);
    const [ic_st_totalPemasukanAllTime, ic_st_setTotalPemasukanAllTime] = useState(0);
    const [ic_st_perBlokLabel, ic_st_setPerBlokLabel] = useState([]);
    const [ic_st_graphData, ic_st_setGraphData] = useState(graphData)
    //effect
    useEffect(() => {
        updateCurrentPath("Beranda");
        const separatedDate = getSeparatedDate(Date.now());
        ic_st_setBulan(separatedDate.month);
        ic_st_setTahun(separatedDate.year);
        //get merged report bulan ini
        const getMergedReport = async () => {
            //merged-report/2021/bulan/12/kolektor/
            try {
                //bulan ini
                const mergedReport = await getDocs(collection(db, 'merged-report', `${separatedDate.year}`, "bulan", `${separatedDate.month}`, 'kolektor'));
                let pemasukanBulanIni = 0;
                mergedReport.forEach(mr => {
                    pemasukanBulanIni += mr.data().total;
                });
                ic_st_setTotalPemasukanBulanIni(pemasukanBulanIni);
                //bulan kemarin
                let k_bulan = parseInt(separatedDate.month) - 1;
                let k_tahun = separatedDate.year;
                //handle if past month is december 
                if ((parseInt(separatedDate.month) - 1) === 0) {
                    k_bulan = 12;
                    k_tahun = k_tahun - 1;
                }
                const mergedReport2 = await getDocs(collection(db, 'merged-report', `${k_tahun}`, "bulan", `${k_bulan}`, 'kolektor'));
                let pemasukanBulanKemarin = 0;
                mergedReport2.forEach(mr => {
                    pemasukanBulanKemarin += mr.data().total;
                });
                ic_st_setTotalPemasukanBulanKemarin(pemasukanBulanKemarin);
                //tahun ini
                const mergedReport3 = await getDocs(collection(db, 'merged-yearly-report', `${separatedDate.year}`, `kolektor`));
                let pemasukanTahunIni = 0;
                mergedReport3.forEach(mr => {
                    pemasukanTahunIni += mr.data().total;
                });
                ic_st_setTotalPemasukanTahunIni(pemasukanTahunIni);
                //all time
                const allTimeReports = await getDocs(collection(db, `all-time-report/`));
                let totalAllTime = 0;
                allTimeReports.forEach((atr) => {
                    totalAllTime += atr.data().total
                })
                ic_st_setTotalPemasukanAllTime(totalAllTime);
            } catch (err) {
                alert(err.message);
            }
        }
        getMergedReport();
        const getPerBlokReport = async () => {
            try {
                const perBlokReport = await getDocs(collection(db, `per-blok-report/${separatedDate.year}/bulan/${separatedDate.month}/data/`));
                let blokList = [];
                perBlokReport.forEach((pb) => {
                    let pbData = pb.data();
                    if (!blokList.includes(pbData.blok)) {
                        blokList.push(pbData.blok);
                    }
                });
                //graph labels
                let graphData = ic_st_graphData;
                graphData.labels = blokList;
                //retribution data
                let retributionPerBlok = [];
                let bulananPerBlok = [];
                let customBlok = [];
                let datasets = [];
                blokList.forEach((b) => {
                    perBlokReport.forEach((pb) => {
                        let pbData = pb.data();
                        if (pbData.blok === b && pbData.kategori === 'retribusi') {
                            retributionPerBlok.push(pbData.total);
                        }
                        if (pbData.blok === b && pbData.kategori === 'bulanan') {
                            bulananPerBlok.push(pbData.total);
                        }
                        if (pbData.blok === b && pbData.kategori === 'custom') {
                            customBlok.push(pbData.total);
                        }
                    })
                })
                datasets = [
                    {
                        "label": "IKK",
                        "data": bulananPerBlok,
                        "fill": false,
                        "backgroundColor": "rgb(255, 0, 0)",
                        "borderColor": "rgba(255, 0, 0,0.2)"
                    },
                    {
                        "label": "Retribusi",
                        "data": retributionPerBlok,
                        "fill": false,
                        "backgroundColor": "rgb(0, 255, 0)",
                        "borderColor": "rgba(0, 255, 0,0.2)"
                    },
                    {
                        "label": "Custom",
                        "data": customBlok,
                        "fill": false,
                        "backgroundColor": "rgb(0, 0, 255)",
                        "borderColor": "rgba(0, 0, 255,0.2)"
                    }
                ]
                graphData.datasets = datasets;
                console.log('retributionPerBlok check', JSON.stringify(retributionPerBlok));
                console.log('graphData', JSON.stringify(graphData));
                ic_st_setGraphData(graphData);
            } catch (err) {
                console.log(err.message);
            }
        }
        getPerBlokReport();
    }, [])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                <Grid xs={12} sm={6} md={3} item>
                    <RMSReportCard title={`Total Pemasukan bulan ini`} total={formatRupiah(ic_st_totalPemasukanBulanIni)} ></RMSReportCard>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <RMSReportCard title={`Total Pemasukan bulan kemarin`} total={formatRupiah(ic_st_totalPemasukanBulanKemarin)} ></RMSReportCard>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <RMSReportCard title={`Total Pemasukan tahun ini`} total={formatRupiah(ic_st_totalPemasukanTahunIni)} ></RMSReportCard>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <RMSReportCard title={`Total Pemasukan dari awal s/d sekarang`} total={formatRupiah(ic_st_totalPemasukanAllTime)} ></RMSReportCard>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <Paper sx={{ padding: "15px" }}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h5" gutterBottom component="div">
                                    Grafik IKK + Retribusi + Custom
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom component="div" sx={{ opacity: '0.6' }}>
                                    {`Pembayaran Bulan ${ic_st_bulan} tahun ${ic_st_tahun}`}
                                </Typography>
                            </Box>
                            <RMSLineChart data={ic_st_graphData} />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Paper sx={{ padding: '10px', marginBottom: '15px', marginTop: '15px', textAlign: 'right' }}>
                <LinearProgress color="secondary" sx={{ display: ic_st_isProcessing ? 'default' : 'none' }} />
                <Button variant='contained' onClick={() => ic_st_setIsQRShown(!ic_st_isQRShown)}>{ic_st_isQRShown ? 'Close QR Scanner' : 'Scan QR Code'}</Button>
                {
                    ic_st_isQRShown ?
                        <TopQRScanner
                            setData={setData}
                            data={data}
                            hideSelf={() => ic_st_setIsQRShown(false)}
                            setAlertMessage={(value) => ic_st_setAlertMessage(value)}
                            setMsgSeverity={(value) => { ic_st_setMsgSeverity(value) }}
                            setSnackbarVisibility={(value) => { ic_st_setIsSnackbarShown(value) }}
                            isProcessing={ic_st_isProcessing}
                        /> : <div></div>
                }
                {
                    ic_st_isQRShown && data != null && data != undefined ? <Box><Button onClick={
                        async () => {
                            //update current collector's scanned id
                            try {
                                await setDoc(doc(db, `scannedId/${r_currentUser.uid}`), { "id": data['id'] });
                                ic_st_setIsProcessing(false);
                            } catch (err) {
                                alert(err.message);
                                ic_st_setIsProcessing(false);
                            }
                        }
                    } variant={'contained'} disabled={data['sisa'] === 0 || ic_st_isProcessing ? true : false} sx={{ marginTop: '10px', width: '100%' }}>{`Lihat Invoice`}</Button></Box> : <></>
                }
            </Paper>
            {/** snack bar */}
            <Snackbar open={ic_st_isSnackbarShown} autoHideDuration={2000} onClose={() => { ic_st_setIsSnackbarShown(false) }}>
                <Alert onClose={() => { ic_st_setIsSnackbarShown(false) }} severity={ic_st_msgSeverity} sx={{ width: '100%' }}>
                    {ic_st_alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Beranda;