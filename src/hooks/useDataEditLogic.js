import { useState, useEffect } from 'react';
import useDataOperations from "../hooks/useDataOperations";

const useDataEditLogic = (jenisLogic, selectedCollection, mapDataToRowFunc) => {
    const [isCellInEditMode, setIsCellInEditMode] = useState(false);
    const [editDataDocIdTracker, setEditDataDocIdTracker] = useState(null);
    const [editDataFieldTracker, setEditDataFieldTracker] = useState(null);
    const [editDataValueTracker, setEditDataValueTracker] = useState(null);
    const [isSaveButtonOn, setIsSaveButtonOn] = useState(false);
    const selectionModelChangeAction = (g) => {
        console.log("selectionModelChangeAction", g);
        setCurrentSelectedIds(g);
    }
    const editRowsModelChangeAction = (e) => { //used for get docId,field,value from data grid in order to upload data to db
        console.log('onEditRowsModelChange e', e);
        for (var d in e) {
            setEditDataDocIdTracker(d);
            for (var f in e[d]) {
                setEditDataFieldTracker(f);
                for (var v in e[d][f]) {
                    setEditDataValueTracker(e[d][f][v])
                }
            }
        }
    }
    const [l_jenisTagihan, setL_setJenisTagihan] = useState(null);
    const [currentSelectedIds, setCurrentSelectedIds] = useState([]);
    const [d_isLoading, d_data, d_addData, d_getData, d_editData, d_deleteData] = useDataOperations(selectedCollection);
    const [b_isLoading, b_data, b_addData, b_getData, b_editData, b_deleteData] = useDataOperations('biaya');
    const deleteData = async () => {
        console.log("deleting data...");
        const currentSelectedIDSTemp = [...currentSelectedIds];
        for (let i = 0; i < currentSelectedIDSTemp.length; i++) {
            await d_deleteData(selectedCollection, currentSelectedIDSTemp[i]);
            console.log(`index at ${i} has been deleted`);
        }
        setMessage("Tagihan berhasil dihapus");
        setIsSuccessCreatingTagihanShow(true);
        return currentSelectedIDSTemp;
    }
    const editData = async () => {
        console.log("updating data...");
        const currentSelectedIDSTemp = [...currentSelectedIds];
        //console.log(currentSelectedIDSTemp)
        for (let i = 0; i < currentSelectedIDSTemp.length; i++) {
            if (jenisLogic === "Lihat Biaya") {
                if (editDataFieldTracker === 'biaya') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { biaya: editDataValueTracker });
                } else if (editDataFieldTracker === 'jenis') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { jenis: editDataValueTracker });
                } else {
                    console.log('error when updating data..');
                    return;
                }
            } else if (jenisLogic === "Lihat Tagihan") {
                if (editDataFieldTracker === 'no_tagihan') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { no_tagihan: editDataValueTracker });
                } else if (editDataFieldTracker === 'kelompok_tagihan') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { kelompok_tagihan: editDataValueTracker });
                } else if (editDataFieldTracker === 'jenis') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { jenis: editDataValueTracker });
                } else if (editDataFieldTracker === 'biaya') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { biaya: editDataValueTracker });
                } else if (editDataFieldTracker === 'sudah_dibayar') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { sudah_dibayar: editDataValueTracker });
                } else if (editDataFieldTracker === 'sisa') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { sisa: editDataValueTracker });
                } else if (editDataFieldTracker === 'sudahLunas') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { sudahLunas: editDataValueTracker == "LUNAS" || editDataValueTracker == "lunas" || editDataValueTracker == "Lunas" ? true : false });
                } else if (editDataFieldTracker === 'blok') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { blok: editDataValueTracker });
                } else if (editDataFieldTracker === 'no_rumah') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { no_rumah: editDataValueTracker });
                } else if (editDataFieldTracker === 'no_kk') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { no_kk: editDataValueTracker });
                } else if (editDataFieldTracker === 'telp') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { telp: editDataValueTracker });
                } else if (editDataFieldTracker === 'hp') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { hp: editDataValueTracker });
                } else if (editDataFieldTracker === 'email') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { email: editDataValueTracker });
                } else if (editDataFieldTracker === 'tanggal_dibuat') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { tanggal_dibuat: editDataValueTracker });
                } else if (editDataFieldTracker === 'tanggal_aktif') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { tanggal_aktif: editDataValueTracker });
                } else if (editDataFieldTracker === 'tanggal_dibayar') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { tanggal_dibayar: editDataValueTracker });
                } else if (editDataFieldTracker === 'status_kelompok_tagihan') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { status_kelompok_tagihan: editDataValueTracker == "LUNAS" || editDataValueTracker == "lunas" || editDataValueTracker == "Lunas" ? true : false });
                }else {
                    console.log('error when updating data..');
                    return;
                }
            } else if (jenisLogic === "Lihat KK") {
                if (editDataFieldTracker === 'blok') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { blok: editDataValueTracker });
                } else if (editDataFieldTracker === 'no_rumah') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { no_rumah: editDataValueTracker });
                } else if (editDataFieldTracker === 'no_kk') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { no_kk: editDataValueTracker });
                } else if (editDataFieldTracker === 'telp') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { telp: editDataValueTracker });
                } else if (editDataFieldTracker === 'hp') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { hp: editDataValueTracker });
                } else if (editDataFieldTracker === 'email') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { email: editDataValueTracker });
                } else if (editDataFieldTracker === 'tanggal_bergabung') {
                    await d_editData(selectedCollection, editDataDocIdTracker, { tanggal_bergabung: editDataValueTracker });
                } else {
                    console.log('error when updating data..');
                    return;
                }
            }
            setCurrentSelectedIds([]);
            console.log(`index at ${i} has been updated`);
        }
        setMessage(jenisLogic === 'Lihat Biaya' ? "Biaya berhasil diubah" : jenisLogic === 'Lihat Tagihan' ? "Tagihan Berhasil Diubah" : jenisLogic === 'Lihat KK' ? 'KK Berhasil Diubah' : 'No Comment');
        setIsSuccessCreatingTagihanShow(true);
        setIsCellInEditMode(false);
        await d_getData([]);
    }
    const cancelEdit = () => {
        console.log("cancel edit do its action")
        //setRowsBasedOnData();
        mapDataToRowFunc();
        setIsCellInEditMode(false);
    }
    const [isSuccessCreatingTagihanShow, setIsSuccessCreatingTagihanShow] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        console.log("DATA EDIT LOGIC USEEFFECT [] GETDATA B_D")
        const getDataProcess = async () => {
            try {
                if(selectedCollection == 'biaya'){
                    await d_getData([]); 
                }
                await b_getData([]);
            } catch (err) {
                console.log(err);
            }
        }
        getDataProcess();
    }, [])
    useEffect(() => {
        //this is used for populate jenis tagihan select option in filter section
        let modifiedData = [];
        b_data.map((d) => {
            modifiedData.push(
                {
                    "text": d.jenis,
                    "value": d.jenis
                }
            )
        })
        setL_setJenisTagihan(modifiedData);
    }, [b_data]);
    useEffect(() => {
        //this is used for populate table for the first time if selected collection is biaya
        if(selectedCollection == 'biaya'){
            mapDataToRowFunc();
        }
    }, [d_data])
    return [
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
    ]
}

export default useDataEditLogic;