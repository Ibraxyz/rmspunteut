import React, { useEffect } from 'react';
import { Box, Paper, Divider } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RMSLoginPage = (props) => {
    return (
        <Box sx={{display:props.isVisible === true ? "default" : "none"}}>
            Login Page
        </Box>
    )
}

export default RMSLoginPage;