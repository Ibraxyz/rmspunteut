import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Button, Divider, Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Chip } from '@mui/material';
import RMSTextField from '../components/RMSTextField';
import AddIcon from '@mui/icons-material/Add';
import RMSSelect from '../components/RMSSelect';
import RMSSnackbar from '../components/RMSSnackbar';
//firestore
import { addDoc, doc, setDoc, where, getDoc, getDocs, collection, query } from "firebase/firestore";
//db
import { db } from '../index';
//hooks
import useSnackbar from '../hooks/useSnackbar';
//rms
import RMSTable from '../components/RMSTable';
import RMSSwitch from '../components/RMSSwitch';
//icon
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
//utils
import { getSeparatedDate } from '../rms-utility/rms-utility';
//react router
import { Link } from 'react-router-dom';
import useBlok from '../hooks/useBloks';

import RMSGroupedSelect from '../components/RMSGroupedSelect';
import useGroupedSelect from '../hooks/useGroupedSelect';

const productList = [
    {
        "text": 'Biaya Bulanan',
        "value": 'bb'
    },
    {
        "text": 'Biaya Perawatan Lingkungan Pembangunan dan Renovasi Rumah',
        "value": 'bplprr'
    },
    {
        "text": 'Biaya Retribusi Kendaraan',
        "value": 'brk'
    },
    {
        "text": 'Biaya Retribusi Lingkungan',
        "value": 'brl'
    },
    {
        "text": 'Biaya Custom',
        "value": "biaya"
    }
]

