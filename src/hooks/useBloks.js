import { useEffect, useState } from "react";
import { getDoc, getDocs, collection } from "firebase/firestore";
import { db } from '../index';
const useBlok = () => {
    const [ic_st_blokItems, ic_st_setBlokItems] = useState([]);
    //load blok data to fill blok items
    useEffect(() => {
        const getBloks = async () => {
            const bloks = await getDocs(collection(db, `blok`));
            let bloksArr = []
            bloks.forEach((blok) => {
                bloksArr.push({
                    "text": blok.data().nama,
                    "value": blok.data().nama
                })
            })
            ic_st_setBlokItems(bloksArr);
        }
        getBloks();
    }, [])
    return [ic_st_blokItems]
}
export default useBlok;