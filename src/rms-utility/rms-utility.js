import { doc, setDoc, getDoc, getDocs, collection, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../index";

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function formatRupiah(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getSeparatedDate(date) {
    if (date === undefined) {
        var dateObj = new Date();
    } else {
        var dateObj = new Date(date);
    }
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return {
        month: month,
        day: day,
        year: year
    }
}

const defineMonthName = (month) => {
    let name = null;
    switch (month) {
        case 1:
            name = 'Januari'
            break;
        case 2:
            name = 'Februari'
            break;
        case 3:
            name = 'Maret'
            break;
        case 4:
            name = 'April'
            break;
        case 5:
            name = 'Mei'
            break;
        case 6:
            name = 'Juni'
            break;
        case 7:
            name = 'Juli'
            break;
        case 8:
            name = 'Agustus'
            break;
        case 9:
            name = 'September'
            break;
        case 10:
            name = 'Oktober'
            break;
        case 11:
            name = 'November'
            break;
        case 12:
            name = 'Desember'
            break;
        default:
            break;
    }
    return name;
}
//const substractIkkReport
const substractIkkReport = async (status, blok, tahun) => {
    //substract ikk report
    if (status === false) {
        console.log('invoice belum lunas jadi substract tidak dilakukan...');
        return;
    }
    //get wanted doc
    try {
        const ref = collection(db, `ikk-report/${tahun}/data/`);
        const conditions = [
            where('blok-only', '==', blok),
        ];
        const querySnapshot = await getDocs(query(ref, ...conditions));
        const idToBeDeleted = [];
        querySnapshot.forEach((doc) => {
            idToBeDeleted.push(doc.id);
        });
        //delete the docs
        for (let i = 0; i < idToBeDeleted.length; i++) {
            try {
                await deleteDoc(doc(db, `ikk-report/${tahun}/data/${idToBeDeleted[i]}`));
            } catch (err) {
                console.log(err.message);
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}

const substractReport = async (status, blok, norumah, bulan, tahun) => {
    //substract per blok report

    //substract merged report

    //substract merged yearly report

    //substract all time report
}

//create ikk report 
const createIkkReport = async (tahun, bulan, blok, norumah, subtotal, biaya, currentUser) => {
    //tahun dan bulan disini merujuk pada periode kwitansi bukan pada tahun dan bulan saat ini
    let bulanText = null;
    const obj = {
        "blok-only": blok,
        "blok": `${blok}-${norumah}`,
        "ikk": subtotal,
        "januari": 0,
        "februari": 0,
        "maret": 0,
        "april": 0,
        "mei": 0,
        "juni": 0,
        "juli": 0,
        "agustus": 0,
        "september": 0,
        "oktober": 0,
        "november": 0,
        "desember": 0,
        "bulan": bulan,
        "tahun": tahun,
        "kolektor": currentUser,
        "kolektorId": currentUser.uid,
    }
    switch (bulan) {
        case 1:
            bulanText = 'januari';
            break;
        case 2:
            bulanText = 'februari';
            break;
        case 3:
            bulanText = 'maret';
            break;
        case 4:
            bulanText = 'april';
            break;
        case 5:
            bulanText = 'mei';
            break;
        case 6:
            bulanText = 'juni';
            break;
        case 7:
            bulanText = 'juli';
            break;
        case 8:
            bulanText = 'agustus';
            break;
        case 9:
            bulanText = 'september';
            break;
        case 10:
            bulanText = 'oktober';
            break;
        case 11:
            bulanText = 'november';
            break;
        case 12:
            bulanText = 'desember';
            break;
        default:
            break;
    }
    obj[bulanText] = biaya;
    await addDoc(collection(db, `ikk-report/${tahun}/data/`), obj);
}

//get whatsapp link
const getWhatsappLink = (yourNumber,yourMessage) => {
    let number = '+62' + yourNumber.substring(1);
    let message = yourMessage.split(' ').join('%20')
    return 'https://api.whatsapp.com/send?phone=' + number + '&text=%20' + message;
}

//create report
const createReport = async (blok, category, nominal, currentUser) => {
    try {
        ////outline-report/2021/bulan/januari/blok/A/biaya/retribusi/kolektor/programmer/
        const separatedDate = getSeparatedDate(Date.now());
        //per blok report
        //get the same collector and block doc first
        const ref = collection(db, `per-blok-report/${separatedDate.year}/bulan/${separatedDate.month}/data/`);
        const conditions = [
            where('kolektor', '==', currentUser.uid),
            where('blok', '==', blok),
            where('kategori', "==", category)
        ]
        const querySnapshot = await getDocs(query(ref, ...conditions));
        let length = 0;
        let total = 0;
        let id = 0;
        querySnapshot.forEach((qs) => {
            let qsData = qs.data();
            if (qsData.kolektor === currentUser.uid && qsData.kategori === category && qsData.blok === blok) {
                total += qs.data().total;
                id = qs.id;
                length++;
            }
        });
        if (length === 0) {
            await addDoc(collection(db, `per-blok-report/${separatedDate.year}/bulan/${separatedDate.month}/data/`), {
                "blok": blok,
                "kolektor": currentUser.uid,
                "kategori": category,
                "total": nominal
            });
        } else {
            await setDoc(doc(db, `per-blok-report/${separatedDate.year}/bulan/${separatedDate.month}/data/${id}`), {
                "blok": blok,
                "kolektor": currentUser.uid,
                "kategori": category,
                "total": nominal + total
            });
        }
        //get latest total for merged report
        const docSnap2 = await getDoc(doc(db, 'merged-report', `${separatedDate.year}`, "bulan", `${separatedDate.month}`, 'kolektor', `${currentUser.uid}`))
        if (docSnap2.exists()) {
            console.log("Document data:", docSnap2.data());
            console.log('CURRENTTOTALATMERGED', docSnap2.data().total)
            //laporan gabungan 
            await setDoc(doc(db, 'merged-report', `${separatedDate.year}`, "bulan", `${separatedDate.month}`, 'kolektor', `${currentUser.uid}`), {
                "total": nominal + docSnap2.data().total,
                "kolektor": currentUser
            });
        } else {
            // doc.data() will be undefined in this case
            await setDoc(doc(db, 'merged-report', `${separatedDate.year}`, "bulan", `${separatedDate.month}`, 'kolektor', `${currentUser.uid}`), {
                "total": nominal,
                "kolektor": currentUser
            });
            console.log("No such document!");
        }
        //get latest total for merged yearly report
        const docSnap3 = await getDoc(doc(db, 'merged-yearly-report', `${separatedDate.year}`, 'kolektor', `${currentUser.uid}`))
        if (docSnap3.exists()) {
            console.log("Document data:", docSnap3.data());
            console.log('CURRENTTOTALATMERGED', docSnap3.data().total)
            //laporan gabungan 
            await setDoc(doc(db, 'merged-yearly-report', `${separatedDate.year}`, 'kolektor', `${currentUser.uid}`), {
                "total": nominal + docSnap3.data().total,
                "kolektor": currentUser
            });
        } else {
            // doc.data() will be undefined in this case
            await setDoc(doc(db, 'merged-yearly-report', `${separatedDate.year}`, 'kolektor', `${currentUser.uid}`), {
                "total": nominal,
                "kolektor": currentUser
            });
            console.log("No such document!");
        }
        //all time report 
        const docSnap4 = await getDoc(doc(db, `all-time-report/${currentUser.uid}`));
        if (docSnap4.exists()) {
            await setDoc(doc(db, `all-time-report/${currentUser.uid}`), {
                "total": nominal + docSnap4.data().total
            })
        } else {
            await setDoc(doc(db, `all-time-report/${currentUser.uid}`), {
                "total": nominal
            })
        }
        //laporan data ikk per tahun per blok
    } catch (err) {
        console.log(err.message);
        alert(err.message);
    }
}
export { asyncForEach, formatRupiah, getSeparatedDate, defineMonthName, createReport, createIkkReport, substractIkkReport, substractReport, getWhatsappLink };

/**F
22
EMPTY
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
51
70000
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
29
100000
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
19
EMPTY
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
40
150000
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
59
RK
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
45
100000
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
06
RK
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
72
200000
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
F
60
250000
BELUM LUNAS
1
2022
Sat Jan 01 2022 16:52:39 GMT+0700 (Western Indonesia Time)
Rows per page:

100
1-77 of 77

 */