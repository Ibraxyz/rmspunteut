import React, { forwardRef } from 'react';
import { Divider, Stack, Box, Typography, Grid } from "@mui/material";
//material ui
import { Paper } from '@mui/material';
import { formatRupiah } from '../rms-utility/rms-utility';
//images
//logo
import Logo from '../images/logo.png';

const top_defineMonthName = (month) => {
    let name = null;
    switch (month) {
        case 1:
            name = 'Januari'
            break;
        case 2:
            name = 'Februari'
            break;
        case 3:
            name = 'Maret'
            break;
        case 4:
            name = 'April'
            break;
        case 5:
            name = 'Mei'
            break;
        case 6:
            name = 'Juni'
            break;
        case 7:
            name = 'Juli'
            break;
        case 8:
            name = 'Agustus'
            break;
        case 9:
            name = 'September'
            break;
        case 10:
            name = 'Oktober'
            break;
        case 11:
            name = 'November'
            break;
        case 12:
            name = 'Desember'
            break;
        default:
            break;
    }
    return name;
}

const RMSInvoiceDetail = forwardRef((props, ref) => {
    const ic_sf_showCollector = () => {
        try {
            let parsedCollector = JSON.parse(props.currentRow[0]['kolektor']);
            return (
                parsedCollector.name
            )
        } catch (err) {
            console.log(err.message);
            return '-';
        }
    }
    return (
        <div ref={ref}>
            {props.currentRow.length === 0 ? <Paper sx={{ display: props.isOpen ? 'default' : 'none', padding: '10px' }}>No Data Selected</Paper> :
                <Paper sx={{ display: props.isOpen ? 'default' : 'none', padding: '10px' }}>
                    <Grid container sx={{ paddingBottom: '10px' }} spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <img src={Logo} alt="" style={{ height: '64px', width: 'auto' }} />
                            <Typography variant="h6" display={'block'}>Detail Invoice</Typography>
                            <Typography variant="subtitle2" display={'block'} sx={{ opacity: 0.4 }}>#{props.currentRow[0]['id']}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} textAlign={{ xs: 'left', sm: 'right' }}>
                            <Box>
                                {
                                    props.children
                                }
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Box sx={{ padding: '10px', marginTop: '10px', marginBottom: '10px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                        {/**
                            Stack justifyContent={'space-between'} direction={'row'}>
                            <Typography variant="caption" display={'block'}>{'Nomor KK'}</Typography>
                            <Typography variant="caption" display={'block'}>{props.currentRow[0]['nomor-kk']}</Typography>
                            </Stack>
                         */}
                        <Stack justifyContent={'space-between'} direction={'row'}>
                            <Typography variant="caption" display={'block'}>{'Blok'}</Typography>
                            <Typography variant="caption" display={'block'}>{props.currentRow[0]['blok']}</Typography>
                        </Stack>
                        <Stack justifyContent={'space-between'} direction={'row'}>
                            <Typography variant="caption" display={'block'}>{'Nomor Rumah'}</Typography>
                            <Typography variant="caption" display={'block'}>{props.currentRow[0]['nomor-rumah']}</Typography>
                        </Stack>
                        <Stack justifyContent={'space-between'} direction={'row'}>
                            <Typography variant="caption" display={'block'}>{'Bulan'}</Typography>
                            <Typography variant="caption" display={'block'}>{top_defineMonthName(props.currentRow[0]['bulan'])}</Typography>
                        </Stack>
                        <Stack justifyContent={'space-between'} direction={'row'}>
                            <Typography variant="caption" display={'block'}>{'Tahun'}</Typography>
                            <Typography variant="caption" display={'block'}>{props.currentRow[0]['tahun']}</Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ paddingTop: '10px', paddingBottom: '10px', paddingLeft: '5px', paddingRight: '5px' }}>
                        <Stack spacing={1} direction={"column"}>
                            {
                                JSON.parse(props.currentRow[0]['tagihan']).map((ndt) => {
                                    return (
                                        <Stack justifyContent={'space-between'} direction={'row'}>
                                            <Typography variant="caption" display={'block'}>{ndt.jenis}</Typography>
                                            <Typography variant="caption" display={'block'}>{formatRupiah(ndt.biaya)}</Typography>
                                        </Stack>
                                    )
                                })
                            }
                            <Divider />
                            <Stack spacing={1} alignItems={'flex-end'}>
                                <Typography variant="caption" display={'block'}>Sub Total : {formatRupiah(props.currentRow[0]['subtotal'])}</Typography>
                                <Typography variant="caption" display={'block'}>Potongan : {formatRupiah(props.currentRow[0]['potongan']) + `%`}</Typography>
                                <Typography variant="subtitle2" display={'block'}>Total : {formatRupiah(props.currentRow[0]['biaya'])}</Typography>
                                <Typography variant="caption" display={'block'}>Sudah Dibayar : {formatRupiah(props.currentRow[0]['sudah-dibayar'])}</Typography>
                                <Typography variant="caption" display={'block'}>Sisa : {formatRupiah(props.currentRow[0]['sisa'])}</Typography>
                                <Typography variant="caption" display={'block'} sx={{ color: props.currentRow[0]['status-invoice'] === 'BELUM LUNAS' ? 'red' : 'green' }}>{props.currentRow[0]['status-invoice']}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <Divider />
                    <Typography variant="caption" display={'block'} sx={{ marginTop: '2px' }}>Kolektor : {ic_sf_showCollector()}</Typography>
                    <Divider />
                    <Typography variant="caption" display={'block'} sx={{ opacity: 0.6, marginTop: '10px' }}>{`Invoice ini aktif mulai dari : ${props.currentRow[0]['tanggal-aktif']}`}</Typography>
                </Paper>
            }
        </div>
    )
})

export default RMSInvoiceDetail;
