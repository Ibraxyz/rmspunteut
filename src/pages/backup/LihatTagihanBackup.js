/**
 * import React, { useEffect, useState } from "react";
import MITDataGrid from '../../components/MITDataGrid';
import useDataOperations from '../../hooks/useDataOperations';
import { Skeleton, Box, Button, Paper, Divider, Snackbar, Chip, Alert, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RMSDatePicker from "../../components/RMSDatePicker";
import RMSSelect from "../../components/RMSSelect";
import RMSTextField from "../../components/RMSTextField";
import RMSAlert from "../../components/RMSAlert";
import RMSPrintSection from "../../components/RMSPrintSection";
import usePathUpdater from "../../hooks/usePathUpdater";

const LihatTagihanBackup = (props) => {
    const [r_currentPathState] = usePathUpdater("Lihat Tagihan");
    //data grid default values
    const d_rows = [];
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
    //custom hooks
    const [isLoading, data, addData, getData] = useDataOperations("tagihan");
    //state
    //alert visibility state
    const [isSuccessCreatingTagihanShow, setIsSuccessCreatingTagihanShow] = useState(false);
    //data grid state
    const [rows, setRows] = useState(d_rows);
    //filter state
    const [tagihan, setTagihan] = useState(null);
    const [status, setStatus] = useState(null);
    const [blok, setBlok] = useState(null);
    const [nomorTagihan, setNomorTagihan] = useState(null);
    const [nomorKk, setNomorKk] = useState(null);
    const [noRumah, setNoRumah] = useState(null);
    const [tanggalAkhir, setTanggalAkhir] = useState(null);
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [nomorHp, setNomorHp] = useState(null);
    const [nomorTelp, setNomorTelp] = useState(null);
    const [email, setEmail] = useState(null);
    //filter visibility state
    const [isTagihanFilterShow, setIsTagihanFilterShow] = useState(false);
    const [isBlokFilterShow, setIsBlokFilterShow] = useState(false);
    const [isNomorTagihanFilterShow, setIsNomorTagihanFilterShow] = useState(false);
    const [isNomorKKFilterShow, setIsNomorKKFilterShow] = useState(false);
    const [isNomorRumahFilterShow, setIsNomorRumahFilterShow] = useState(false);
    const [isTelpRumahFilterShow, setIsTelpRumahFilterShow] = useState(false);
    const [isAlamatEmailFilterShow, setIsAlamatEmailFilterShow] = useState(false);
    const [isTanggalFilterShow, setIsTanggalFilterShow] = useState(false);
    const [isStatusFilterShow, setIsStatusFilterShow] = useState(false);
    const [isSelectFilterShow, setIsSelectFilterShow] = useState(false);
    const [isNomorHPFilterShow, setIsNomorHPFilterShow] = useState(false);
    //filter logic state (use for database operation)
    const [filterLogicState, setFilterLogicState] = useState([]);
    //alert visibilty state
    const [isFilterDangerALertShow, setIsFilterDangerAlertShow] = useState(false);
    //const [isResetFilterButtonActive, setIsResetFilterButtonActive] = useState(false);
    const [removedListFilter, setRemovedListFilter] = useState([]);
    //functions
    const populateTable = async () => {
        console.log("populateTable");
        setIsFilterDangerAlertShow(false);
        //if filter is blank
        if (

            ((tagihan === null || tagihan.length === 0) && isTagihanFilterShow) || //ok
            ((status === null || status.length === 0) && isStatusFilterShow) || //ok
            ((blok === null || blok.length === 0) && isBlokFilterShow) || //ok
            ((nomorTagihan === null || nomorTagihan.length === 0) && isNomorTagihanFilterShow) ||
            ((nomorKk === null || nomorKk.length == 0) && isNomorKKFilterShow) || //ok
            ((noRumah === null || noRumah.length === 0) && isNomorRumahFilterShow) || //ok
            ((tanggalAkhir === null || tanggalAkhir.length === 0) && isTanggalFilterShow) ||
            ((tanggalMulai === null || tanggalMulai.length === 0) && isTanggalFilterShow) ||
            ((nomorHp === null || nomorHp.length === 0) && isNomorHPFilterShow) || //ok
            ((nomorTelp === null || nomorTelp.length === 0) && isTelpRumahFilterShow) || //ok
            ((email === null || email.length === 0) && isAlamatEmailFilterShow) //ok

        ) {
            setIsFilterDangerAlertShow(true);
            return;
        } else {
            //if not
            let tempFilter = [];
            let field = "";
            let operator = "";
            let value = "";

            removedListFilter.map((rlf, index) => {
                switch (rlf.value) {
                    case "nomor tagihan":
                        field = "no_tagihan";
                        operator = "==";
                        value = nomorTagihan;
                        break
                    case "nomor kk":
                        field = "no_kk";
                        operator = "==";
                        value = nomorKk;
                        break
                    case "nomor hp":
                        field = "hp";
                        operator = "==";
                        value = nomorHp;
                        break
                    case "telp rumah":
                        field = "telp";
                        operator = "==";
                        value = nomorTelp;
                        break
                    case "email":
                        field = "email";
                        operator = "==";
                        value = email;
                        break
                    case "jenis tagihan":
                        field = "jenis";
                        operator = "==";
                        value = tagihan;
                        break
                    case "blok":
                        field = "blok";
                        operator = "==";
                        value = blok;
                        break
                    case "nomor rumah":
                        field = "no_rumah";
                        operator = "==";
                        value = noRumah;
                        break
                    case "status tagihan":
                        field = "sudahLunas";
                        operator = "==";
                        value = status == "lunas" ? true : false;
                        break
                    default:
                        break
                }
                if (rlf.value == "tanggal tagihan") {
                    tempFilter.push({
                        "field": "tanggal_aktif",
                        "operator": ">=",
                        "value": tanggalMulai
                    });
                    tempFilter.push({
                        "field": "tanggal_aktif",
                        "operator": "<=",
                        "value": tanggalAkhir
                    });
                } else {
                    tempFilter.push({
                        "field": field,
                        "operator": operator,
                        "value": value
                    });
                }

                if (index == removedListFilter.length - 1) {
                    console.log("tempFilter after processed", JSON.stringify(tempFilter));
                    getData(tempFilter); //may cause bug
                }
            });
        }
    }
    //constant
    const listFilter = [
        {
            "text": "Nomor Tagihan",
            "value": "nomor tagihan"
        },
        {
            "text": "Nomor KK",
            "value": "nomor kk"
        },
        {
            "text": "Nomor HP",
            "value": "nomor hp"
        },
        {
            "text": "Telp Rumah",
            "value": "telp rumah"
        },
        {
            "text": "Email",
            "value": "email"
        },
        {
            "text": "Jenis Tagihan",
            "value": "jenis tagihan"
        },
        {
            "text": "Blok",
            "value": "blok"
        },
        {
            "text": "Nomor Rumah",
            "value": "nomor rumah"
        },
        {
            "text": "Tanggal Tagihan",
            "value": "tanggal tagihan"
        },
        {
            "text": "Status Tagihan",
            "value": "status tagihan"
        },
    ]
    const [listFilterState, setListFilterState] = useState(listFilter);
    const statusTagihan = [
        {
            "text": "Lunas",
            "value": "lunas"
        },
        {
            "text": "Belum lunas",
            "value": "belum lunas"
        },
    ];
    const handleDelete = (text, val) => {
        let removedData = [...removedListFilter];
        let filtered = removedData.filter((value, index, arr) => {
            return value.value != val;
        })
        setRemovedListFilter(filtered);
        let listFilterTemp = [...listFilterState];
        listFilterTemp.push({
            "text": text,
            "value": val
        })
        setListFilterState(listFilterTemp);
    };
    const resetFilter = () => {
        setIsBlokFilterShow(false);
        setIsNomorTagihanFilterShow(false);
        setIsNomorKKFilterShow(false);
        setIsNomorHPFilterShow(false);
        setIsTagihanFilterShow(false);
        setIsTanggalFilterShow(false);
        setIsAlamatEmailFilterShow(false);
        setIsStatusFilterShow(false);
        setIsNomorRumahFilterShow(false);
        setIsTelpRumahFilterShow(false);
        let newFilter = [];
        listFilter.map((lf, index) => {
            newFilter.push({
                "text": lf.text,
                "value": lf.value
            })
            if (index === listFilter.length - 1) {
                setListFilterState(newFilter);
                //setIsResetFilterButtonActive(false);
            }
        });
        setRemovedListFilter([]);
    }
    const jenisTagihan = [
        {
            "text": "Iuran keamanan",
            "value": "iuran keamanan"
        },
        {
            "text": "Iuran kebersihan",
            "value": "iuran kebersihan"
        },
    ]
    const blocks = [
        {
            "text": "A",
            "value": "A"
        },
        {
            "text": "B",
            "value": "B"
        },
        {
            "text": "C",
            "value": "C"
        },
        {
            "text": "D",
            "value": "D"
        },
        {
            "text": "E",
            "value": "E"
        },
        {
            "text": "F",
            "value": "F"
        },
    ]
    const handleSelectFilterOps = (text, val, action1) => {
        action1();
        let filterState = [...listFilterState];
        let filtered = filterState.filter((value, index, arr) => {
            return value.value != val;
        });
        let removed = [...removedListFilter];
        removed.push({
            text: text,
            value: val
        });
        setRemovedListFilter(removed)
        setListFilterState(filtered);
        setIsSelectFilterShow(false);
        //setIsResetFilterButtonActive(true);
    }
    //effects
    useEffect(() => {
        setRows(
            data.map((dt) => {
                return {
                    id: dt.id,
                    col1: dt.no_tagihan, //ok
                    col2: dt.jenis, //ok
                    col3: dt.biaya, //not available
                    col4: dt.sudah_dibayar, //not available
                    col5: dt.sisa, //not available
                    col6: dt.sudahLunas === true ? "LUNAS" : "BELUM LUNAS", //ok
                    col7: dt.blok,//ok
                    col8: dt.no_rumah, //ok
                    col9: dt.no_kk, //ok
                    col10: dt.telp, //ok
                    col11: dt.hp, //ok
                    col12: dt.email, //ok
                    col13: dt.tanggal_dibuat, //ok
                    col14: dt.tanggal_aktif, //not available
                    col15: dt.tanggal_dibayar //not available
                }
            })
        );
    }, [data])
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
                        <RMSAlert isOpen={isFilterDangerALertShow} setIsOpen={() => { setIsFilterDangerAlertShow(false) }} />
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
                    <MITDataGrid rows={rows} columns={d_columns} />
            }
        </div>
    )
}

export default LihatTagihanBackup;
 */