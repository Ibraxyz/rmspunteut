/*
import React,{useState} from "react";
import MITDataGrid from '../components/MITDataGrid';
import { Skeleton, Box, Button, Paper, Divider, Chip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RMSDatePicker from "../components/RMSDatePicker";
import RMSSelect from "../components/RMSSelect";
import RMSTextField from "../components/RMSTextField";
import RMSAlert from "../components/RMSAlert";
import useLihatLogic from "../hooks/useLihatLogic";

const LihatTagihan = (props) => {
    const [
        blocks,
        setBlok,
        nomorTagihan,
        isNomorTagihanFilterShow,
        tagihan,
        blok,
        noRumah,
        tanggalMulai,
        tanggalAkhir,
        status,
        nomorKk,
        isFilterDangerALertShow,
        handleSelectFilterOps,
        handleDelete,
        removedListFilter,
        setIsFilterDangerAlertShow,
        isTagihanFilterShow,
        jenisTagihan,
        setTagihan,
        isBlokFilterShow,
        setNomorTagihan,
        setNomorKk,
        setNoRumah,
        nomorHp,
        setNomorHp,
        nomorTelp,
        isTelpRumahFilterShow,
        setNomorTelp,
        isAlamatEmailFilterShow,
        email,
        setEmail,
        setTanggalMulai,
        setTanggalAkhir,
        isStatusFilterShow,
        statusTagihan,
        setStatus,
        isNomorKKFilterShow,
        isNomorRumahFilterShow,
        isNomorHPFilterShow,
        isTanggalFilterShow,
        setIsSelectFilterShow,
        isSelectFilterShow,
        listFilterState,
        setIsNomorTagihanFilterShow,
        setIsNomorKKFilterShow,
        setIsTagihanFilterShow,
        setIsAlamatEmailFilterShow,
        setIsStatusFilterShow,
        setIsNomorRumahFilterShow,
        setIsTelpRumahFilterShow,
        setIsBlokFilterShow,
        setIsNomorHPFilterShow,
        setIsTanggalFilterShow,
        resetFilter,
        populateTable,
        isLoading,
        rows
    ] = useLihatLogic("Lihat Tagihan");
    const d_columns = [
        { field: 'col1', headerName: 'No. Tagihan', width: 150 },
        { field: 'col2', headerName: 'Jenis Tagihan', width: 150 },
        { field: 'col3', headerName: 'Biaya', width: 150 },
        { field: 'col4', headerName: 'Sudah Dibayar', width: 150 },
        { field: 'col5', headerName: 'Sisa', width: 150 },
        { field: 'col6', headerName: 'Status', width: 150 },
        { field: 'col7', headerName: 'Blok', width: 150 },
        { field: 'col8', headerName: 'No. Rumah', width: 150 },
        { field: 'col9', headerName: 'No. KK', width: 150 },
        { field: 'col10', headerName: 'No. Telp', width: 150 },
        { field: 'col11', headerName: 'No. HP', width: 150 },
        { field: 'col12', headerName: 'Email', width: 150 },
        { field: 'col13', headerName: 'Tanggal Dibuat', width: 150 },
        { field: 'col14', headerName: 'Tanggal Aktif', width: 150 },
        { field: 'col15', headerName: 'Tanggal Dibayar', width: 150 },
    ];
    const selectionModelChangeAction = (g) => {
        console.log("g",g);
        setCurrentSelectedIds(g);
    }
    const editRowsModelChangeAction = (e)=>{
        console.log('onEditRowsModelChange',e)
    }
    const [currentSelectedIds, setCurrentSelectedIds] = useState([]);
    return (
        <div>
            <div style={{ display: "none" }}>
                <h3>Internal State Checker</h3>
                <div>{tagihan}</div>
                <div>{blok}</div>
                <div>{noRumah}</div>
                <div>{tanggalMulai}</div>
                <div>{tanggalAkhir}</div>
                <div>{status}</div>
                <div>{nomorKk}</div>
            </div>
            <Box style={{ marginBottom: "20px" }}>
                <Paper>
                    <Box sx={{ padding: "10px" }}>
                        <RMSAlert isOpen={isFilterDangerALertShow} message={""} setIsOpen={() => { setIsFilterDangerAlertShow(false) }} />
                        <RMSSelect isError={((tagihan === null || tagihan.length === 0) && isFilterDangerALertShow)} isRequired={true} displayFilter={isTagihanFilterShow ? "default" : "none"} label={"Tagihan"} helperText={"Jenis Tagihan"} items={jenisTagihan} value={tagihan} handleChange={(value) => { setTagihan(value) }} />
                        <RMSSelect isError={((blok === null || blok.length === 0) && isFilterDangerALertShow)} isRequired={true} displayFilter={isBlokFilterShow ? "default" : "none"} label={"Blok"} helperText={"Pilih Blok Rumah"} items={blocks} value={blok} handleChange={(value) => { setBlok(value) }} />
                        <RMSTextField isError={((nomorTagihan === null || nomorTagihan.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorTagihanFilterShow ? "default" : "none"} label={"Nomor Tagihan"} helperText={"Masukkan Nomor Tagihan"} value={nomorTagihan} handleChange={(value) => setNomorTagihan(value)} />
                        <RMSTextField isError={((nomorKk === null || nomorKk.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorKKFilterShow ? "default" : "none"} label={"Nomor KK"} helperText={"Masukkan Nomor KK"} value={nomorKk} handleChange={(value) => setNomorKk(value)} />
                        <RMSTextField isError={((noRumah === null || noRumah.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorRumahFilterShow ? "default" : "none"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={noRumah} handleChange={(value) => { setNoRumah(value) }} />
                        <RMSTextField isError={((nomorHp === null || nomorHp.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorHPFilterShow ? "default" : "none"} label={"Nomor HP"} helperText={"Masukkan Nomor HP"} value={nomorHp} handleChange={(value) => { setNomorHp(value) }} />
                        <RMSTextField isError={((nomorTelp === null || nomorTelp.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isTelpRumahFilterShow ? "default" : "none"} label={"Telp Rumah"} helperText={"Masukkan Nomor Telp Rumah"} value={nomorTelp} handleChange={(value) => { setNomorTelp(value) }} />
                        <RMSTextField isError={((email === null || email.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isAlamatEmailFilterShow ? "default" : "none"} label={"Alamat Email"} helperText={"Masukkan Alamat Email"} value={email} handleChange={(value) => { setEmail(value) }} />
                        <RMSDatePicker isError={((tanggalMulai === null || tanggalMulai.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isTanggalFilterShow ? "default" : "none"} title={"Dari tanggal"} helperText={"Mulai Dari tanggal"} value={tanggalMulai} handleChange={(val) => { setTanggalMulai(val) }} />
                        <RMSDatePicker isError={((tanggalAkhir === null || tanggalAkhir.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isTanggalFilterShow ? "default" : "none"} title={"Sampai tanggal"} helperText={"Sampai dengan tanggal"} value={tanggalAkhir} handleChange={(val) => { setTanggalAkhir(val) }} />
                        <RMSSelect isError={((status === null || status.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isStatusFilterShow ? "default" : "none"} label={"Status"} helperText={"Status Tagihan"} items={statusTagihan} value={status} handleChange={(value) => { setStatus(value) }} />
                        <Box style={{ margin: "5px 5px 10px 5px" }}>
                            <Button variant="outlined" startIcon={<AddIcon />} disabled={
                                isTagihanFilterShow
                                    && isBlokFilterShow
                                    && isNomorTagihanFilterShow
                                    && isNomorKKFilterShow
                                    && isNomorRumahFilterShow
                                    && isNomorHPFilterShow
                                    && isTanggalFilterShow
                                    && isTelpRumahFilterShow
                                    && isAlamatEmailFilterShow
                                    && isStatusFilterShow ? true : false}
                                onClick={() => {
                                    setIsSelectFilterShow(!isSelectFilterShow)
                                }}>
                                Tambah FIlter
                            </Button>
                        </Box>
                        <RMSSelect isError={false} isRequired={true} displayFilter={isSelectFilterShow ? "default" : "none"} label={"Pilih FIlter"} helperText={"Filter Yang akan Digunakan"} items={listFilterState} value={status} handleChange={
                            (data) => {
                                switch (data) {
                                    case "nomor tagihan":
                                        handleSelectFilterOps("Nomor Tagihan", "nomor tagihan", () => {
                                            setIsNomorTagihanFilterShow(true);
                                        });
                                        break;
                                    case "nomor kk":
                                        handleSelectFilterOps("Nomor Kk", "nomor kk", () => {
                                            setIsNomorKKFilterShow(true);
                                        });
                                        break;
                                    case "nomor hp":
                                        handleSelectFilterOps("Nomor HP", "nomor hp", () => {
                                            setIsNomorHPFilterShow(true);
                                        });
                                        break;
                                    case "jenis tagihan":
                                        handleSelectFilterOps("Jenis Tagihan", "jenis tagihan", () => {
                                            setIsTagihanFilterShow(true);
                                        });
                                        break;
                                    case "tanggal tagihan":
                                        handleSelectFilterOps("Tanggal Tagihan", "tanggal tagihan", () => {
                                            setIsTanggalFilterShow(true);
                                        });
                                        break;
                                    case "email":
                                        handleSelectFilterOps("Email", "email", () => {
                                            setIsAlamatEmailFilterShow(true);
                                        });
                                        break;
                                    case "status tagihan":
                                        handleSelectFilterOps("Status Tagihan", "status tagihan", () => {
                                            setIsStatusFilterShow(true);
                                        });
                                        break;
                                    case "nomor rumah":
                                        handleSelectFilterOps("Nomor Rumah", "nomor rumah", () => {
                                            setIsNomorRumahFilterShow(true);
                                        });
                                        break;
                                    case "telp rumah":
                                        handleSelectFilterOps("Telp Rumah", "telp rumah", () => {
                                            setIsTelpRumahFilterShow(true);
                                        });
                                        break;
                                    case "blok":
                                        handleSelectFilterOps("Blok", "blok", () => {
                                            setIsBlokFilterShow(true);
                                        });
                                        setIsBlokFilterShow(true);
                                        break;
                                    default:
                                }
                            }
                        } />
                    </Box>
                    <Box sx={{ padding: "10px", display: removedListFilter.length == 0 ? "none" : "default" }}>
                        {
                            removedListFilter.map((lf) => <Chip label={lf.text} onDelete={() => {
                                //alert(lf.text);
                                handleDelete(lf.text, lf.value);
                                switch (lf.value) {
                                    case "nomor tagihan":
                                        setIsNomorTagihanFilterShow(false);
                                        break;
                                    case "nomor kk":
                                        setIsNomorKKFilterShow(false);
                                        break;
                                    case "nomor hp":
                                        setIsNomorHPFilterShow(false);
                                        break;
                                    case "jenis tagihan":
                                        setIsTagihanFilterShow(false);
                                        break;
                                    case "tanggal tagihan":
                                        setIsTanggalFilterShow(false);
                                        break;
                                    case "email":
                                        setIsAlamatEmailFilterShow(false);
                                        break;
                                    case "status tagihan":
                                        setIsStatusFilterShow(false);
                                        break;
                                    case "nomor rumah":
                                        setIsNomorRumahFilterShow(false);
                                        break;
                                    case "telp rumah":
                                        setIsTelpRumahFilterShow(false);
                                        break;
                                    case "blok":
                                        setIsBlokFilterShow(false);
                                        break;
                                    default:
                                }
                            }} sx={{ margin: "5px" }} />)
                        }
                    </Box>
                    <Divider />
                    <Box sx={{ padding: "10px" }}>
                        <Button variant="outlined" sx={{
                            margin: "5px"
                        }} disabled={removedListFilter.length === 0 ? true : false} onClick={resetFilter}>Reset Filter</Button>
                        <Button sx={{ margin: "5px" }} onClick={async () => await populateTable()} variant="contained" disabled={removedListFilter.length === 0 ? true : false}>Tampilkan Data</Button>
                    </Box>
                </Paper>
            </Box>
            {
                isLoading ?
                    <Box>
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                    </Box>
                    :
                    <MITDataGrid rows={rows} columns={d_columns} selectionModelChangeAction={(g) => selectionModelChangeAction(g)}  editRowsModelChangeAction={(e)=>editRowsModelChangeAction(e)}/>
            }
        </div>
    )
}

export default LihatTagihan;
*/

/**
 *  [tagihan,blok,noRumah,tanggalMulai,tanggalAkhir,status,nomorKk,isFilterDangerALertShow,handleSelectFilterOps,handleDelete,removedListFilter,isFilterDangerALertShow]
 */