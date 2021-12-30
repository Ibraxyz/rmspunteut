import { useState } from 'react';

const useSnackbar = () => {
    const [h_st_isSnackbarShown, h_st_setIsSnackbarShown] = useState(false);
    const [h_st_message, h_st_setMessage] = useState('');
    const [h_st_severity, h_st_setSeverity] = useState('error')
    const h_sf_showSnackbar = (msg, severity) => {
        h_st_setMessage(msg);
        h_st_setSeverity(severity);
        h_st_setIsSnackbarShown(true);
    }
    const h_sf_closeSnackbar = ()=>{
        h_st_setIsSnackbarShown(false)
    }
    return [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar];
}

export default useSnackbar;