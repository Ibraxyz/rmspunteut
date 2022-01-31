import React from 'react';
import { Paper, Stack, Box, Divider } from '@mui/material';

const RMSTFDLayout = ({ children }) => {
    const [title, filter, table] = children;
    return (
        <Paper>
            {/** title */}
            <Box sx={{ padding: '10px' }}>
                {title}
            </Box>
            {/** filter */}
            <Box sx={{ padding: '10px' }}>
                {filter}
            </Box>
            <Divider />
            {/** table */}
            <Box sx={{ padding: '10px' }}>
                {table}
            </Box>
        </Paper>
    )
}

export default RMSTFDLayout;