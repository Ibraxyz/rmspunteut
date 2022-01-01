import { useState, useEffect } from 'react';
import { db } from '../index';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

const useGroupedSelect = () => {
    const [ic_st_aazz, ic_st_setAazz] = useState([]);
    const [ic_st_an, ic_st_setAn] = useState([]);
    const [ic_st_tasbiII, ic_st_setTasbiII] = useState([]);
    useEffect(() => {
        const getBloks = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'blok'));
                let an = [];
                let aazz = [];
                let tasbi2 = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().kategori === 'TASBI_I_A-N') {
                        an.push({
                            "text": doc.data().nama,
                            "value": doc.data().nama
                        })
                    }
                    if (doc.data().kategori === 'TASBI_I_AA-ZZ') {
                        aazz.push({
                            "text": doc.data().nama,
                            "value": doc.data().nama
                        })
                    }
                    if (doc.data().kategori === 'TASBI_II') {
                        tasbi2.push({
                            "text": doc.data().nama,
                            "value": doc.data().nama
                        })
                    }
                })
                ic_st_setAazz(aazz);
                ic_st_setAn(an);
                ic_st_setTasbiII(tasbi2);
            } catch (err) {
                if(err.message === 'Quota exceeded.'){
                    alert('Kuota penggunaan aplikasi sudah habis untuk hari ini.')
                }else{
                    alert(err.message);
                }
                console.log(err.message);
            }
        }
        getBloks();
    }, []);
    return [ic_st_an, ic_st_aazz, ic_st_tasbiII];
}

export default useGroupedSelect;