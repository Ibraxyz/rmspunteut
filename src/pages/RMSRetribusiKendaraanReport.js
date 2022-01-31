import React, { useState } from 'react';
import { Typography } from '@mui/material';
import RMSTFDLayout from '../components/RMSTFDLayout';
import RMSMonthlyFilter from '../components/RMSMonthlyFilter';
import RMSBaseTable from '../components/RMSBaseTable';

const RMSRetribusiKendaraanReport = () => {
    const [bulan, setBulan] = useState(null);
    const [tahun, setTahun] = useState(null);
    const [header, setHeader] = useState([]);
    const [rows, setRows] = useState([]);
    const handleBulanChange = () => {

    }
    const handleTahunChange = () => {

    }
    const showData = () => {

    }
    return (
        <RMSTFDLayout>
            <Typography>Laporan Retribusi Kendaraan Bulan {bulan} Tahun {tahun} </Typography>
            <RMSMonthlyFilter />
            <RMSBaseTable header={header} rows={rows} showData={showData} />
        </RMSTFDLayout>
    )
};

export default RMSRetribusiKendaraanReport;
