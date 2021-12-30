import React from 'react';
import {Dialog,Divider,DialogContent,DialogActions,Button,BasicTable} from '@mui/material';

const RMSPrintInvoice = (props) => {
    return (
        <Dialog open={false}>
            <DialogTitle>Cetak Invoice</DialogTitle>
            <Divider />
            <DialogContent ref={componentRef}>
                <h3>Invoice #0000001</h3>
                <div>
                    <span>Blok</span> <span>{"selectedBlokState"}</span>
                </div>
                <div>
                    <span>No.</span> <span>{"selectedNoRumah"}</span>
                </div>
                <BasicTable rows={[]} />
                <Box sx={{ marginTop: '20px', marginBottom: '10px' }}>
                    <QRCode value={'test'} size={96} />
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button sx={{ margin: "5px" }} startIcon={<CancelIcon />} onClick={() => {
                    //handlePrint();
                    setIsPrintWindowOpen(false)
                }} variant="outlined" disabled={false}>Batal</Button>
                <Button sx={{ margin: "5px" }} startIcon={<PrintIcon />} onClick={() => {
                    handlePrint();
                    setIsPrintWindowOpen(false)
                }} variant="contained" disabled={false}>Cetak</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RMSPrintInvoice;