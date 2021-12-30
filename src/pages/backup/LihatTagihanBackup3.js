/** 
import React, { useState, useEffect, useRef } from "react";
import { getTime, toDate } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import MITDataGrid from '../components/MITDataGrid';
import { Skeleton, Box, Button, Paper, Divider, Chip, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RMSDatePicker from "../components/RMSDatePicker";
import RMSSelect from "../components/RMSSelect";
import RMSTextField from "../components/RMSTextField";
import RMSAlert from "../components/RMSAlert";
import useLihatLogic from "../hooks/useLihatLogic";
import useDataEditLogic from "../hooks/useDataEditLogic";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import QRCode from "react-qr-code";
import BasicTable from '../components/BasicTable';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import useInputValidation from '../hooks/useInputValidation';
import useDataOperations from '../hooks/useDataOperations';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
//firebase
import db from "../firebase-config";
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, updateDoc } from "firebase/firestore";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const bloks = [
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
    }
]

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
        rows,
        setRows
    ] = useLihatLogic("Lihat Tagihan");
    const [isEditWindowOpen, setIsEditWindowOpen] = useState(false);
    const [isCheckbox, setIsCheckbox] = useState(false);
    const [previousSelectedObj, setPreviousSelectedObj] = useState(null);
    //data grid modification logic , used at cancelEdit and useEffect() on useDataEditLogic hook
    const setRowsBasedOnData = () => {
        setRows(d_data.map((dt) => {
            let objToInspect = {
                "tanggal_dibuat": dt.tanggal_dibuat,
                "tanggal_aktif": dt.tanggal_aktif,
                "tanggal_dibayar": dt.tanggal_dibayar
            }
            console.log("objToInspect at setRowsBasedOnData", objToInspect);
            return {
                id: dt.id,
                no_tagihan: dt.no_tagihan, //ok
                kelompok_tagihan: dt.kelompok_tagihan,
                jenis: dt.jenis, //ok
                biaya: dt.biaya, //not available
                sudah_dibayar: dt.sudah_dibayar, //not available
                sisa: dt.sisa, //not available
                sudahLunas: dt.sudahLunas == true ? 'LUNAS' : 'BELUM LUNAS', //ok
                status_kelompok_tagihan: dt.status_kelompok_tagihan == true ? 'LUNAS' : 'BELUM LUNAS',
                blok: dt.blok,//ok
                no_rumah: dt.no_rumah, //ok
                no_kk: dt.no_kk, //ok
                telp: dt.telp, //ok
                hp: dt.hp, //ok
                email: dt.email, //ok
                tanggal_dibuat: toDate(dt.tanggal_dibuat), //ok
                tanggal_aktif: toDate(dt.tanggal_aktif), //not available //fot5
                tanggal_dibayar: toDate(dt.tanggal_dibayar)
            }
        }))
    }
    const [
        d_data,
        isCellInEditMode,
        setIsCellInEditMode,
        editDataDocIdTracker,
        editDataFieldTracker,
        editDataValueTracker,
        l_jenisTagihan,
        d_isLoading,
        selectionModelChangeAction,
        editRowsModelChangeAction,
        deleteData,
        currentSelectedIds,
        cancelEdit,
        editData,
        isSaveButtonOn,
        isSuccessCreatingTagihanShow,
        setIsSuccessCreatingTagihanShow,
        message
    ] = useDataEditLogic("Lihat Tagihan", "tagihan", setRowsBasedOnData);
    const [isPrintWindowOpen, setIsPrintWindowOpen] = useState(false);
    const [isEditDataButtonDisabled, setIsEditDataButtonDisabled] = useState(true);
    const [isSelectMultipleTagihanForDeletionActive, setIsSelectMultipleTagihanForDeletionActive] = useState(false);
    const [lt_isLoading, lt_data, lt_addData, lt_getData, lt_editData, lt_deleteData] = useDataOperations('tagihan');
    const [currentSelectedObj, setCurrentSelectedObj] = useState({
        "id": "",
        "biaya": "", //ok
        "blok": "", //ok
        "email": "", //ok
        "hp": "",//ok
        "jenis": "",//ok
        "no_kk": "",//ok
        "no_rumah": "", //ok
        "no_tagihan": "", //ok
        "kelompok_tagihan": "",
        "status_kelompok_tagihan": "",
        "sisa": "", //ok
        "sudahLunas": "",//ok
        "sudah_dibayar": "",//ok
        "tanggal_aktif": "",//ok
        "tanggal_dibayar": "",
        "tanggal_dibuat": "", //change later
        "telp": ""
    });
    const [isAlertShown, setIsAlertShown, validateInput] = useInputValidation();
    const d_columns = [
        { field: 'no_tagihan', headerName: 'No. Tagihan', width: 150, editable: false },
        { field: 'kelompok_tagihan', headerName: 'Kelompok Tagihan', width: 150, editable: false },
        { field: 'no_kk', headerName: 'No. KK', width: 150, editable: false },
        { field: 'jenis', headerName: 'Jenis Tagihan', width: 150, editable: false },
        { field: 'biaya', headerName: 'Biaya', width: 150, editable: isCellInEditMode, type: 'number' },
        { field: 'sudah_dibayar', headerName: 'Sudah Dibayar', width: 150, editable: isCellInEditMode, type: 'number' },
        { field: 'sisa', headerName: 'Sisa', width: 150, editable: isCellInEditMode, type: 'number' },
        { field: 'sudahLunas', headerName: 'Status', width: 150, editable: isCellInEditMode },
        { field: 'status_kelompok_tagihan', headerName: 'Status Kelompok Tagihan', width: 300, editable: isCellInEditMode },
        { field: 'blok', headerName: 'Blok', width: 150, editable: false },
        { field: 'no_rumah', headerName: 'No. Rumah', width: 150, editable: false },
        { field: 'telp', headerName: 'No. Telp', width: 150, editable: false, type: 'number' },
        { field: 'hp', headerName: 'No. HP', width: 150, editable: false, type: 'number' },
        { field: 'email', headerName: 'Email', width: 150, editable: false },
        { field: 'tanggal_dibuat', headerName: 'Tanggal Dibuat', width: 150, editable: false, type: 'date' },
        { field: 'tanggal_aktif', headerName: 'Tanggal Aktif', width: 150, editable: false, type: 'date' },
        { field: 'tanggal_dibayar', headerName: 'Tanggal Dibayar', width: 150, type: 'date', editable: isCellInEditMode },
    ];
    const [invoiceBillList, setInvoiceBillList] = useState([]);
    const [selectedKelompokTagihanState, setSelectedKelompokTagihanState] = useState("");
    const [selectedBlokState, setSelectedBlokState] = useState("");
    const [selectedNoRumah, setSelectedNoRumah] = useState("");
    const [modData, setModData] = useState([]);
    const fillInvoice = async () => {
        console.log('fillInvoice rowState', rows);
        let selectedKelompokTagihan = null;
        let selectedBlok = null;
        let selectedNoRumah = null;
        let invoiceList = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id === currentSelectedIds[0]) {
                selectedKelompokTagihan = rows[i].kelompok_tagihan;
                selectedBlok = rows[i].blok;
                selectedNoRumah = rows[i].no_rumah;
            }
        }
        console.log('selected kelompok_tagihan', selectedKelompokTagihan);
        setSelectedKelompokTagihanState(selectedKelompokTagihan);
        setSelectedBlokState(selectedBlok);
        setSelectedNoRumah(selectedNoRumah);
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].kelompok_tagihan === selectedKelompokTagihan) {
                invoiceList.push({
                    "nomor_tagihan": rows[i].no_tagihan,
                    "jenis": rows[i].jenis,
                    "biaya": rows[i].biaya,
                    "sudah_dibayar": rows[i].sudah_dibayar,
                    "sisa": rows[i].sisa,
                    "sudahLunas": rows[i].sudahLunas,
                    "blok": rows[i].blok,
                    "no_rumah": rows[i].no_rumah,
                    "no_kk": rows.no_kk
                })
            }
        }
        console.log("invoice bill list", invoiceList);
        setInvoiceBillList(invoiceList);
    }
    const setCurrentSelectedObjectFunc = async () => {
        console.log('set current selected object', rows);
        let selectedBiaya = null;
        let selectedEmail = null;
        let selectedHp = null;
        let selectedJenis = null;
        let selectedNoKk = null;
        let selectedNoTagihan = null;
        let selectedStatusKelompokTagihan = null;
        let selectedSisa = null;
        let selectedSudahLunas = null;
        let selectedSudahDibayar = null;
        let selectedKelompokTagihan = null;
        let selectedTanggalAktif = null;
        let selectedTanggalDibayar = null;
        let selectedTanggalDibuat = null;
        let selectedTelp = null;
        let selectedBlok = null;
        let selectedNoRumah = null;
        let selectedObj = null;
        let selectedId = null;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id === currentSelectedIds[0]) {
                selectedId = rows[i].id;
                selectedKelompokTagihan = rows[i].kelompok_tagihan;
                selectedBlok = rows[i].blok;
                selectedNoRumah = rows[i].no_rumah;
                selectedBiaya = rows[i].biaya;
                selectedEmail = rows[i].email;
                selectedHp = rows[i].hp;
                selectedJenis = rows[i].jenis;
                selectedNoKk = rows[i].no_kk;
                selectedNoTagihan = rows[i].no_tagihan;
                selectedStatusKelompokTagihan = rows[i].status_kelompok_tagihan;
                selectedTanggalAktif = getTime(rows[i].tanggal_aktif); //at this time the rows already in 'Date' format cause of maaping rows to table at useLihatLogic hook, so we need to turn it back to number(timestamp) again in order to upload it to the database
                selectedTanggalDibayar = getTime(rows[i].tanggal_dibayar);
                selectedTanggalDibuat = getTime(rows[i].tanggal_dibuat);
                selectedTelp = rows[i].telp;
                selectedSisa = rows[i].sisa;
                selectedSudahLunas = rows[i].sudahLunas;
                selectedSudahDibayar = rows[i].sudah_dibayar;
            }
        }
        selectedObj = {
            "id": selectedId,
            "biaya": selectedBiaya, //ok
            "blok": selectedBlok, //ok
            "email": selectedEmail, //ok
            "hp": selectedHp,//ok
            "jenis": selectedJenis,//ok
            "no_kk": selectedNoKk,//ok
            "no_rumah": selectedNoRumah, //ok
            "no_tagihan": selectedNoTagihan, //ok
            "kelompok_tagihan": selectedKelompokTagihan,
            "status_kelompok_tagihan": selectedStatusKelompokTagihan,
            "sisa": selectedSisa, //ok
            "sudahLunas": selectedSudahLunas,//ok
            "sudah_dibayar": selectedSudahDibayar,//ok
            "tanggal_aktif": selectedTanggalAktif,//ok
            "tanggal_dibayar": selectedTanggalDibayar,
            "tanggal_dibuat": selectedTanggalAktif, //change later
            "telp": selectedTelp
        }
        setCurrentSelectedObj(selectedObj);
        setPreviousSelectedObj(selectedObj);
        console.log("selected obj from set", selectedObj);
    }
    const rmsSelectHandleChange = (data) => {
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
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const modifySelectedObj = async (field, value) => {
        let newCurrentSelectedObj = { ...currentSelectedObj };
        switch (field) {
            case 'sudahLunas':
                newCurrentSelectedObj[field] = value === true ? 'LUNAS' : 'BELUM LUNAS';
                break;
            default:
                newCurrentSelectedObj[field] = value
                break;
        }
        console.log('inspect newCurrentSelectedObj', newCurrentSelectedObj);
        setCurrentSelectedObj(newCurrentSelectedObj);
    }
    const modifyCurrentRows = () => { //fot1
        let tempRows = [...rows];
        for (var i = 0; i < tempRows.length; i++) {
            if (tempRows[i].id === currentSelectedObj['id']) {
                let tempCurrentSelectedObj = { ...currentSelectedObj };
                tempCurrentSelectedObj['tanggal_dibuat'] = toDate(tempCurrentSelectedObj['tanggal_dibuat']);
                tempCurrentSelectedObj['tanggal_aktif'] = toDate(tempCurrentSelectedObj['tanggal_aktif']);
                tempCurrentSelectedObj['tanggal_dibayar'] = toDate(tempCurrentSelectedObj['tanggal_dibayar']);
                tempRows[i] = tempCurrentSelectedObj;
            }
        }
        setRows(tempRows);
    }
    const processCurrentSelectedObjectToFit = () => {
        //process current selected object to fit the requirement for updating data
        let modifiedObj = { ...currentSelectedObj }
        modifiedObj['sudahLunas'] = modifiedObj['sudahLunas'] == 'LUNAS' ? true : false;
        modifiedObj['status_kelompok_tagihan'] = modifiedObj['status_kelompok_tagihan'] == 'LUNAS' ? true : false;
        return modifiedObj;
    }
    const understandingAsync = async () => {
        
    }
    const checkIfAllBillInGroupArePaid = async (id) => {
        console.log('checkIfAllBillInGroupArePaid func called...');
        const q = query(collection(db, "tagihan"), where("kelompok_tagihan", "==", id));
        const querySnapshot = await getDocs(q);
        let statusTagihanArr = [];
        let tagihanIdArr = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(`checkIfAllBillInGroupArePaid log ${doc.id}`, " => ", doc.data());
            statusTagihanArr.push(doc.data()['sudahLunas']);
            tagihanIdArr.push(doc.id);
        });
        console.log('statusTagihanArr', statusTagihanArr);
        //if all of the bills already paid, then update the database
        if (!statusTagihanArr.includes(false)) {
            //update all the tagihan's kelompok tagihan status
            //update status kelompok tagihan
            for (let i = 0; i < statusTagihanArr.length; i++) {
                try {
                    //update the database in background
                    await updateDoc(doc(db, 'tagihan', tagihanIdArr[i]), {
                        "status_kelompok_tagihan": true
                    });
                    console.log('successfully update status_kelompok_tagihan');
                } catch (err) {
                    console.log('error on updating status_kelompok_tagihan', err.message);
                }
            }
            let temprows = [...rows];
            for (let i = 0; i < temprows.length; i++) {
                if (temprows[i]['kelompok_tagihan'] === currentSelectedObj['kelompok_tagihan']) {
                    temprows[i]['status_kelompok_tagihan'] = 'LUNAS';
                }
            }
        }
    }
    useEffect(() => {
        if (currentSelectedIds.length == 0 || currentSelectedIds.length > 1) {
            setIsEditDataButtonDisabled(true);
        } else {
            setIsEditDataButtonDisabled(false);
        }
    }, [currentSelectedIds])
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
                <div>{editDataDocIdTracker}</div>
                <div>{editDataFieldTracker}</div>
                <div>{editDataValueTracker}</div>
                <div>{JSON.stringify(currentSelectedObj)}</div>
            </div>
            <Box style={{ marginBottom: "20px" }}>
                <Paper>
                    <Box sx={{ padding: "10px" }}>
                        <RMSAlert isOpen={isFilterDangerALertShow} message={""} setIsOpen={() => { setIsFilterDangerAlertShow(false) }} />
                        <RMSSelect isError={((tagihan === null || tagihan.length === 0) && isFilterDangerALertShow)} isRequired={true} displayFilter={isTagihanFilterShow ? "default" : "none"} label={"Tagihan"} helperText={"Jenis Tagihan"} items={l_jenisTagihan === null ? [] : l_jenisTagihan} value={tagihan} handleChange={(value) => { setTagihan(value) }} />
                        <RMSSelect isError={((blok === null || blok.length === 0) && isFilterDangerALertShow)} isRequired={true} displayFilter={isBlokFilterShow ? "default" : "none"} label={"Blok"} helperText={"Pilih Blok Rumah"} items={blocks} value={blok} handleChange={(value) => { setBlok(value) }} />
                        <RMSTextField isError={((nomorTagihan === null || nomorTagihan.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorTagihanFilterShow ? "default" : "none"} label={"Nomor Tagihan"} helperText={"Masukkan Nomor Tagihan"} value={nomorTagihan} handleChange={(value) => setNomorTagihan(value)} />
                        <RMSTextField isError={((nomorKk === null || nomorKk.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorKKFilterShow ? "default" : "none"} label={"Nomor KK"} helperText={"Masukkan Nomor KK"} value={nomorKk} handleChange={(value) => setNomorKk(value)} />
                        <RMSTextField isError={((noRumah === null || noRumah.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorRumahFilterShow ? "default" : "none"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={noRumah} handleChange={(value) => { setNoRumah(value) }} />
                        <RMSTextField isError={((nomorHp === null || nomorHp.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isNomorHPFilterShow ? "default" : "none"} label={"Nomor HP"} helperText={"Masukkan Nomor HP"} value={nomorHp} handleChange={(value) => { setNomorHp(value) }} />
                        <RMSTextField isError={((nomorTelp === null || nomorTelp.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isTelpRumahFilterShow ? "default" : "none"} label={"Telp Rumah"} helperText={"Masukkan Nomor Telp Rumah"} value={nomorTelp} handleChange={(value) => { setNomorTelp(value) }} />
                        <RMSTextField isError={((email === null || email.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isAlamatEmailFilterShow ? "default" : "none"} label={"Alamat Email"} helperText={"Masukkan Alamat Email"} value={email} handleChange={(value) => { setEmail(value) }} />
                        <RMSDatePicker isError={((tanggalMulai === null || tanggalMulai.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isTanggalFilterShow ? "default" : "none"} title={"Dari tanggal"} helperText={"Mulai Dari tanggal"} value={tanggalMulai} handleChange={(val) => { setTanggalMulai(getTime(val)) }} />
                        <RMSDatePicker isError={((tanggalAkhir === null || tanggalAkhir.length === 0) && isFilterDangerALertShow) ? true : false} isRequired={true} displayFilter={isTanggalFilterShow ? "default" : "none"} title={"Sampai tanggal"} helperText={"Sampai dengan tanggal"} value={tanggalAkhir} handleChange={(val) => { setTanggalAkhir(getTime(val)) }} />
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
                            rmsSelectHandleChange
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
                isLoading || d_isLoading ?
                    <Box>
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                        <Skeleton animation="wave" height={40} />
                    </Box>
                    :
                    <Box sx={{ marginBottom: "100px" }}>
                        <Paper>
                            <Box sx={{ padding: "10px" }}>
                                <MITDataGrid rows={rows} columns={d_columns} isCheckbox={isSelectMultipleTagihanForDeletionActive} isCellEditable={isCellInEditMode} selectionModelChangeAction={(g) => selectionModelChangeAction(g)} editRowsModelChangeAction={(e) => editRowsModelChangeAction(e)} />
                            </Box>
                            <Divider />
                            <Box sx={{ padding: "10px" }}>
                                <Button sx={{ margin: "5px" }} startIcon={isSelectMultipleTagihanForDeletionActive ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />} onClick={() => { setIsSelectMultipleTagihanForDeletionActive(!isSelectMultipleTagihanForDeletionActive) }} variant="outlined" disabled={false}>Pilih Sekaligus</Button>
                                <Button sx={{ margin: "5px" }} startIcon={<DeleteIcon />} onClick={
                                    async () => {
                                        //this function delete the selected datas but not refresh the table by calling getData() which is making another traffic request instead it's only alter the rows the table use..
                                        let deletedIDs = await deleteData();
                                        console.log('deletedIDs', deletedIDs);
                                        let filtered = rows.filter(function (value, index, arr) {
                                            return !deletedIDs.includes(value.id)
                                        });
                                        console.log('filtered row after deletion', filtered);
                                        setRows(filtered);
                                    }
                                } variant="outlined" disabled={(currentSelectedIds.length === 0) ? true : false}>Hapus Tagihan yang dipilih</Button>
                                <Button sx={{ margin: "5px", display: isCellInEditMode ? "default" : "none" }} startIcon={<CancelIcon />} onClick={() => {
                                    //cancelEdit();
                                    //alert(JSON.stringify(rows))
                                    setRows(rows);
                                    setIsCellInEditMode(false);
                                }} variant="contained" disabled={false}>Batal</Button>
                                <Button sx={{ margin: "5px", display: isCellInEditMode ? "none" : "default" }} startIcon={<EditIcon />} onClick={async () => {
                                    //setIsCellInEditMode(true)
                                    await setCurrentSelectedObjectFunc();
                                    setIsEditWindowOpen(true);
                                }} variant="outlined" disabled={isEditDataButtonDisabled}>Edit Data</Button>
                                <Button sx={{ margin: "5px", display: isCellInEditMode ? "default" : "none" }} startIcon={<SaveIcon />} onClick={editData} variant="outlined" disabled={isSaveButtonOn}>Simpan Perubahan</Button>
                                <Button sx={{ margin: "5px" }} startIcon={<PrintIcon />} onClick={async () => {
                                    await fillInvoice();
                                    setIsPrintWindowOpen(true);
                                }} variant="outlined" disabled={currentSelectedIds.length === 0 || currentSelectedIds.length > 1 ? true : false}>Cetak Invoice</Button>
                            </Box>
                        </Paper>
                    </Box>
            }
            <Snackbar open={isSuccessCreatingTagihanShow} autoHideDuration={2000} onClose={() => { setIsSuccessCreatingTagihanShow(false) }}>
                <Alert onClose={() => { setIsSuccessCreatingTagihanShow(false) }} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Dialog open={isPrintWindowOpen}>
                <DialogTitle>Cetak Invoice</DialogTitle>
                <Divider />
                <DialogContent ref={componentRef}>
                    <h3>Invoice #0000001</h3>
                    <div>
                        <span>Blok</span> <span>{selectedBlokState}</span>
                    </div>
                    <div>
                        <span>No.</span> <span>{selectedNoRumah}</span>
                    </div>
                    <BasicTable rows={invoiceBillList} />
                    <Box sx={{ marginTop: '20px', marginBottom: '10px' }}>
                        <QRCode value={selectedKelompokTagihanState.length === 0 ? '' : selectedKelompokTagihanState} size={96} />
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button sx={{ margin: "5px" }} startIcon={<CancelIcon />} onClick={() => {
                        //handlePrint();
                        setIsPrintWindowOpen(false)
                    }} variant="outlined" disabled={false}>Batal</Button>
                    <Button sx={{ margin: "5px" }} startIcon={<PrintIcon />} onClick={() => {
                        handlePrint();
                        setIsPrintWindowOpen(false)
                    }} variant="contained" disabled={false}>Cetak</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isEditWindowOpen}>
                <DialogTitle>Edit Data</DialogTitle>
                <Divider />
                <DialogContent ref={componentRef}>
                    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                        <Stack direction='column' spacing={2}>
                            <RMSTextField isError={currentSelectedObj['biaya'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Biaya"} helperText={"Masukkan Biaya"} value={currentSelectedObj.biaya} handleChange={(value) => modifySelectedObj('biaya', value)} />
                            <RMSSelect isError={currentSelectedObj['blok'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} items={bloks} label={"Blok"} helperText={"Masukkan Blok"} value={currentSelectedObj['blok']} handleChange={(value) => modifySelectedObj('blok', value)} />
                            <RMSTextField isError={currentSelectedObj['sisa'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Sisa"} helperText={"Sisa Pembayaran"} value={currentSelectedObj.sisa} handleChange={(value) => modifySelectedObj('sisa', value)} />
                            <RMSSelect isError={currentSelectedObj['sudahLunas'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} items={statusTagihan} label={"Status Tagihan"} helperText={"Masukkan Status Tagihan"} value={currentSelectedObj.sudahLunas === 'LUNAS' ? true : false} handleChange={(value) => modifySelectedObj('sudahLunas', value)} />
                            <RMSTextField isError={currentSelectedObj['sudah_dibayar'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Sudah Dibayar"} helperText={"Jumlah Sudah Dibayar"} value={currentSelectedObj.sudah_dibayar} handleChange={(value) => modifySelectedObj('sudah_dibayar', value)} />
                        </Stack>
                        <Stack direction='column' spacing={2}>
                            <RMSTextField isError={currentSelectedObj['email'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="email" label={"Email"} helperText={"Masukkan Email"} value={currentSelectedObj.email} handleChange={(value) => modifySelectedObj('email', value)} />
                            <RMSTextField isError={currentSelectedObj['hp'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"HP"} helperText={"Masukkan Nomor HP"} value={currentSelectedObj['hp']} handleChange={(value) => modifySelectedObj('hp', value)} />
                            <RMSTextField isError={currentSelectedObj['no_tagihan'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Tagihan"} helperText={"Masukkan Nomor Tagihan"} value={currentSelectedObj.no_tagihan} handleChange={(value) => modifySelectedObj('no_tagihan', value)} />
                            <RMSDatePicker isError={currentSelectedObj['tanggal_aktif'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Aktif"} helperText={"Tanggal tagihan"} value={currentSelectedObj['tanggal_aktif']} handleChange={(value) => modifySelectedObj('tanggal_aktif', getTime(value))} />
                            <RMSDatePicker isError={currentSelectedObj['tanggal_dibuat'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Dibuat"} helperText={"Tanggal Tagihan Dibuat"} value={currentSelectedObj['tanggal_dibuat']} handleChange={(value) => modifySelectedObj('tanggal_dibuat', getTime(value))} />
                            <RMSDatePicker isError={currentSelectedObj['tanggal_dibayar'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Tanggal Dibayar"} helperText={"Tanggal Pembayaran"} value={currentSelectedObj['tanggal_dibayar']} handleChange={(value) => modifySelectedObj('tanggal_dibayar', getTime(value))} />
                            <RMSTextField isError={currentSelectedObj['no_rumah'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor Rumah"} helperText={"Masukkan Nomor Rumah"} value={currentSelectedObj.no_rumah} handleChange={(value) => modifySelectedObj('no_rumah', value)} />
                        </Stack>
                        <Stack direction='column' spacing={2}>
                            <RMSTextField isError={currentSelectedObj['telp'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="number" label={"Nomor Telp"} helperText={"Masukkan Nomor Telp"} value={currentSelectedObj.telp} handleChange={(value) => modifySelectedObj('telp', value)} />
                            <RMSTextField isError={currentSelectedObj['kelompok_tagihan'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} type="text" label={"Kelompok Tagihan"} helperText={"Masukkan Kelompok Tagihan"} value={currentSelectedObj.kelompok_tagihan} handleChange={(value) => modifySelectedObj('kelompok_tagihan', value)} />
                            <RMSSelect isError={currentSelectedObj['jenis'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} items={l_jenisTagihan} label={"Jenis"} helperText={"Masukkan Jenis"} value={currentSelectedObj.jenis} handleChange={(value) => modifySelectedObj('jenis', value)} />
                            <RMSTextField isError={currentSelectedObj['no_kk'].length === 0 && isAlertShown ? true : false} isRequired={true} displayFilter={"default"} label={"Nomor KK"} helperText={"Masukkan Nomor KK"} value={currentSelectedObj['no_kk']} handleChange={(value) => modifySelectedObj('no_kk', value)} />
                        </Stack>
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Button startIcon={<RotateLeftIcon />} onClick={() => {
                            setCurrentSelectedObj(previousSelectedObj);
                            //setIsEditWindowOpen(false)
                        }} variant="outlined" disabled={false}>Reset</Button>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<CancelIcon />} onClick={() => {
                                setIsEditWindowOpen(false)
                            }} variant="outlined" disabled={false}>Batal</Button>
                            <Button startIcon={<CheckIcon />} onClick={() => {
                                understandingAsync();
                            }} variant="contained" disabled={false}>Ok</Button>
                        </Stack>
                    </Stack>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default LihatTagihan;
*/

 