import React, { useState, useEffect } from "react";
import RMSFilter from '../components/RMSFilter';
import RMSStaticEditData from '../components/RMSStaticEditData';
import RMSDataDisplay from '../components/RMSDataDisplay';
//date-fns
import { getTime } from 'date-fns';
//hooks
import useViewData from "../hooks/useViewData";
import usePathUpdater from "../hooks/usePathUpdater";
//material ui
import { LinearProgress, Snackbar, Alert } from '@mui/material';
import RMSInvoiceDetail from "../components/RMSInvoiceDetail";
import RMSPayInvoice from "../components/RMSPayInvoice";

const LihatTagihan = () => {
    //--------------------------------------------------------------------------------------------------//
    //Filter options list
    const ic_filterOptionsList = [
        {
            "text": "Status",
            "helperText": "Pilih status tagihan",
            "value": "status-tagihan", //select option stuff
            "propertyValue": false, //actual state value
            "type": "select",
            "items": [true, false].map((b) => { return { "text": b === true ? "LUNAS" : "BELUM LUNAS", "value": b } }),
            "isSelected": false,
            "handleChange": (newValue, index) => ic_sf_handleFilterOptionsValueChange(newValue, index),
            "isError": () => { return false },
            "isRequired": true
        },
        {
            "text": "Blok",
            "helperText": "Pilih blok",
            "value": "blok", //select option stuff
            "propertyValue": "A", //actual state value
            "type": "select",
            "items": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((alphabet) => { return { "text": alphabet, "value": alphabet } }),
            "isSelected": false,
            "handleChange": (newValue, index) => ic_sf_handleFilterOptionsValueChange(newValue, index),
            "isError": () => { return false },
            "isRequired": true
        },
        {
            "text": "Tagihan",
            "helperText": "Pilih Jenis Tagihan",
            "value": "tagihan", //select option stuff
            "propertyValue": "Iuran Keamanan", //actual state value
            "type": "select",
            "items": ["Iuran Keamanan", "Iuran Kebersihan", "Iuran Listrix"].map((alphabet) => { return { "text": alphabet, "value": alphabet } }),
            "isSelected": false,
            "handleChange": (newValue, index) => ic_sf_handleFilterOptionsValueChange(newValue, index),
            "isError": () => { return false },
            "isRequired": true
        },
        {
            "text": "Nomor Tagihan",
            "helperText": "Masukkan Nomor Tagihan",
            "value": "nomor-tagihan", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Nomor KK",
            "helperText": "Masukkan Nomor KK",
            "value": "nomor-kk", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
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
            "text": "Nomor Hp",
            "helperText": "Masukkan Nomor Hp",
            "value": "nomor-hp", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Nomor Telpon",
            "helperText": "Masukkan Nomor Telpon",
            "value": "nomor-telpon", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
            "text": "Email",
            "helperText": "Masukkan Alamat Email",
            "value": "email", //select option stuff
            "propertyValue": [], //actual state value
            "type": "text",
            "items": [],
            "isSelected": false,
            "handleChange": (newValue, index) => { ic_sf_handleFilterOptionsValueChange(newValue, index) },
            "isError": (index) => { return ic_sf_checkIfPropertyLengthValueIsZero(index); },
            "isRequired": true
        },
        {
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
    ]
    //state
    const [ic_st_filterOptionsList, ic_st_setFilterOptionsList] = useState(ic_filterOptionsList);
    const [ic_st_isInvoiceDetailOpen, ic_st_setIsInvoiceDetailOpen] = useState(false);
    //functions
    const ic_sf_handleFilterOptionsValueChange = (newValue, index) => {
        ic_st_setFilterOptionsList([...ic_st_filterOptionsList, ic_st_filterOptionsList[index]['propertyValue'] = newValue])
    }
    const ic_sf_checkIfPropertyLengthValueIsZero = (index) => {
        return ic_st_filterOptionsList[index]['propertyValue'].length === 0 ? true : false
    }
    //lihat tagihan table column structure
    const ic_columns = [
        { field: 'nomor-tagihan', headerName: 'ID. Tagihan', width: 150, editable: false },
        { field: 'kelompok-tagihan', headerName: 'Kelompok Faktur', width: 150, editable: false },
        { field: 'nomor-kk', headerName: 'No. KK', width: 150, editable: false },
        { field: 'tagihan', headerName: 'Jenis Tagihan', width: 150, editable: false },
        { field: 'biaya', headerName: 'Biaya', width: 150, editable: false, type: 'number' },
        { field: 'sudah-dibayar', headerName: 'Sudah Dibayar', width: 150, editable: false, type: 'number' },
        { field: 'sisa', headerName: 'Sisa', width: 150, editable: false, type: 'number' },
        { field: 'status-tagihan', headerName: 'Status', width: 150, editable: false },
        { field: 'status-kelompok-tagihan', headerName: 'Status Kelompok Tagihan', width: 300, editable: false },
        { field: 'blok', headerName: 'Blok', width: 150, editable: false },
        { field: 'nomor-rumah', headerName: 'No. Rumah', width: 150, editable: false },
        { field: 'nomor-telpon', headerName: 'No. Telp', width: 150, editable: false, type: 'number' },
        { field: 'nomor-hp', headerName: 'No. HP', width: 150, editable: false, type: 'number' },
        { field: 'email', headerName: 'Email', width: 150, editable: false },
        { field: 'tanggal-dibuat', headerName: 'Tanggal Dibuat', width: 150, editable: false, type: 'date' },
        { field: 'tanggal-aktif', headerName: 'Tanggal Aktif', width: 150, editable: false, type: 'date' },
        { field: 'tanggal-dibayar', headerName: 'Tanggal Dibayar', width: 150, type: 'date', editable: false },
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
    ] = useViewData(ic_st_filterOptionsList, ic_st_setFilterOptionsList, 'tagihan');
    //redux path updater hooks
    const [r_currentPathState] = usePathUpdater('Lihat Tagihan');
    //-----------------------------------------------------------------------------------------------------------//
    return (
        <div>
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
            {/** data display component */}
            <RMSDataDisplay
                isOpen={!ic_st_isInvoiceDetailOpen}
                columns={ic_columns}
                rows={ic_st_rows}
                isLoading={ic_st_isLoading}
                isCheckbox={ic_st_isCheckbox}
                handleSelectionModelChange={(g) => ic_sf_setCurrentSelectedRowData(g)}
                handleMultipleSelectionButton={() => { ic_st_setIsCheckbox(!ic_st_isCheckbox) }}
                handleDeleteButton={() => { ic_af_deleteSelectedBills(ic_st_currentSelectedIDs) }}
                handleEditButton={async () => {
                    ic_st_setIsEditDialogOpen(true);
                }}
                currentSelectedIDs={ic_st_currentSelectedIDs}
                openInvoice={() => ic_st_setIsInvoiceDetailOpen(true)}
                openHistory={() => { }}
            />
            {/** edit data dialog component */}
            <RMSPayInvoice
                selectedRows={ic_st_currentSelectedRowData}
                isOpen={ic_st_isEditDialogOpen}
                cancelEdit={() => ic_st_setIsEditDialogOpen(false)}
                updateData={ic_af_updateData}
            />
            {/** Invoice Detail */}
            <RMSInvoiceDetail
                isOpen={ic_st_isInvoiceDetailOpen}
                handleBackButton={() => ic_st_setIsInvoiceDetailOpen(false)}
            />
            {/** snack bar */}
            <Snackbar open={ic_st_isSnackbarShown} autoHideDuration={2000} onClose={() => { ic_st_setIsSnackbarShown(false) }}>
                <Alert onClose={() => { ic_st_setIsSnackbarShown(false) }} severity={ic_st_msgSeverity} sx={{ width: '100%' }}>
                    {ic_st_alertMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default LihatTagihan;
