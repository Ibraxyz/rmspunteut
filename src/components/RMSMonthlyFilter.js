import React from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';
const RMSMonthlyFilter = ({ showData, handleBulanChange, handleTahunChange }) => {
    return (
        <Box>
            <Stack direction={'row'} spacing={1}>
                <TextField type="number" label={"Bulan"} onChange={handleBulanChange} />
                <TextField type="number" label={"Tahun"} onChange={handleTahunChange} />
                <Button variant={'contained'} onClick={showData}>Tampilkan Data</Button>
            </Stack>
        </Box>
    )
}

export default RMSMonthlyFilter;
