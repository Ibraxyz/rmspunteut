import React from 'react';
import { Box, Paper, Divider, Typography } from '@mui/material';

/** this pages reporting transaction based on collectors who processed the payment */

const Filter = () => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Typography vairant={'subtitle2'} >Filter</Typography>
    </Box>
  )
}

const Table = ({ header }) => {
  return (
    <div>
      {
        header.map((h) => {
          return (
            <h3>{h}</h3>
          )
        })
      }
    </div>
  )
}

const PageContent = ({ children }) => {
  const [filter, table] = children;
  return (
    <Paper>
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

function RMSCollectorReport() {
  return (
    <>
      <PageContent>
        <Filter />
        <Table header={['Kolektor1', 'Kolektor2', 'Kolektor3']} />
      </PageContent>
    </>
  );
}

export default RMSCollectorReport;
