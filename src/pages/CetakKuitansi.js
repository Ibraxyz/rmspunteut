import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
//redux
import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";

import DummyComponent from '../components/DummyComponent';;

const CetakKuitansi = () => {
    //redux 
    const dispatch = useDispatch();
    const { updateCurrentPath } = bindActionCreators(actionCreators, dispatch);
    useEffect(()=>{
        updateCurrentPath("Cetak Kuitansi");
    },[])
    const componentRef = useRef();
    const [text,setText] = useState("");
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <div>
            <DummyComponent ref={componentRef} text={text}/>
            <input type="text" onChange={(e)=>setText(e.target.value)} />
            <button onClick={handlePrint}>Cetak</button>
        </div>
    );
};

export default CetakKuitansi;