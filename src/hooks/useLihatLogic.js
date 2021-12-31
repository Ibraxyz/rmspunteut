import { useEffect, useState } from "react";
import useDataOperations from '../hooks/useDataOperations';
import usePathUpdater from "../hooks/usePathUpdater";
import toDate from 'date-fns/toDate';

const useLihatLogic = (jenisLihatLogic) => {
    const [r_currentPathState] = usePathUpdater(jenisLihatLogic);
    //data grid default values
    const d_rows = [];
    //custom hooks
    const [isLoading, data, addData, getData, editData, deleteData] = useDataOperations(jenisLihatLogic == "Lihat Tagihan" ? "tagihan" : jenisLihatLogic == "Lihat KK" ? "kk" : jenisLihatLogic == "Lihat Biaya" ? "biaya" : jenisLihatLogic == "Lihat Faktur" ? 'faktur' : '');
    //const [isLoading, data, addData, getData, editData, deleteData] = useDataOperations("tagihan");
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

            ((tagihan === null || tagihan.length === 0) && isTagihanFilterShow) || //isTagihanFilterShow is used if any page does not contains the selected filter
            ((status === null || status.length === 0) && isStatusFilterShow) ||
            ((blok === null || blok.length === 0) && isBlokFilterShow) ||
            ((nomorTagihan === null || nomorTagihan.length === 0) && isNomorTagihanFilterShow) ||
            ((nomorKk === null || nomorKk.length == 0) && isNomorKKFilterShow) ||
            ((noRumah === null || noRumah.length === 0) && isNomorRumahFilterShow) ||
            ((tanggalAkhir === null || tanggalAkhir.length === 0) && isTanggalFilterShow) ||
            ((tanggalMulai === null || tanggalMulai.length === 0) && isTanggalFilterShow) ||
            ((nomorHp === null || nomorHp.length === 0) && isNomorHPFilterShow) ||
            ((nomorTelp === null || nomorTelp.length === 0) && isTelpRumahFilterShow) ||
            ((email === null || email.length === 0) && isAlamatEmailFilterShow)

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
                        value = status;
                        break
                    default:
                        break
                }
                if (rlf.value == "tanggal tagihan" || rlf.value == "tanggal bergabung") {
                    tempFilter.push({
                        "field": rlf.value == "tanggal tagihan" ? "tanggal_aktif" : "tanggal_bergabung",
                        "operator": ">=",
                        "value": tanggalMulai
                    });
                    tempFilter.push({
                        "field": rlf.value == "tanggal tagihan" ? "tanggal_aktif" : "tanggal_bergabung",
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
                    console.log(`tempFilter after processed ${jenisLihatLogic}`, JSON.stringify(tempFilter));
                    try{
                        getData(tempFilter); //may cause bug
                    }catch(err){
                        console.log(err.message);
                    }
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
            "text": "LUNAS",
            "value": true
        },
        {
            "text": "BELUM LUNAS",
            "value": false
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
    //effects | pertama kali dipanggil pada saat halaman lihat tagihan dibuka
    useEffect(() => {
        console.log("map rows to table effect...");
        setRows(
            data.map((dt) => {
                switch (jenisLihatLogic) {
                    case "Lihat Biaya":
                        return {
                            id: dt.id,
                            jenis: dt.jenis, //ok
                            biaya: dt.biaya, //not available
                        }
                    case "Lihat KK":
                        return {
                            id: dt.id,
                            blok: dt.blok,//ok
                            no_rumah: dt.no_rumah, //ok
                            no_kk: dt.no_kk, //ok
                            ikk: dt['biaya-bulanan'],
                            telp: dt.telp, //ok
                            hp: dt.hp, //ok
                            email: dt.email, //ok
                            status: dt.status, //ok
                            tanggal_bergabung: toDate(dt.tanggal_bergabung)
                        }
                    case "Lihat Tagihan":
                        return {
                            id: dt.id,
                            no_tagihan: dt.no_tagihan, //ok
                            kelompok_tagihan: dt.kelompok_tagihan,
                            status_kelompok_tagihan: dt.status_kelompok_tagihan == true ? 'LUNAS' : 'BELUM LUNAS',
                            jenis: dt.jenis, //ok
                            biaya: dt.biaya, //not available
                            sudah_dibayar: dt.sudah_dibayar, //not available
                            sisa: dt.sisa, //not available
                            sudahLunas: dt.sudahLunas === true ? 'LUNAS' : 'BELUM LUNAS', //ok
                            blok: dt.blok,//ok
                            no_rumah: dt.no_rumah, //ok
                            no_kk: dt.no_kk, //ok
                            telp: dt.telp, //ok
                            hp: dt.hp, //ok
                            email: dt.email, //ok
                            tanggal_dibuat: toDate(dt.tanggal_dibuat), //ok
                            tanggal_aktif: toDate(dt.tanggal_aktif), //not available
                            tanggal_dibayar: toDate(dt.tanggal_dibayar) 
                        }
                    default:
                        break;
                }
            })
        );
    }, [data])
    useEffect(() => {
        switch (jenisLihatLogic) {
            case "Lihat Biaya":
                setListFilterState([
                    {
                        "text": "Jenis Tagihan",
                        "value": "jenis tagihan"
                    },
                ]);
                break;
            case "Lihat KK":
                setListFilterState(
                    [
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
                            "text": "Blok",
                            "value": "blok"
                        },
                        {
                            "text": "Nomor Rumah",
                            "value": "nomor rumah"
                        },
                        {
                            "text": "Tanggal Bergabung",
                            "value": "tanggal bergabung"
                        },
                    ]
                );
                break;
            default:
                break;
        }
    }, [])

    let returnedValue = null;

    switch (jenisLihatLogic) {
        case "Lihat Faktur":
            returnedValue = [
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
            ];
            break;
        case "Lihat Tagihan":
            returnedValue = [
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
            ];
            break;
        case "Lihat Biaya":
            returnedValue = [
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
            ];
            break;
        case "Lihat KK":
            returnedValue = [
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
            ];
            break;
        default:
            break;
    }
    return [...returnedValue];

}

export default useLihatLogic;