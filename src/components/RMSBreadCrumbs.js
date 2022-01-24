import React, { useState, useEffect } from "react";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
//redux
import { useSelector } from "react-redux";
import md5 from "md5";

const RMSBreadCrumbs = () => {
    //redux 
    const r_currentPathState = useSelector((state) => state.currentPath);
    const [path, setPath] = useState([]);
    useEffect(() => {
        console.log("i'm path use effect and i'm called...");
        console.log("RCURRENTPATHSTATE", r_currentPathState);
        switch (r_currentPathState) {
            case "Beranda":
                setPath([{ "name": "Beranda", "link": "/" }]);
                break;
            case "Lihat Tagihan":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Lihat Tagihan", "link": "/lihat-tagihan" }]);
                break;
            case "Buat Tagihan":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Buat Tagihan", "link": "/Buat-tagihan" }]);
                break;
            case "Cetak Kuitansi":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Lihat Tagihan", "link": "/lihat-tagihan" }, { "name": "Cetak Kuitansi", "link": "/cetak-kuitansi" }]);
                break;
            case "Input KK":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Input Rumah", "link": "/input-kk" }]);
                break;
            case "Lihat KK":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Lihat KK", "link": "/lihat-kk" }]);
                break;
            case "Tentang Aplikasi":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Tentang Aplikasi", "link": "/tentang" }]);
                break;
            case "Input Biaya":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Input Biaya", "link": "/input-biaya" }]);
                break;
            case "Lihat Biaya":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Lihat Biaya", "link": "/lihat-biaya" }]);
                break;
            case "Lihat Faktur":
                setPath([{ "name": "Beranda", "link": "/" }, { "name": "Lihat Faktur", "link": "/lihat-faktur" }]);
                break;
            default:
                break;
        }
    }, [r_currentPathState]);
    return (
        <Box sx={{ marginBottom: "20px" }}>
            <Breadcrumbs aria-label="breadcrumb">
                {
                    path.map((p, index) => {
                        return (
                            index == path.length - 1 ?
                                <Typography key={md5("typography"+p.name+","+p.link+","+index)} color="text.primary" key={md5(p.name+","+p.link+","+index)} >{p.name}</Typography>
                                :
                                <Link key={md5(p.name+","+p.link+","+index)} to={p.link} style={{ textDecoration: "none", color: "initial" }}>
                                    {p.name}
                                </Link>
                        )
                    })
                }
            </Breadcrumbs>
        </Box>
    )
}

export default RMSBreadCrumbs;