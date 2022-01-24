import { useState } from "react";
import useDataOperations from "../hooks/useDataOperations";
import usePathUpdater from "../hooks/usePathUpdater";

const useInputForm = (jenisForm) => {
    //redux 
    const [r_state] = usePathUpdater(jenisForm == 'kk' ? "Input Rumah" : jenisForm == 'invoice' ? "Buat Invoice" : "");
    const [isLoading, data, addData, getData, editData, deleteData] = useDataOperations(jenisForm);
    //alert visibility state
    const [isSuccessCreatingTagihanShow, setIsSuccessCreatingTagihanShow] = useState(false);
    //constant
    const submitAction = async (obj) => {
        try {
            await addData(obj);
        } catch (error) {
            console.log(error.message);
        }
    }
    return [
        submitAction,
        isSuccessCreatingTagihanShow,
        setIsSuccessCreatingTagihanShow
    ]
}

export default useInputForm;