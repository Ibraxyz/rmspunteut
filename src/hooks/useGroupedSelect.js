import { useState, useEffect } from 'react';
import { db } from '../index';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import { useSelector } from 'react-redux';

const useGroupedSelect = () => {
    const [ic_st_aazz, ic_st_setAazz] = useState([]);
    const [ic_st_an, ic_st_setAn] = useState([]);
    const [ic_st_tasbiII, ic_st_setTasbiII] = useState([]);
    const r_currentUser = useSelector((state) => state.currentUser);
    const getBloks = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'blok'));
            let an = [];
            let aazz = [];
            let tasbi2 = [];
            querySnapshot.forEach((doc) => {
                console.log('blok data --- save now', JSON.stringify({ id: doc.id, ...doc.data() }))
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
            if (err.message === 'Quota exceeded.') {
                alert('Kuota penggunaan aplikasi sudah habis untuk hari ini.')
            } else {
                console.log(err.message);
            }
            console.log(err.message);
        }
    }
    useEffect(() => {
        getBloks();
    }, [r_currentUser]);
    return [ic_st_an, ic_st_aazz, ic_st_tasbiII];
}
export default useGroupedSelect;

/**
 * blok data --- save now {"id":"1","nama":"1","kategori":"TASBI_II"}
useGroupedSelect.js:17 blok data --- save now {"id":"2","nama":"2","kategori":"TASBI_II"}
useGroupedSelect.js:17 blok data --- save now {"id":"A","nama":"A","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"AA","kategori":"TASBI_I_AA-ZZ","nama":"AA"}
useGroupedSelect.js:17 blok data --- save now {"id":"B","nama":"B","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"BB","nama":"BB","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"C","kategori":"TASBI_I_A-N","nama":"C"}
useGroupedSelect.js:17 blok data --- save now {"id":"CC","nama":"CC","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"D","kategori":"TASBI_I_A-N","nama":"D"}
useGroupedSelect.js:17 blok data --- save now {"id":"DD","kategori":"TASBI_I_AA-ZZ","nama":"DD"}
useGroupedSelect.js:17 blok data --- save now {"id":"E","kategori":"TASBI_I_A-N","nama":"E"}
useGroupedSelect.js:17 blok data --- save now {"id":"EE","nama":"EE","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"F","nama":"F","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"FF","nama":"FF","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"G","nama":"G","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"GG","kategori":"TASBI_I_AA-ZZ","nama":"GG"}
useGroupedSelect.js:17 blok data --- save now {"id":"H","kategori":"TASBI_I_A-N","nama":"H"}
useGroupedSelect.js:17 blok data --- save now {"id":"HH","kategori":"TASBI_I_AA-ZZ","nama":"HH"}
useGroupedSelect.js:17 blok data --- save now {"id":"I","kategori":"TASBI_I_A-N","nama":"I"}
useGroupedSelect.js:17 blok data --- save now {"id":"II","nama":"II","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"III","kategori":"TASBI_II","nama":"III"}
useGroupedSelect.js:17 blok data --- save now {"id":"IV","nama":"IV","kategori":"TASBI_II"}
useGroupedSelect.js:17 blok data --- save now {"id":"IX","nama":"IX","kategori":"TASBI_II"}
useGroupedSelect.js:17 blok data --- save now {"id":"J","kategori":"TASBI_I_A-N","nama":"J"}
useGroupedSelect.js:17 blok data --- save now {"id":"JJ","kategori":"TASBI_I_AA-ZZ","nama":"JJ"}
useGroupedSelect.js:17 blok data --- save now {"id":"K","nama":"K","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"KK","kategori":"TASBI_I_AA-ZZ","nama":"KK"}
useGroupedSelect.js:17 blok data --- save now {"id":"L","nama":"L","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"LL","nama":"LL","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"M","kategori":"TASBI_I_A-N","nama":"M"}
useGroupedSelect.js:17 blok data --- save now {"id":"MM","nama":"MM","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"N","nama":"N","kategori":"TASBI_I_A-N"}
useGroupedSelect.js:17 blok data --- save now {"id":"NN","kategori":"TASBI_I_AA-ZZ","nama":"NN"}
useGroupedSelect.js:17 blok data --- save now {"id":"OO","kategori":"TASBI_I_AA-ZZ","nama":"OO"}
useGroupedSelect.js:17 blok data --- save now {"id":"PP","kategori":"TASBI_I_AA-ZZ","nama":"PP"}
useGroupedSelect.js:17 blok data --- save now {"id":"QQ","kategori":"TASBI_I_AA-ZZ","nama":"QQ"}
useGroupedSelect.js:17 blok data --- save now {"id":"RR","kategori":"TASBI_I_AA-ZZ","nama":"RR"}
useGroupedSelect.js:17 blok data --- save now {"id":"SS","nama":"SS","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"TT","nama":"TT","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"UU","kategori":"TASBI_I_AA-ZZ","nama":"UU"}
useGroupedSelect.js:17 blok data --- save now {"id":"V","nama":"V","kategori":"TASBI_II"}
useGroupedSelect.js:17 blok data --- save now {"id":"VI","kategori":"TASBI_II","nama":"VI"}
useGroupedSelect.js:17 blok data --- save now {"id":"VII","kategori":"TASBI_II","nama":"VII"}
useGroupedSelect.js:17 blok data --- save now {"id":"VIII","kategori":"TASBI_II","nama":"VIII"}
useGroupedSelect.js:17 blok data --- save now {"id":"VV","kategori":"TASBI_I_AA-ZZ","nama":"VV"}
useGroupedSelect.js:17 blok data --- save now {"id":"X","kategori":"TASBI_II","nama":"X"}
useGroupedSelect.js:17 blok data --- save now {"id":"XI","kategori":"TASBI_II","nama":"XI"}
useGroupedSelect.js:17 blok data --- save now {"id":"XX","kategori":"TASBI_I_AA-ZZ","nama":"XX"}
useGroupedSelect.js:17 blok data --- save now {"id":"YY","nama":"YY","kategori":"TASBI_I_AA-ZZ"}
useGroupedSelect.js:17 blok data --- save now {"id":"ZZ","kategori":"TASBI_I_AA-ZZ","nama":"ZZ"}
 */