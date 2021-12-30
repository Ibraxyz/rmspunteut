import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const RMSSnackbar = (props) => {
    return (
        <Snackbar open={props.isOpen} autoHideDuration={2000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity={props.severity} sx={{ width: '100%' }}>
                {props.message}
            </Alert>
        </Snackbar>
    )
}

export default RMSSnackbar;