const RMSBuatInvoiceUmum = (props) => {
    const [ic_st_an, ic_st_aazz, ic_st_tasbiII] = useGroupedSelect();
    //blok items
    const [ic_st_blokItems] = useBlok();
    //functions - construct variant items
    const constructVariant = (category) => {
        let variantItems = [];
        switch (category) {
            case 'bb':
                Object.keys(ic_st_bb.biaya).forEach((k) => {
                    variantItems.push({
                        "text": k,
                        "value": k
                    })
                })
                break;
            case 'bplprr':
                Object.keys(ic_st_bplprr.biaya).forEach((k) => {
                    variantItems.push({
                        "text": k,
                        "value": k
                    })
                })
                break;
            case 'brk':
                Object.keys(ic_st_brk.biaya).forEach((k) => {
                    variantItems.push({
                        "text": k,
                        "value": k
                    })
                })
                break;
            case 'brl':
                Object.keys(ic_st_brl.biaya).forEach((k) => {
                    variantItems.push({
                        "text": k,
                        "value": k
                    })
                })
                break;
            case 'biaya':
                console.log(JSON.stringify(ic_st_custom));
                variantItems = ic_st_custom.map((cs) => {
                    return {
                        "text": cs.jenis,
                        "value": cs.id
                    }
                });
                break;
            default:
                break;
        }
        return variantItems;
    }
    //functions - get biaya non custom
    const getBiaya = async (collection, id) => {
        try {
            ic_st_setIsLoading(true);
            const docSnap = await getDoc(doc(db, collection, id));
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const data = docSnap.data();
                h_sf_showSnackbar(`Data Biaya ${collection} berhasil di load...`, 'success');
                ic_st_setIsLoading(false);
                return data;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                h_sf_showSnackbar('No such document!', 'error');
                ic_st_setIsLoading(false);
                return [];
            }
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsLoading(false);
            return [];
        }
    }
    //functions - get biaya custom
    const getBiayaCustom = async () => {
        try {
            ic_st_setIsLoading(true);
            const querySnapshot = await getDocs(collection(db, "biaya"));
            const customList = [];
            querySnapshot.forEach((doc) => {
                customList.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            h_sf_showSnackbar(`Data Biaya Custom berhasil di load...`, 'success');
            ic_st_setIsLoading(false);
            return customList;
        } catch (err) {
            console.log(err.message);
            h_sf_showSnackbar(err.message, 'error');
            ic_st_setIsLoading(false);
            return [];
        }
    }
    //function - determine harga
    const determinePrice = (v) => {
        let price = 0;
        switch (ic_st_selectedType) {
            case 'bb':
                price = ic_st_bb.biaya[v];
                break;
            case 'bplprr':
                price = ic_st_bplprr.biaya[v];
                break;
            case 'brk':
                price = ic_st_brk.biaya[v];
                break;
            case 'brl':
                price = ic_st_brl.biaya[v];
                break;
            case 'biaya':
                price = ic_st_custom.filter((cs) => { return cs.id === v })[0].biaya;
                break;
            default:
                break;
        }
        return price;
    }
    //function - reset item list
    const resetItemList = () => {
        ic_st_setSelectedType(null);
        ic_st_setSelectedVariant(null);
        ic_st_setActiveVariant([]);
        ic_st_setQty(1);
        ic_st_setHarga(0);
    }
    //function - add item to list
    const addItemToList = () => {
        const currentList = [...ic_st_invoiceList];
        const id = Date.now() + ic_st_selectedVariant + ic_st_qty + ic_st_harga + ic_st_harga * ic_st_qty;
        currentList.push({
            "id": id,
            "nama": ic_st_selectedType !== 'bb' ? productList.filter((p) => {
                return p.value === ic_st_selectedType
            })[0].text : ic_st_bb.jenis,
            "variant": ic_st_selectedType === 'biaya' ? ic_st_custom.filter((cs) => { return cs.id === ic_st_selectedVariant })[0].jenis : ic_st_selectedVariant,
            "jumlah": ic_st_qty,
            "harga": ic_st_harga,
            "total-harga": ic_st_harga * ic_st_qty,
            "aksi": <Button variant={'outlined'} startIcon={<DeleteIcon />} onClick={() => { ic_st_setIdToDelete(id) }}>Hapus</Button>
        })
        ic_st_setInvoiceList(currentList);
        resetItemList();
    }
    //hooks - snackbar
    const [h_st_isSnackbarShown, h_st_message, h_st_severity, h_sf_showSnackbar, h_sf_closeSnackbar] = useSnackbar();
    //states
    const [ic_st_bb, ic_st_setBb] = useState([]);
    const [ic_st_bplprr, ic_st_setBblprr] = useState([]);
    const [ic_st_brk, ic_st_setBrk] = useState([]);
    const [ic_st_brl, ic_st_setBrl] = useState([]);
    const [ic_st_custom, ic_st_setCustom] = useState([]);
    const [ic_st_invoiceList, ic_st_setInvoiceList] = useState([]);
    const [ic_st_isDialogOpen, ic_st_setIsDialogOpen] = useState(false);
    const [ic_st_selectedType, ic_st_setSelectedType] = useState(null);
    const [ic_st_activeVariant, ic_st_setActiveVariant] = useState([]);
    const [ic_st_selectedVariant, ic_st_setSelectedVariant] = useState(null);
    const [ic_st_isLoading, ic_st_setIsLoading] = useState(false);
    const [ic_st_qty, ic_st_setQty] = useState(1);
    const [ic_st_harga, ic_st_setHarga] = useState(0);
    const [ic_st_kepada, ic_st_setKepada] = useState(null);
    const [ic_st_blok, ic_st_setBlok] = useState(null);
    const [ic_st_no, ic_st_setNo] = useState(null);
    const [ic_st_generatedInvId, ic_st_setGeneratedInvId] = useState(null);
    const [ic_st_generatedInvoiceList, ic_st_setGeneratedInvoiceList] = useState([]);
    const [ic_st_category, ic_st_setCategory] = useState(null);
    const [ic_st_isPakaiHargaBawaan, ic_st_setIsPakaiHargaBawaan] = useState(false);
    //deleted item id tracker
    const [ic_st_idToDelete, ic_st_setIdToDelete] = useState(null);
    const handlePakaiHargaBawaan = (v) => {
        ic_st_setIsPakaiHargaBawaan(v);
        let hargaBawaan = null;
        const getHargaBawaan = async () => {
            const ref = collection(db, 'kk');
            const conditions = [
                where('blok', '==', ic_st_blok),
                where('no_rumah', '==', `${ic_st_no}`)
            ]
            try {
                console.log('getting collection...');
                const docSnap = await getDocs(query(ref, ...conditions))
                docSnap.forEach((doc) => {
                    console.log(JSON.stringify(doc.data()))
                    hargaBawaan = parseInt(doc.data()['biaya-bulanan'])
                })
                ic_st_setHarga(hargaBawaan);
            } catch (err) {
                console.log(err.message);
                h_sf_showSnackbar(err.message, 'error');
            }
        }
        if (v === false) {
            ic_st_setHarga(0);
        } else {
            getHargaBawaan();
        }
    }
    useEffect(() => {
        const currentList = [...ic_st_invoiceList];
        ic_st_setInvoiceList(currentList.filter((cl) => {
            return cl.id != ic_st_idToDelete
        }));
    }, [ic_st_idToDelete]);
    useEffect(() => {
        const loadAllBiayaData = async () => {
            ic_st_setIsLoading(true);
            //load bb
            const loadBb = async () => {
                const bb = await getBiaya('bb', 'bb1');
                ic_st_setBb(bb);
            }
            await loadBb();
            //load bplprr
            const loadBplprr = async () => {
                const bplprr = await getBiaya('bplprr', 'bplprr1');
                ic_st_setBblprr(bplprr);
            }
            await loadBplprr();
            //load brk
            const loadBrk = async () => {
                const brk = await getBiaya('brk', 'brk1');
                ic_st_setBrk(brk);
            }
            await loadBrk();
            //load brl
            const loadBrl = async () => {
                const brl = await getBiaya('brl', 'brl1');
                ic_st_setBrl(brl);
            }
            await loadBrl();
            //load custom
            const loadCustom = async () => {
                const custom = await getBiayaCustom();
                ic_st_setCustom(custom);
            }
            await loadCustom();
            ic_st_setIsLoading(false);
        }
        loadAllBiayaData();
    }, [])
    //table head
    const tableHead = [
        {
            "title": "Nama"
        },
        {
            "title": "Variant"
        },
        {
            "title": "Harga"
        },
        {
            "title": "Qty"
        },
        {
            "title": "Jumlah"
        },
        {
            "title": "Aksi"
        }
    ]
    //function - is add button active ? 
    const isAddButtonActive = () => {
        if (ic_st_isPakaiHargaBawaan) {
            if (ic_st_qty <= 0 || ic_st_selectedType === null) {
                return true;
            } else {
                return false;
            }
        } else if (!ic_st_isPakaiHargaBawaan) {
            if (ic_st_activeVariant === [] || ic_st_selectedVariant === null || ic_st_qty <= 0 || ic_st_selectedType === null) {
                return true;
            } else {
                return false;
            }
        }
    }
    //function - make invoice
    const makeInvoice = async () => {
        //if address not exist , fail the ops
        try {
            const conditions = [
                where('blok', '==', ic_st_blok),
                where('no_rumah', '==', ic_st_no)
            ];
            const address = await getDocs(query(collection(db, `kk`), ...conditions));
            let length = 0;
            address.forEach((adr) => {
                console.log('adr,no', JSON.stringify(adr.data()['no_rumah']))
                length++;
            })
            if (length === 0) {
                console.log('no docs');
                h_sf_showSnackbar(`Data blok ${ic_st_blok} no. ${ic_st_no} belum ada di database, mohon periksa kembali...`, 'error');
                return;
            }
        } catch (err) {
            console.log(err.message);
        }
        if (ic_st_category === null) {
            h_sf_showSnackbar('Kategori harus dipilih', 'error');
            return;
        } else if (ic_st_blok === null && ic_st_no === null && ic_st_kepada === null) {
            h_sf_showSnackbar('Mohon isi setidaknya satu diantara : kepada, blok, dan nomor rumah...', 'error')
            return;
        }
        ic_st_setIsLoading(true);
        const now = Date.now();
        const separatedDate = getSeparatedDate(now);
        const obj = {};
        //total biaya
        let totalBiaya = 0;
        //nama daftar tagihan array
        let namaDaftarTagihanArr = [];
        //tagihan sub obj
        let tagihanObject = ic_st_invoiceList.map((inv) => {
            namaDaftarTagihanArr.push(inv.nama + ` | ` + inv.variant);
            totalBiaya += parseInt(inv['total-harga']);
            return {
                biaya: inv['total-harga'],
                id: inv.id,
                qty: inv.jumlah,
                jenis: inv.nama + ` | ` + inv.variant + ` ( x ${inv.jumlah} )`
            }
        });
        obj["subtotal"] = totalBiaya;
        obj["potongan"] = 0;
        obj["biaya"] = totalBiaya;
        obj['banyak-biaya'] = ic_st_invoiceList.length;
        obj["blok"] = ic_st_blok;
        obj["email"] = '-';
        obj["tagihan"] = tagihanObject;
        obj["nama-daftar-tagihan"] = namaDaftarTagihanArr;
        obj["nomor-kk"] = '-';
        obj["nomor-rumah"] = ic_st_no;
        obj["sisa"] = totalBiaya;
        obj["status-invoice"] = false;
        obj["sudah-dibayar"] = 0;
        obj["tanggal-aktif"] = now;
        obj["tanggal-dibayar"] = '-';
        obj["tanggal-dibuat"] = now;
        obj["nomor-telpon"] = '-';
        obj["nomor-hp"] = '-';
        obj["kolektor"] = '-';
        obj['bulan'] = separatedDate.month;
        obj['tahun'] = separatedDate.year;
        obj['hari'] = separatedDate.day;
        obj['kategori'] = ic_st_category;
        try {
            const docRef = await addDoc(collection(db, "invoice"), obj);
            console.log("Document written with ID: ", docRef.id);
            ic_st_setGeneratedInvId(docRef.id);
            let currentGeneratedID = [...ic_st_generatedInvoiceList];
            currentGeneratedID.push({
                "id": docRef.id,
                "link": 'https://localhost:3000'
            })
            ic_st_setGeneratedInvoiceList(currentGeneratedID);
            h_sf_showSnackbar(`Invoice berhasi dibuat dengan ID Invoice ${docRef.id}`, 'success');
        } catch (error) {
            console.log('error');
            h_sf_showSnackbar(error.message, 'error');
        }
        //reset everything
        ic_st_setKepada(null);
        ic_st_setBlok(null);
        ic_st_setNo(null);
        ic_st_setInvoiceList([]);
        resetItemList();
        ic_st_setIsLoading(false);
    }
    return (
        <Box>
            {
                ic_st_isLoading === true ? <LinearProgress /> : <></>
            }
            <Paper sx={{ marginBottom: '20px' }}>
                <Box sx={{ padding: '10px' }}>
                    <Typography variant='subtitle2' >Buat Invoice</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <RMSTextField isError={false} isRequired={false} type={"text"} displayFilter={'default'} label={'Kepada'} helperText={'Masukkan Nama Tujuan Invoice'} value={ic_st_kepada} handleChange={(value) => { ic_st_setKepada(value); }} />
                    {/** <RMSSelect isError={false} isRequired={false} displayFilter={'default'} label={'Blok'} helperText={'Blok Rumah'} items={ic_st_blokItems} value={ic_st_blok} handleChange={(value) => { resetItemList(); ic_st_setBlok(value); ic_st_setActiveVariant(constructVariant(value)); }} /> */}
                    <RMSGroupedSelect
                        isError={false}
                        isRequired={false}
                        displayFilter={'default'}
                        an={ic_st_an}
                        aazz={ic_st_aazz}
                        tasbiII={ic_st_tasbiII}
                        value={ic_st_blok}
                        handleChange={(value) => { resetItemList(); ic_st_setBlok(value); ic_st_setActiveVariant(constructVariant(value)); }}
                    />
                    <RMSTextField isError={false} isRequired={false} type={"text"} displayFilter={'default'} label={'Nomor Rumah'} helperText={'Masukkan Nomor Rumah'} value={ic_st_no} handleChange={(value) => { ic_st_setNo(value); }} />
                    <RMSSelect isError={false} isRequired={true} displayFilter={'default'} label={'Kategori'} helperText={'Kategori Invoice'} items={["bulanan", "retribusi", "custom"].map((alphabet) => { return { "text": alphabet, "value": alphabet } })} value={ic_st_category} handleChange={(value) => { ic_st_setCategory(value); }} />
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <RMSTable head={tableHead} rows={ic_st_invoiceList} />
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    <Button sx={{ marginRight: '10px' }} startIcon={<AddIcon />} variant={'outlined'} onClick={() => {
                        ic_st_setIsDialogOpen(true);
                    }}>Tambah Item</Button>
                    <Button startIcon={<AddBoxIcon />} variant={'contained'} onClick={() => {
                        makeInvoice();
                    }} disabled={ic_st_invoiceList.length === 0}>Buat Invoice</Button>
                </Box>
            </Paper>
            {/** invoice yang telah dibuat */}
            <Paper>
                <Box sx={{ padding: '10px' }}>
                    <Typography variant='subtitle2' >Invoice yang telah dibuat</Typography>
                </Box>
                <Divider />
                <Box sx={{ padding: '10px' }}>
                    {
                        ic_st_generatedInvoiceList.map((inv) => {
                            return (
                                <Link to={'/lihat-invoice/' + inv.id} style={{ textDecoration: 'none' }}>
                                    <Chip label={inv.id} onClick={() => { }} sx={{ marginRight: '5px' }} />
                                </Link>
                            )
                        })
                    }
                </Box>
            </Paper>
            {/** dialog */}
            <Dialog open={ic_st_isDialogOpen} onClose={() => ic_st_setIsDialogOpen(false)}>
                <DialogTitle>Tambah Item</DialogTitle>
                <DialogContent>
                    <Stack direction={'column'}>
                        <RMSSelect isError={false} isRequired={true} displayFilter={'default'} label={'Item'} helperText={'Pilih Item'} items={productList} value={ic_st_selectedType} handleChange={(value) => { resetItemList(); ic_st_setSelectedType(value); ic_st_setActiveVariant(constructVariant(value)); }} />
                        {
                            ic_st_selectedType === 'bb' ?
                                <Box sx={{ padding: '10px' }}>
                                    <RMSSwitch label={'Pakai Harga Bawaan Registrasi'} handleChange={(v) => { handlePakaiHargaBawaan(v) }} />
                                </Box> :
                                <></>
                        }
                        {
                            ic_st_selectedType === null || ic_st_isPakaiHargaBawaan ? <></> : <RMSSelect isError={false} isRequired={true} displayFilter={'default'} label={'Variant'} helperText={'Pilih Variant'} items={ic_st_activeVariant} value={ic_st_selectedVariant} handleChange={(v) => { ic_st_setSelectedVariant(v); ic_st_setHarga(determinePrice(v)); }} />
                        }
                        <RMSTextField isError={false} isRequired={true} type={"number"} displayFilter={'default'} label={'Jumlah Item'} helperText={'Masukkan Jumlah Item'} value={ic_st_qty} handleChange={(value) => { ic_st_setQty(value); }} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={'default'} label={'Harga'} helperText={'Harga Item'} value={ic_st_harga} handleChange={(value) => { }} disabled={true} />
                        <RMSTextField isError={false} isRequired={true} displayFilter={'default'} label={'Total Harga'} helperText={'Total Harga Item'} value={ic_st_harga * ic_st_qty} handleChange={(value) => { }} disabled={true} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => ic_st_setIsDialogOpen(false)}>Batal</Button>
                    <Button variant={'contained'} onClick={() => { addItemToList(); ic_st_setIsDialogOpen(false); }} disabled={isAddButtonActive()} >Tambah</Button>
                </DialogActions>
            </Dialog>
            {/** snack bar */}
            <RMSSnackbar
                isOpen={h_st_isSnackbarShown}
                handleClose={() => h_sf_closeSnackbar()}
                severity={h_st_severity}
                message={h_st_message} />
        </Box>
    )
}

export default RMSBuatInvoiceUmum;
