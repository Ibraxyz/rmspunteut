import { useState, useEffect } from 'react';
//date-fns
import { toDate } from 'date-fns';
//firebase
import { db } from "../index";
import { collection, getDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";

const useViewData = (arg_setFilterOptionsList, arg_st_setFilterOptionsList, targetCollection) => {
    //functions
    //handle data deletion
    const deletedIDs = [];
    const ic_af_deleteSelectedBills = async (ids) => {
        ic_st_setIsLoading(true);
        for (let i = 0; i < ids.length; i++) {
            try {
                console.log(`deleting data for id ${ids[i]} at iteration ${i}`);
                await deleteDoc(doc(db, "invoice", ids[i]));
                deletedIDs.push(ids[i]);
                console.log(`[Success] data for id ${ids[i]} at iteration ${i} has been deleted...`);
            } catch (err) {
                console.log(`[Failure] data for id ${ids[i]} at iteration ${i} fail to be deleted...`);
                console.log(err.message);
                ic_st_setMsgSeverity('error');
                ic_st_setAlertMessage(err.message);
                ic_st_setIsSnackbarShown(true);
                return;
            }
        }
        ic_st_setIsLoading(false);
        //if successfully deleting datas, reconstruct the rows to not include the already deleted datas...
        ic_st_setMsgSeverity('success');
        ic_st_setAlertMessage('Invoice berhasil dihapus.');
        ic_st_setIsSnackbarShown(true);
        ic_st_setCurrentSelectedIDs([]); //reset the deleted ids to prevent bugs
        ic_st_setRows(ic_st_rows.filter((row) => {
            return !deletedIDs.includes(row['id']);
        }));
    }
    const ic_sf_handleSelectedFilterChange = (value, booleanValue) => {
        arg_st_setFilterOptionsList(arg_setFilterOptionsList.map((option) => {
            if (option['value'] === value) {
                option['isSelected'] = booleanValue;
                if (booleanValue === false) {
                    option['propertyValue'] = [];
                }
            }
            return option;
        }))
    };
    const ic_af_updateData = async (id, collectionName, newValue) => {
        ic_st_setIsLoading(true);
        try {
            await updateDoc(doc(db, collectionName, id), newValue);
            ic_st_setIsEditDialogOpen(false);
            ic_st_setMsgSeverity('success');
            ic_st_setAlertMessage('Perubahan berhasil disimpan');
            ic_st_setIsSnackbarShown(true);
            ic_st_setIsLoading(false);
            //reconstruct the rows with updated data
            ic_st_setRows(ic_st_rows.map((row) => {
                console.log(`row id ${row['id']} | id ${id}`);
                if (row['id'] === id) {
                    newValue['status-invoice'] = newValue['status-invoice'] === true ? 'LUNAS' : 'BELUM LUNAS';
                    row = {
                        ...row,
                        ...newValue
                    }
                    //update the current selected row data , so the invoice detail got updated too
                    ic_st_setCurrentSelectedRowData([row]);
                    console.log(`new row at id : ${id}`, row);
                }
                return row;
            }));
        } catch (err) {
            console.log(err.message);
            ic_st_setMsgSeverity('error');
            ic_st_setAlertMessage(err.message);
            ic_st_setIsAlertShown(true);
            ic_st_setIsLoading(false);
        }
    };
    const ic_sf_validateInput = () => {
        let startDate = [];
        let endDate = [];
        if (arg_setFilterOptionsList.filter((option) => {
            return option['isSelected'] === true && option['propertyValue'].length === 0
        }).length > 0) {
            ic_st_setAlertMessage('Harap isi inputan yang masih kosong.');
            ic_st_setIsAlertShown(true);
            return false;
        } else {
            arg_setFilterOptionsList.forEach((option) => {
                if (option['value'] === 'tanggal-awal') {
                    if (option['isSelected']) {
                        startDate = option['propertyValue'];
                    }
                } else if (option['value'] === 'tanggal-akhir') {
                    if (option['isSelected']) {
                        endDate = option['propertyValue'];
                    }
                }
            });
            if (startDate.length != 0 && endDate.length != 0) {
                if (startDate > endDate) {
                    ic_st_setAlertMessage("Input tanggal tidak valid ( tanggal mulai > tanggal akhir ).");
                    ic_st_setIsAlertShown(true);
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    //show only selected filter
    const ic_sf_showOnlySelectedFilter = () => {
        if (ic_sf_validateInput()) {
            ic_st_setIsAlertShown(false);
            const selectedFilter = arg_setFilterOptionsList.filter((option) => {
                return option['isSelected'] === true
            })
            return selectedFilter;
        } else {
            return [];
        }
    }
    //build multiple condition, later these multiple wheres will be used as an argument when querying
    const ic_sf_constructFirebaseWheres = (data) => {
        return data.map((op) => {
            console.log('value : '+op['value']+'|'+'propertyValue : '+op['propertyValue'])
            //return where((op['value'] === 'tanggal-awal' || op['value'] === 'tanggal-akhir' ? 'tanggal-aktif' : op['value']), (op['value'] === 'tanggal-awal' ? '>=' : op['value'] === 'tanggal-akhir' ? '<=' : '=='), op['propertyValue']);
            return where(op['value'], '==', op['propertyValue']);
        });
    }
    const ic_af_getDataFromDb = async (dbObj, collectionName, wheres) => {
        const q = query(collection(dbObj, collectionName), ...wheres);
        try {
            const querySnapshot = await getDocs(q);
            let dataObj = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                dataObj.push({
                    "id": doc.id,
                    ...doc.data()
                })
            });
            return dataObj;
        } catch (err) {
            console.log('ic_af_getDataFromDb error message', err.message);
            throw err.message;
        }
    }
    const ic_af_showData = async () => {
        //check whether filter options state enabled id filtering or not...
        let isContainIdFilter = false;
        let targetId = null;
        arg_setFilterOptionsList.forEach((option, index) => {
            if (option['value'] === 'id') {
                if (option['isSelected'] === true) {
                    isContainIdFilter = true;
                    targetId = option['propertyValue'];
                }
            }
        })
        //if id filter is active, do this query instead..
        if (isContainIdFilter) {
            const docRef = doc(db, "invoice", targetId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                ic_st_setTagihanData([{ id: targetId, ...docSnap.data() }])
                //reset current selected row data
                ic_st_setCurrentSelectedRowData([]);
            } else {
                // doc.data() will be undefined in this case
                ic_st_setTagihanData([]);
                //reset current selected row data
                ic_st_setCurrentSelectedRowData([]);
            }
        } else { //else do this query
            let selectedFilterOnly = ic_sf_showOnlySelectedFilter();
            if (selectedFilterOnly.length === 0) {
                console.log('error when trying to filter data..');
            } else {
                try {
                    ic_st_setIsLoading(true);
                    let wheres = ic_sf_constructFirebaseWheres(selectedFilterOnly);
                    console.log('wheres..', wheres);
                    let tagihanData = await ic_af_getDataFromDb(db, targetCollection, wheres);
                    ic_st_setTagihanData(tagihanData)
                    ic_st_setIsLoading(false);
                    //reset current selected row data
                    ic_st_setCurrentSelectedRowData([]);
                } catch (err) {
                    console.log(err.message);
                    ic_st_setIsLoading(false);
                }
            }
        }
    }
    const ic_sf_setCurrentSelectedRowData = (id) => {
        console.log('id', id);
        ic_st_setCurrentSelectedIDs(id); //set current selected IDs
        const selectedRowData = ic_st_rows.filter((row) => {
            return row['id'] === id[0]
        });
        console.log("selectedRowData", selectedRowData);
        ic_st_setCurrentSelectedRowData(selectedRowData); //multiple row data
    }
    //filter state
    const [ic_st_isAlertShown, ic_st_setIsAlertShown] = useState(false);
    const [ic_st_alertMessage, ic_st_setAlertMessage] = useState("");
    const [ic_st_tagihanData, ic_st_setTagihanData] = useState([]);
    const [ic_st_rows, ic_st_setRows] = useState([]);
    const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
    const [ic_st_currentSelectedRowData, ic_st_setCurrentSelectedRowData] = useState([]);
    const [ic_st_editDataInputs, ic_st_setEditDataInputs] = useState([]);
    const [ic_st_isEditDialogOpen, ic_st_setIsEditDialogOpen] = useState(false);
    const [ic_st_currentSelectedIDs, ic_st_setCurrentSelectedIDs] = useState([]);
    //data display state
    const [ic_st_isCheckbox, ic_st_setIsCheckbox] = useState(false);
    //snackbar state
    const [ic_st_isSnackbarShown, ic_st_setIsSnackbarShown] = useState(false);
    const [ic_st_msgSeverity, ic_st_setMsgSeverity] = useState('success');
    //effects
    useEffect(() => {
        console.log('current selected ids', JSON.stringify(ic_st_currentSelectedIDs))
    }, [ic_st_currentSelectedIDs])
    useEffect(() => {
        //get bill list from database
        const ic_ue_empty_af_getBillList = async () => {
            try {
                const docs = await getDocs(query(collection(db, "biaya")));
                let arr = [];
                docs.forEach((doc) => {
                    arr.push({
                        "id": doc.id,
                        "text": doc.data()['jenis'],
                        "value": doc.data()['jenis']
                    })
                });
                arg_st_setFilterOptionsList([...arg_setFilterOptionsList].map((option) => {
                    //set tagihan type of filter to actual biaya list from database
                    if (option.value === 'tagihan') {
                        option.items = arr
                    }
                    return option;
                }))
            } catch (err) {
                console.log(err.message);
            }
        }
        ic_ue_empty_af_getBillList();
    }, [])
    useEffect(() => {
        //display data in to table format
        ic_st_tagihanData.length > 0 ? ic_st_setRows(ic_st_tagihanData.map((dt) => {
            return {
                "id": dt["id"],
                "kategori" : dt['kategori'],
                "status-invoice": dt['status-invoice'] == true ? 'LUNAS' : 'BELUM LUNAS', //ok
                "nama-daftar-tagihan": JSON.stringify(dt['nama-daftar-tagihan']), //ok
                "subtotal" : dt['subtotal'],
                "potongan" : dt['potongan'],
                "biaya": dt['biaya'], //not available
                "banyak-biaya": dt['banyak-biaya'],
                "sudah-dibayar": dt['sudah-dibayar'], //not available
                "sisa": dt['sisa'], //not available
                "status-tagihan": dt['status-tagihan'] == true ? 'LUNAS' : 'BELUM LUNAS', //ok
                "status-kelompok-tagihan": dt['status-kelompok-tagihan'] == true ? 'LUNAS' : 'BELUM LUNAS',
                "blok": dt['blok'],
                "nomor-rumah": dt['nomor-rumah'],
                "nomor-kk": dt['nomor-kk'],
                "nomor-telpon": dt['nomor-telpon'],
                "nomor-hp": dt['nomor-hp'],
                "email": dt['email'],
                "tanggal-dibuat": toDate(dt['tanggal-dibuat']),
                "tanggal-aktif": toDate(dt['tanggal-aktif']),
                "tanggal-dibayar": toDate(dt['tanggal-dibayar']),
                "tagihan": JSON.stringify(dt['tagihan']),
                "kolektor": dt['kolektor'] === '-' ? '-' : JSON.stringify(dt['kolektor']),
                "bulan": dt['bulan'],
                "tahun": dt['tahun']
            }
        })) : ic_st_setRows([])
    }, [ic_st_tagihanData])
    useEffect(() => {
        //construct edit data inputs state to supply RMSEditData inputs props
        ic_st_setEditDataInputs(ic_st_currentSelectedRowData.map((row) => {
            const keys = Object.keys(row);
            return keys.map((key) => {
                let propertyValue = row[key];
                if (key === 'status-tagihan' || key === 'status-kelompok-tagihan') {
                    //checking if value is kind of 'LUNAS' or boolean,
                    //because status tagihan data retrieved from clicking table's row will be a string with 'LUNAS' kind of value
                    //so we have to convert it to a boolean for the select option component to be able to display the current value.
                    //but, when handleChange method called, the new value will be boolean.
                    propertyValue = typeof (row[key]) === 'string' ? (row[key] === 'LUNAS' ? true : false) : row[key]
                } else if (key === 'tanggal-awal' || key === 'tanggal-akhir') {
                    console.log(`key : ${key} , value: ${row[key]}`);
                }
                const mapStatus = [true, false].map((b) => { return { "text": b === true ? "LUNAS" : "BELUM LUNAS", "value": b } });
                const mapBloks = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((alphabet) => { return { "text": alphabet, "value": alphabet } });
                const mapTagihan = ['Iuran Listrik', 'Iuran Keamanan', 'Iuran Kebersihan'].map((iuran) => { return { 'text': iuran, 'value': iuran } });
                return {
                    "text": key,
                    "propertyValue": propertyValue,
                    "type": (key === 'blok' || key === 'status-tagihan' || key === 'status-kelompok-tagihan' || key === 'tagihan') ? 'select' : (key === 'tanggal-aktif' || key === 'tanggal-dibuat' || key === 'tanggal-aktif' || key === 'tanggal-dibayar') ? 'date' : 'text',
                    "isError": () => {
                        if (row[key] === undefined) {
                            return true;
                        } else if (row[key].length === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    "items": (key === 'status-tagihan' || key === 'status-kelompok-tagihan') ? mapStatus : (key === 'blok') ? mapBloks : (key === 'tagihan') ? mapTagihan : [],
                    "isRequired": true,
                    "isDisabled": (key !== 'biaya' || key !== 'status-tagihan' || key !== 'sudah-dibayar' || key === 'tanggal-dibayar') ? true : false,
                    "handleChange": (newValue) => {
                        let newPropertyValue = newValue;
                        ic_st_setCurrentSelectedRowData(ic_st_currentSelectedRowData.map((r) => {
                            r[key] = newPropertyValue;
                            return r;
                        }))
                    },
                }
            })
        }));
    }, [ic_st_currentSelectedRowData])
    return [
        ic_st_msgSeverity,
        ic_af_deleteSelectedBills,
        ic_st_currentSelectedIDs,
        ic_st_isSnackbarShown,
        ic_st_setIsSnackbarShown,
        ic_af_updateData,
        ic_st_currentSelectedRowData,
        ic_st_isAlertShown,
        ic_st_alertMessage,
        ic_st_setIsAlertShown,
        ic_af_showData,
        ic_sf_handleSelectedFilterChange,
        ic_st_rows,
        ic_st_isLoading,
        ic_sf_setCurrentSelectedRowData,
        ic_st_setIsCheckbox,
        ic_st_isCheckbox,
        ic_st_isEditDialogOpen,
        ic_st_setIsEditDialogOpen
    ]
}

export default useViewData;