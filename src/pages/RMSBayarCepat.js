import React from 'react';
import { Box, Paper, Divider, Select, MenuItem, Typography, Button } from '@mui/material';

const RMSBayarCepat = () => {
    return (
        <>
            <Box sx={{ marginBottom: '15px' }}>
                <Paper>
                    <Box sx={{ padding: '10px' }}>
                        <Select title={'Blok'} ></Select>
                        <Select title={'Bulan'} ></Select>
                        <Select title={'Tahun'} ></Select>
                    </Box>
                    <Divider />
                    <Box sx={{ padding: '10px' }}>

                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default RMSBayarCepat;