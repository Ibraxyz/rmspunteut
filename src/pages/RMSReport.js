import { Box, Divider, Paper, Typography, Button, LinearProgress, Stack, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MITDataGrid from '../components/MITDataGrid';
import RMSSnackbar from '../components/RMSSnackbar';
import RMSTextField from '../components/RMSTextField';
import RMSSelect from '../components/RMSSelect';
import useSnackbar from '../hooks/useSnackbar';
import useBlok from '../hooks/useBloks';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../index';
import { formatRupiah } from '../rms-utility/rms-utility';
import ReportSVG from '../images/report.svg';
import RMSGroupedSelect from '../components/RMSGroupedSelect';
import useGroupedSelect from '../hooks/useGroupedSelect';

const RMSReport = (props) => {
    const [ic_st_an, ic_st_aazz, ic_st_tasbiII] = useGroupedSelect();
    const [ic_st_year, ic_st_setYear] = useState([]);
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    const [ic_st_blok, ic_st_setBlok] = useState([]);
    const [ic_st_isProcessing, ic_st_setIsProcessing] = useState(false);
    const [ic_st_blokItems] = useBlok();
    const [ic_st_rows, ic_st_setRows] = useState([]);
    const [ic_st_trows, ic_st_setTrows] = useState([]);
    const [ic_st_totalAll, ic_st_setTotalAll] = useState(0);
    useEffect(() => {
        console.log(ic_st_totalAll)
    }, [ic_st_totalAll])
    //getting collections
    const ic_columns = [
        { field: 'no', headerName: 'No.', width: 150, editable: false },
        { field: 'blok', headerName: 'Blok', width: 150, editable: false },
        { field: 'ikk', headerName: 'IKK', width: 150, editable: false },
        { field: 'januari', headerName: 'JAN', width: 150, editable: false },
        { field: 'februari', headerName: 'FEB', width: 150, editable: false },
        { field: 'maret', headerName: 'MAR', width: 150, editable: false },
        { field: 'april', headerName: 'APR', width: 150, editable: false },
        { field: 'mei', headerName: 'MEI', width: 150, editable: false },
        { field: 'juni', headerName: 'JUN', width: 150, editable: false },
        { field: 'juli', headerName: 'JUL', width: 150, editable: false },
        { field: 'agustus', headerName: 'AUG', width: 150, editable: false },
        { field: 'september', headerName: 'SEP', width: 150, editable: false },
        { field: 'oktober', headerName: 'OCT', width: 150, editable: false },
        { field: 'november', headerName: 'NOV', width: 150, editable: false },
        { field: 'desember', headerName: 'DES', width: 150, editable: false },
    ];
    const ic_total_columns = [
        { field: 'blok', headerName: 'Blok', width: 150, editable: false },
        { field: 'ikk', headerName: 'IKK', width: 150, editable: false },
        { field: 'januari', headerName: 'JAN', width: 150, editable: false },
        { field: 'februari', headerName: 'FEB', width: 150, editable: false },
        { field: 'maret', headerName: 'MAR', width: 150, editable: false },
        { field: 'april', headerName: 'APR', width: 150, editable: false },
        { field: 'mei', headerName: 'MEI', width: 150, editable: false },
        { field: 'juni', headerName: 'JUN', width: 150, editable: false },
        { field: 'juli', headerName: 'JUL', width: 150, editable: false },
        { field: 'agustus', headerName: 'AUG', width: 150, editable: false },
        { field: 'september', headerName: 'SEP', width: 150, editable: false },
        { field: 'oktober', headerName: 'OCT', width: 150, editable: false },
        { field: 'november', headerName: 'NOV', width: 150, editable: false },
        { field: 'desember', headerName: 'DES', width: 150, editable: false },
    ];
    const showreport = async () => {
        ic_st_setIsProcessing(true);
        if (ic_st_year.length === 0) {
            h_sf_showSnackbar('Mohon isi tahun laporan dan blok', 'error');
            ic_st_setIsProcessing(false);
            return;
        }
        //get collection
        try {
            console.log('getting collection...');
            const ref = collection(db, `ikk-report/${ic_st_year}/data/`);
            const conditions = [
                where('blok-only', '==', ic_st_blok),
            ]
            const reports = await getDocs(query(ref, ...conditions));
            const reportsArr = [];
            let index = 1;
            let totalIkk = 0;
            let totalAll = 0;
            let totalFebruari = 0
            let totalMaret = 0
            let totalApril = 0
            let totalMei = 0
            let totalJuni = 0
            let totalJuli = 0
            let totalAgustus = 0
            let totalSeptember = 0
            let totalOktober = 0
            let totalNovember = 0
            let totalDesember = 0;
            let totalJanuari = 0;
            reports.forEach((report) => {
                //console.log(JSON.stringify(report.data()));
                totalIkk += report.data()['ikk'];
                switch (report.data()['bulan']) {
                    case 1:
                        totalJanuari += report.data()['januari']
                        break;
                    case 2:
                        totalFebruari += report.data()['februari']
                        break;
                    case 3:
                        totalMaret += report.data()['maret']
                        break;
                    case 4:
                        totalApril += report.data()['april']
                        break;
                    case 5:
                        totalMei += report.data()['mei']
                        break;
                    case 6:
                        totalJuni += report.data()['juni']
                        break;
                    case 7:
                        totalJuli += report.data()['juli']
                        break;
                    case 8:
                        totalAgustus += report.data()['agustus']
                        break;
                    case 9:
                        totalSeptember += report.data()['september']
                        break;
                    case 10:
                        totalOktober += report.data()['oktober']
                        break;
                    case 11:
                        totalNovember += report.data()['november']
                        break;
                    case 12:
                        totalDesember += report.data()['desember']
                        break;
                    default:
                        break;
                }
                reportsArr.push({ "id": report.id, "no": index, ...report.data() }); //map data to grid cell
                index++;
            })
            console.log('total januari inspect', totalJanuari);
            const reportTotalArr = [];
            reportTotalArr.push({
                "id": ic_st_blok + '' + ic_st_year,
                "blok": ic_st_blok,
                "ikk": totalIkk,
                "januari": totalJanuari === undefined ? 0 : totalJanuari,
                "februari": totalFebruari === undefined ? 0 : totalFebruari,
                "maret": totalMaret === undefined ? 0 : totalMaret,
                "april": totalApril === undefined ? 0 : totalApril,
                "mei": totalMei === undefined ? 0 : totalMei,
                "juni": totalJuni === undefined ? 0 : totalJuni,
                "juli": totalJuli === undefined ? 0 : totalJuli,
                "agustus": totalAgustus === undefined ? 0 : totalAgustus,
                "september": totalSeptember === undefined ? 0 : totalSeptember,
                "oktober": totalOktober === undefined ? 0 : totalOktober,
                "november": totalNovember === undefined ? 0 : totalNovember,
                "desember": totalDesember === undefined ? 0 : totalDesember,
            })
            totalAll =
                + totalJanuari === undefined ? 0 : totalJanuari
                    + totalFebruari === undefined ? 0 : totalFebruari
                        + totalMaret === undefined ? 0 : totalMaret
                            + totalApril === undefined ? 0 : totalApril
                                + totalMei === undefined ? 0 : totalMei
                                    + totalJuni === undefined ? 0 : totalJuni
                                        + totalJuli === undefined ? 0 : totalJuli
                                            + totalAgustus === undefined ? 0 : totalAgustus
                                                + totalSeptember === undefined ? 0 : totalSeptember
                                                    + totalOktober === undefined ? 0 : totalOktober
                                                        + totalNovember === undefined ? 0 : totalNovember
                                                            + totalDesember === undefined ? 0 : totalDesember
            ic_st_setTotalAll(totalAll);
            ic_st_setRows(reportsArr);
            ic_st_setTrows(reportTotalArr);
            ic_st_setIsProcessing(false);
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsProcessing(false);
        }
    }
    return (
        <Box>
            <Paper sx={{ marginBottom: "20px" }}>
                {
                    ic_st_isProcessing ?
                        <LinearProgress />
                        :
                        <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Laporan Tanda Terima</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'column'}>
                        {/** <RMSSelect isRequired={true} items={ic_st_blokItems} isError={ic_st_blok.length === 0 && h_st_isSnackbarShown} label={"Blok"} value={ic_st_blok} helperText={"Masukkan Blok"} handleChange={(v) => {
                            ic_st_setBlok(v);
                        }} /> */}
                        <RMSGroupedSelect
                            isError={ic_st_blok.length === 0 && h_st_isSnackbarShown}
                            isRequired={true}
                            displayFilter={'default'}
                            an={ic_st_an}
                            aazz={ic_st_aazz}
                            tasbiII={ic_st_tasbiII}
                            value={ic_st_blok}
                            handleChange={(v) => {
                                ic_st_setBlok(v);
                            }}
                        />
                        <RMSTextField isRequired={true} type={"number"} isError={ic_st_year.length === 0 && h_st_isSnackbarShown} label={"Tahun"} value={ic_st_year} helperText={"Masukkan tahun"} handleChange={(v) => {
                            ic_st_setYear(v);
                        }} />
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button variant={'contained'} onClick={showreport} disabled={ic_st_isProcessing} >Tampilkan Laporan</Button>
                </Box>
            </Paper>
            {/** generated report */}
            <Paper sx={{ marginBottom: '20px' }}>
                {
                    ic_st_isProcessing ?
                        <LinearProgress />
                        :
                        <></>
                }
                <Box sx={{ padding: '10px' }}>
                    <Typography variant={'subtitle2'}>Tanda Terima Kwitansi IKK Blok {ic_st_blok} Tahun {ic_st_year}</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px', height: '400px' }}>
                    <MITDataGrid columns={ic_columns} rows={ic_st_rows} />
                </Box>
            </Paper>
            {/** generated report total*/}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={8}>
                    <Paper>
                        {
                            ic_st_isProcessing ?
                                <LinearProgress />
                                :
                                <></>
                        }
                        <Box sx={{ padding: '10px' }}>
                            <Typography variant={'subtitle2'}>Total Tanda Terima Kwitansi IKK Blok {ic_st_blok} Tahun {ic_st_year}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ padding: '10px', height: '400px' }}>
                            <MITDataGrid columns={ic_total_columns} rows={ic_st_trows} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Paper sx={{ padding: '20px' }}>
                        <Stack direction={'column'} spacing={1} alignItems={'center'} >
                            <img src={ReportSVG} alt={""} style={{ width: '75%', height: 'auto', marginBottom: '20px', marginTop: '20px' }} />
                            <Typography variant={'subtitle2'}>Total IKK Blok {ic_st_blok} Tahun {ic_st_year}</Typography>
                            <Typography variant={'h5'}>Rp.{formatRupiah(ic_st_totalAll)}</Typography>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            {/** snackbar */}
            <RMSSnackbar
                message={h_st_message}
                severity={h_st_severity}
                handleClose={h_sf_closeSnackbar}
                isOpen={h_st_isSnackbarShown}
            />
        </Box>
    )
}

export default RMSReport;