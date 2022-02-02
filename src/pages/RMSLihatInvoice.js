import React, { useState, useRef, useEffect } from "react";
import RMSFilter from '../components/RMSFilter';
import RMSDataDisplay from '../components/RMSDataDisplay';
//date-fns
import { getTime } from 'date-fns';
//hooks
import useViewData from "../hooks/useViewData";
import usePathUpdater from "../hooks/usePathUpdater";
//material ui
import { LinearProgress, Snackbar, Alert, Box, Grid, Dialog, Paper, DialogActions, Divider, Stack, DialogTitle, DialogContent, Button } from '@mui/material';
import RMSInvoiceDetail from "../components/RMSInvoiceDetail";
import RMSPayInvoice from "../components/RMSPayInvoice";
//material icons
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CancelIcon from '@mui/icons-material/Cancel';
//print
import { useReactToPrint } from 'react-to-print';
//qr code
import QRCode from "react-qr-code";
import { defineMonthName, getSeparatedDate, substractIkkReport, substractReport, createReportFromInvoices } from "../rms-utility/rms-utility";
//react router dom
import { useParams, Link } from 'react-router-dom';
//rms
import RMSTextField from "../components/RMSTextField";
import { db } from '../index';
import { setDoc, doc, onSnapshot } from 'firebase/firestore';
//redux
import { useSelector } from "react-redux";
//utility
import useBloks from "../hooks/useBloks";
import RMSFullScreenDialog from "../components/RMSFullScreenDialog";
import RMSDisplayTable from "../components/RMSDisplayTable";


