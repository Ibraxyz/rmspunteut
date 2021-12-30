import React, { useState } from 'react';
import { Button, Box, Paper, Skeleton, Divider, Grid } from '@mui/material';
import MITDataGrid from '../components/MITDataGrid';
//icons
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DetailsIcon from '@mui/icons-material/Details';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const RMSDataDisplay = (props) => {
    const [ic_st_isMultipleSelectModeActive, ic_st_setIsMultipleSelectModeActive] = useState(false);
    const ic_sf_inspectIDsStatus = (id) => {
        const filtered = props.rows.filter((row) => {
            return row['id'] === id
        })
        try {
            let statusTagihan = filtered[0]['status-invoice'] === 'BELUM LUNAS' || filtered[0]['status-invoice'] === false ? false : true;
            return statusTagihan;
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <Box>
            {
                props.isLoading ?
                    <Box>
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                    </Box>
                    :
                    <Paper>
                        <Box sx={{ padding: "10px" }}>
                            {/** onSelectionModelChange => keluar id table yang dipilih */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={props.isDetailShown ? 8 : 12}>
                                    <MITDataGrid rows={props.rows} columns={props.columns} isCheckbox={props.isCheckbox} isCellEditable={false} selectionModelChangeAction={props.handleSelectionModelChange} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    {props.children}
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <Box sx={{ padding: "10px" }}>
                            <Button sx={{ margin: "5px" }} startIcon={props.isCheckbox ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />} onClick={() => { ic_st_setIsMultipleSelectModeActive(!ic_st_isMultipleSelectModeActive); props.handleMultipleSelectionButton() }} variant="outlined" disabled={false}>{ic_st_isMultipleSelectModeActive ? 'Seleksi Tunggal' : 'Seleksi Banyak'}</Button>
                            <Button sx={{ margin: "5px" }} startIcon={<DeleteIcon />} onClick={props.handleDeleteButton} variant="outlined" disabled={props.currentSelectedIDs.length === 0 ? true : false}>Hapus Invoice</Button>
                            <Button sx={{ margin: "5px", display: "default" }} startIcon={<PointOfSaleIcon />} onClick={props.handleEditButton} variant="outlined" disabled={ic_sf_inspectIDsStatus(props.currentSelectedIDs[0]) ? true : props.currentSelectedIDs.length === 0 || props.currentSelectedIDs.length > 1 ? true : false}>Bayar</Button>
                            <Button sx={{ margin: "5px", display: "default" }} startIcon={<DetailsIcon />} onClick={props.openInvoice} variant="outlined" disabled={props.currentSelectedIDs.length === 0 || props.currentSelectedIDs.length > 1 ? true : false}>{props.isDetailShown ? 'Tutup Detail' : 'Lihat Detail'}</Button>
                            <Button sx={{ margin: "5px", display: "default" }} startIcon={<ReceiptIcon />} onClick={props.openPrintInvoice} variant="outlined" disabled={props.currentSelectedIDs.length === 0 || props.currentSelectedIDs.length > 1 ? true : false}>Cetak Invoice</Button>
                            <Button sx={{ margin: "5px", display: "default" }} startIcon={<LocalOfferIcon />} onClick={props.openDiscountDialog} variant="outlined" disabled={ic_sf_inspectIDsStatus(props.currentSelectedIDs[0]) ? true : props.currentSelectedIDs.length === 0 || props.currentSelectedIDs.length > 1 ? true : false}>Beri Diskon</Button>
                        </Box>
                    </Paper>
            }
        </Box>
    )
}

export default RMSDataDisplay;