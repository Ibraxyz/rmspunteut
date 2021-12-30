import React from 'react';
import { Paper, Box, Divider, Typography, Stack } from '@mui/material';

const RMSReportCard = (props) => {
    return (
        <Box>
            <Paper>
                <Box sx={{ padding: '10px' }}>
                    <Stack direction={'column'} textAlign={'center'} spacing={1}>
                        <Typography variant={'caption'} >{props.title}</Typography>
                        <Typography variant={'h4'} >{props.total}</Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    )
}

export default RMSReportCard;