//inner component
const TopPrintPreview = (props) => {
    return (
        <Dialog open={props.isOpen}>
            <DialogTitle>Cetak Invoice</DialogTitle>
            <Divider />
            <DialogContent ref={null}>
                {
                    props.children
                }
            </DialogContent>
            <Divider />
            <DialogActions>
                <Stack direction="column" spacing={1} sx={{ width: '100%' }} >
                    <Button startIcon={<CancelIcon />} onClick={() => { props.handleCancel() }} variant="outlined" disabled={false}>Batal</Button>
                    <Button startIcon={<LocalPrintshopIcon />} onClick={props.handlePrint} variant="outlined" disabled={false}>Cetak</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

const RMSLihatInvoice = () => {
    //--------------------------------------------------------------------------------------------------//
    //redux state => current logged in user
    //full screen dialog state
    const [ic_st_isFullScreenDialogOpen, ic_st_setIsFullScreenDialogOpen] = useState(false);
    const r_currentUser = useSelector((state) => state.currentUser);
    const [ic_st_blokItems] = useBloks();
    const [ic_st_isLoadingIn, ic_st_setIsLoadingIn] = useState(false);
    //params
    const { id } = useParams();
    //effect - params
    //open up id filtering and fill in the value to id.
    useEffect(() => {
        if (id !== 'noid') {
            const filterOptionList = [...ic_st_filterOptionsList];
            ic_st_setFilterOptionsList(filterOptionList.map((option) => {
                if (option.value === 'id') {
                    option.isSelected = true;
                    option.propertyValue = id;
                }
                return option;
            }));
        }
    }, [id])
    useEffect(() => {
        const filterOptionList = ic_st_filterOptionsList;
        filterOptionList.map((option) => {
            if (option.value === 'blok') {
                option.items = ic_st_blokItems
            }
            return option;
        })
        ic_st_setFilterOptionsList(filterOptionList)
    }, [ic_st_blokItems])
    //function - ic_af_updatePriceBasedOnProposedPrice()
    const ic_af_updatePriceBasedOnProposedPrice = async () => {
        try {
            await ic_af_updateData(ic_st_currentSelectedRowData[0]['id'], 'invoice', {
                'biaya': parseInt(ic_st_proposedPrice),
                'potongan': ((ic_st_currentSelectedRowData[0]['biaya'] - ic_st_proposedPrice) / ic_st_currentSelectedRowData[0]['biaya']) * 100,
                'sisa': parseInt(ic_st_proposedPrice),
            });
            ic_st_setProposedPrice(0);
            console.log('Berhasil memberikan harga khusus.');
            ic_st_setIsDiscountDialogOpen(false);
        } catch (err) {
            console.log(err.message);
            ic_st_setIsDiscountDialogOpen(false);
        }
    }
    //ref
    const ic_componentRef = useRef();
    //Filter options list
    const ic_filterOptionsList = [
        {
            "text": "Status",
            "helperText": "Pilih status invoice",
            "value": "status-invoice", //select option stuff
            "propertyValue": false, //actual state value
            "type": "select",
            "items": [true, false].map((b) => { return { "text": b === true ? "LUNAS" : "BELUM LUNAS", "value": b } }),
            "isSelected": false,
            "handleChange": (newValue, index) => ic_sf_handleFilterOptionsValueChange(newValue, index),
            "isError": () => { return false },
            "isRequired": true
        },
        {
            "text": "ID Invoice",
            "helperText": "Masukkan ID Invoice",
            "value": "id", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Blok",
            "helperText": "Pilih blok",
            "value": "blok", //select option stuff
            "propertyValue": "A", //actual state value
            "type": "select",
            "items": ic_st_blokItems,
            "isSelected": false,
            "handleChange": (newValue, index) => ic_sf_handleFilterOptionsValueChange(newValue, index),
            "isError": () => { return false },
            "isRequired": true
        },
        {
            "text": "Nomor Rumah",
            "helperText": "Masukkan Nomor Rumah",
            "value": "nomor-rumah", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Bulan",
            "helperText": "Bulan...",
            "value": "bulan", //select option stuff
            "propertyValue": 1, //actual state value
            "type": "select",
            "items": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => { return { 'text': defineMonthName(m), 'value': m } }),
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(parseInt(newValue), index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Tahun",
            "helperText": "Tahun...",
            "value": "tahun", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(parseInt(newValue), index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Kategori",
            "helperText": "Kategori Biaya",
            "value": "kategori", //select option stuff
            "propertyValue": [], //actual state value
            "type": "select",
            "items": ['bulanan', 'retribusi', 'custom'].map((k) => {
                return {
                    "text": k,
                    "value": k
                }
            }),
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        /**
         * {
            "text": "Tanggal Mulai",
            "helperText": "Mulai dari tanggal",
            "value": "tanggal-awal", //select option stuff
            "propertyValue": [], //actual state value
            "type": "date",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(getTime(newValue), index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Tanggal Akhir",
            "helperText": "Sampai dengan tanggal",
            "value": "tanggal-akhir", //select option stuff
            "propertyValue": [], //actual state value
            "type": "date",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(getTime(newValue), index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
         */
    ]
    //state
    const [ic_st_filterOptionsList, ic_st_setFilterOptionsList] = useState(ic_filterOptionsList);
    const [ic_st_isInvoiceDetailOpen, ic_st_setIsInvoiceDetailOpen] = useState(false);
    const [ic_st_isPrintPreviewShown, ic_st_setIsPrintPreviewShown] = useState(false);
    //state - discount
    const [ic_st_isDiscountDialogOpen, ic_st_setIsDiscountDialogOpen] = useState(false);
    const [ic_st_proposedPrice, ic_st_setProposedPrice] = useState(0);
    //functions
    const ic_sf_handleFilterOptionsValueChange = (newValue, index) => {
        ic_st_setFilterOptionsList([...ic_st_filterOptionsList, ic_st_filterOptionsList[index]['propertyValue'] = newValue])
    }
    const ic_sf_constructQRData = () => {
        let objString = JSON.stringify({
            'id': ic_st_currentSelectedRowData[0]['id'],
            'blok': ic_st_currentSelectedRowData[0]['blok'],
            'nomor-rumah': ic_st_currentSelectedRowData[0]['nomor-rumah'],
            'sisa': ic_st_currentSelectedRowData[0]['sisa'],
            'status-invoice': true,
        })
        return objString;
    }
    const ic_sf_handlePrint = useReactToPrint({
        content: () => ic_componentRef.current,
    });
    const ic_sf_checkIfPropertyLengthValueIsZero = (index) => {
        return ic_st_filterOptionsList[index]['propertyValue'].length === 0 ? true : false
    }
    /**
     *     //create report
    const ic_af_createReport = async (category, currentUser) => {
        try {
            ////outline-report/2021/bulan/januari/blok/A/biaya/retribusi/kolektor/programmer/
            const separatedDate = getSeparatedDate(Date.now());
            //laporan per blok
            await setDoc(doc(db, 'per-blok-report', `${separatedDate.year}`, "bulan", `${separatedDate.month}`, 'blok', 'A', 'biaya', category, 'kolektor', `id${currentUser.uid}`), {
                "total": 100000,
                "kolektor": currentUser
            })
            //laporan gabungan 
            await setDoc(doc(db, 'merged-report', `${separatedDate.year}`, "bulan", `${separatedDate.month}`, 'biaya', category, 'kolektor', `id${currentUser.uid}`), {
                "total": 100000,
                "kolektor": currentUser
            })
        } catch (err) {
            console.log(err.message);
            alert(err.message);
        }
    }
     */
    //lihat tagihan table column structure
    const ic_columns = [
        //{ field: 'id', headerName: 'ID Invoice', width: 150, editable: false },
        { field: 'blok', headerName: 'Blok', width: 150, editable: false },
        { field: 'nomor-rumah', headerName: 'Nomor Rumah', width: 150, editable: false },
        //{ field: 'banyak-biaya', headerName: 'Banyak Biaya', width: 150, editable: false },
        { field: 'biaya', headerName: 'Total Biaya', width: 150, editable: false },
        { field: 'status-invoice', headerName: 'Status', width: 150, editable: false },
        //{ field: 'sudah-dibayar', headerName: 'Sudah Dibayar', width: 150, editable: false },
        //{ field: 'sisa', headerName: 'Sisa', width: 150, editable: false },
        //{ field: 'nomor-kk', headerName: 'Nomor KK', width: 150, editable: false },
        //{ field: 'nomor-telpon', headerName: 'Nomor Telpon', width: 150, editable: false },
        //{ field: 'nomor-hp', headerName: 'Nomor HP', width: 150, editable: false },
        //{ field: 'email', headerName: 'Email', width: 150, editable: false },
        //{ field: 'tanggal-aktif', headerName: 'Tanggal Aktif', width: 150, editable: false },
        //{ field: 'tanggal-dibuat', headerName: 'Tanggal Dibuat', width: 150, editable: false },
        //{ field: 'tanggal-dibayar', headerName: 'Tanggal Dibayar', width: 150, editable: false },
        { field: 'bulan', headerName: 'Bulan', width: 150, editable: false },
        { field: 'tahun', headerName: 'Tahun', width: 150, editable: false },
        { field: 'tanggal-aktif', headerName: 'Tanggal Aktif', width: 150, editable: false }
    ];
    //use view data hooks
    const [
        ic_st_msgSeverity,
        ic_af_deleteSelectedBills,
        ic_st_currentSelectedIDs,
        ic_st_isSnackbarShown,
        ic_st_setIsSnackbarShown,
        ic_af_updateData,
        ic_st_currentSelectedRowData,
        ic_st_isAlertShown,
        ic_st_alertMessage,
        ic_st_setIsAlertShown,
        ic_af_showData,
        ic_sf_handleSelectedFilterChange,
        ic_st_rows,
        ic_st_isLoading,
        ic_sf_setCurrentSelectedRowData,
        ic_st_setIsCheckbox,
        ic_st_isCheckbox,
        ic_st_isEditDialogOpen,
        ic_st_setIsEditDialogOpen
    ] = useViewData(ic_st_filterOptionsList, ic_st_setFilterOptionsList, 'invoice');
    //redux path updater hooks
    const [r_currentPathState] = usePathUpdater('Lihat Invoice');
    const [currentScannedId, setCurrentScannedId] = useState(null);
    const [isScannedIdDialogShown, setIsScannedIdDialogShown] = useState(false);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, `scannedId/${r_currentUser.uid}`), (doc) => {
            if (currentScannedId !== null) {
                console.log("Current data: ", doc.data());
                setIsScannedIdDialogShown(true);
            }
            setCurrentScannedId(doc.data())
        });
    }, [])
    //-----------------------------------------------------------------------------------------------------------//
    return (
        <div>
            {/** scanned id component */}
            {
                isScannedIdDialogShown ?
                    <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        width: '100%',
                        height: '100vh',
                        top: 0,
                        left: 0,
                        zIndex: 10000,
                        position: 'fixed',
                        boxSizing: 'border-box',
                        padding: '20px',
                    }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Paper sx={{ display: 'inline-block' }}>
                                <Box sx={{ padding: '10px' }}>
                                    <Link to={`/lihat-invoice/`} style={{ textDecoration: "none" }}>
                                        Lihat Invoice {currentScannedId}
                                    </Link>
                                </Box>
                                <Divider />
                                <Box sx={{ padding: '10px' }}>
                                    <Button variant={'contained'} onClick={() => setIsScannedIdDialogShown(false)} >Batal</Button>
                                </Box>
                            </Paper>
                        </div>
                    </div>
                    :
                    <div></div>
            }
            {/** filter component */}
            <RMSFilter
                options={ic_st_filterOptionsList}
                isAlertShown={ic_st_isAlertShown}
                alertMessage={ic_st_alertMessage}
                setAlertVisibilty={() => { ic_st_setIsAlertShown(false) }}
                showDataFunction={ic_af_showData}
                handleSelectFilterChange={(value, booleanValue) => ic_sf_handleSelectedFilterChange(value, booleanValue)}
                handleResetFilter={() => ic_st_setFilterOptionsList(ic_filterOptionsList)}
            />
            {/** linear progress bar */}
            <LinearProgress color="secondary" sx={{ display: ic_st_isLoading ? 'default' : 'none' }} />
            {/** edit data dialog component */}
            <RMSPayInvoice
                selectedRows={ic_st_currentSelectedRowData}
                isOpen={ic_st_isEditDialogOpen}
                cancelEdit={() => ic_st_setIsEditDialogOpen(false)}
                updateData={ic_af_updateData}
            />
            {/** split view between invoice and its detail */}
            <RMSDataDisplay
                isDetailShown={ic_st_isInvoiceDetailOpen}
                columns={ic_columns}
                rows={ic_st_rows}
                isLoading={ic_st_isLoading}
                isCheckbox={ic_st_isCheckbox}
                handleSelectionModelChange={(g) => ic_sf_setCurrentSelectedRowData(g)}
                handleMultipleSelectionButton={() => { ic_st_setIsCheckbox(!ic_st_isCheckbox) }}
                handleDeleteButton={async () => {
                    try {
                        await ic_af_deleteSelectedBills(ic_st_currentSelectedIDs);
                        for (let i = 0; i < ic_st_currentSelectedIDs.length; i++) {
                            //substract ikk report
                            await substractIkkReport(ic_st_currentSelectedRowData[i]['status-invoice'] === 'LUNAS' ? true : false, ic_st_currentSelectedRowData[i]['blok'], ic_st_currentSelectedRowData[i]['tahun'])
                            //substract all other report
                            //status, blok, norumah, tahun, bulan, kolektorId, kategori
                            const statusInvoice = ic_st_currentSelectedRowData[i]['status-invoice'] === 'LUNAS' ? true : false;
                            const blokINV = ic_st_currentSelectedRowData[i]['blok'];
                            const tahunINV = ic_st_currentSelectedRowData[i]['tahun'];
                            const bulanINV = ic_st_currentSelectedRowData[i]['bulan'];
                            const kolektorINV = ic_st_currentSelectedRowData[i]['kolektor']['uid']; //may cause bug
                            const kategoriINV = ic_st_currentSelectedRowData[i]['kategori'];
                            const biayaINV = ic_st_currentSelectedRowData[i]['biaya'];
                            await substractReport(statusInvoice, blokINV, tahunINV, bulanINV, kolektorINV, kategoriINV, biayaINV);
                        }
                    } catch (err) {
                        console.log(err.message);
                    }
                }}
                handleEditButton={async () => {
                    ic_st_setIsEditDialogOpen(true);
                }}
                currentSelectedIDs={ic_st_currentSelectedIDs}
                openInvoice={() => ic_st_setIsInvoiceDetailOpen(!ic_st_isInvoiceDetailOpen)}
                openPrintInvoice={() => { ic_st_setIsPrintPreviewShown(true) }}
                openDiscountDialog={() => { ic_st_setIsDiscountDialogOpen(true); ic_st_setProposedPrice(ic_st_currentSelectedRowData[0]['biaya']) }}
                handleCreateReport={() => {
                    ic_st_setIsLoadingIn(true);
                    ic_st_setIsFullScreenDialogOpen(true);
                }}
                isProcessingData={ic_st_isLoadingIn}
            >
                <RMSInvoiceDetail
                    isOpen={ic_st_isInvoiceDetailOpen}
                    currentRow={ic_st_currentSelectedRowData}
                    handleBackButton={() => ic_st_setIsInvoiceDetailOpen(false)}
                />
            </RMSDataDisplay>
            {/** snack bar */}
            <Snackbar open={ic_st_isSnackbarShown} autoHideDuration={2000} onClose={() => { ic_st_setIsSnackbarShown(false) }}>
                <Alert onClose={() => { ic_st_setIsSnackbarShown(false) }} severity={ic_st_msgSeverity} sx={{ width: '100%' }}>
                    {ic_st_alertMessage}
                </Alert>
            </Snackbar>
            {/** cetak invoice */}
            <TopPrintPreview isOpen={ic_st_isPrintPreviewShown} handleCancel={() => ic_st_setIsPrintPreviewShown(false)} handlePrint={() => {
                ic_sf_handlePrint();
                ic_st_setIsPrintPreviewShown(false);
                //do print
            }}>
                <RMSInvoiceDetail
                    ref={ic_componentRef}
                    isOpen={ic_st_isPrintPreviewShown}
                    currentRow={ic_st_currentSelectedRowData}
                    handleBackButton={() => ic_st_setIsInvoiceDetailOpen(false)}
                >
                    <QRCode size={64} value={ic_st_currentSelectedRowData.length > 0 ? ic_sf_constructQRData() : 'invalid'} />
                </RMSInvoiceDetail>
            </TopPrintPreview>
            {/** report from invoice dialog */}
            <RMSFullScreenDialog
                isOpen={ic_st_isFullScreenDialogOpen}
                handleClose={() => ic_st_setIsFullScreenDialogOpen(false)}
            >
                {/** table */}
                <RMSDisplayTable
                    startProcess={() => ic_st_setIsLoadingIn(true)}
                    tableHead={['nama-daftar-tagihan', 'blok', 'nomor-rumah', 'bulan', 'tahun', 'status-invoice', 'biaya']}
                    rows={ic_st_rows}
                    finishProcess={() => ic_st_setIsLoadingIn(false)}
                />
            </RMSFullScreenDialog>
            {/** special price dialog */}
            {
                ic_st_isDiscountDialogOpen ?
                    <Dialog open={ic_st_isDiscountDialogOpen} onClose={() => ic_st_setIsDiscountDialogOpen(false)}>
                        <DialogTitle>Beri Harga Khusus</DialogTitle>
                        <DialogContent>
                            <Stack direction={'column'}>
                                <RMSTextField type={'number'} isError={false} isRequired={true} displayFilter={'default'} label={'Harga Khusus'} helperText={'Masukkan Harga Khusus'} value={ic_st_proposedPrice} handleChange={(value) => { ic_st_setProposedPrice(value) }} disabled={false} />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { ic_st_setIsDiscountDialogOpen(false); ic_st_setProposedPrice(0) }}>Batal</Button>
                            <Button variant={'contained'} onClick={() => { ic_af_updatePriceBasedOnProposedPrice() }} >Oke</Button>
                        </DialogActions>
                    </Dialog>
                    :
                    <></>
            }
        </div>
    )
}
export default RMSLihatInvoice;