import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HomeIcon from '@mui/icons-material/Home';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from "react-router-dom";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RMSPengaturanBiaya from '../pages/RMSPengaturanBiaya';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
function RMSTempDrawer(props) {
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={() => props.handleClick(false)}
            onKeyDown={() => props.handleClick(false)}
        >
            <List>
                <Link to="/" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Beranda"}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Beranda"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="/input-kk" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Input Rumah"}>
                        <ListItemIcon>
                            <AddReactionIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Input Rumah"} />
                    </ListItem>
                </Link>
                <Link to="/lihat-kk" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Lihat KK"}>
                        <ListItemIcon>
                            <FamilyRestroomIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Lihat KK"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="/input-biaya" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Input Biaya Custom"}>
                        <ListItemIcon>
                            <AddCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Input Biaya Custom"} />
                    </ListItem>
                </Link>
                <Link to="/lihat-biaya" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Lihat Biaya Custom"}>
                        <ListItemIcon>
                            <FindInPageIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Lihat Biaya Custom"} />
                    </ListItem>
                </Link>
                <Link to="/pengaturan-biaya" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Pengaturan Biaya"}>
                        <ListItemIcon>
                            <AttachMoneyIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Pengaturan Biaya"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="/buat-invoice-umum" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Buat Invoice"}>
                        <ListItemIcon>
                            <NoteAddIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Buat Invoice"} />
                    </ListItem>
                </Link>
                <Link to="/buat-invoice" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Buat Invoice Bulanan"}>
                        <ListItemIcon>
                            <LibraryAddIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Buat Invoice Bulanan"} />
                    </ListItem>
                </Link>
                <Link to="/lihat-invoice/noid" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Lihat Invoice"}>
                        <ListItemIcon>
                            <SearchIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Lihat Invoice"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="/lihat-laporan/" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Lihat Laporan"}>
                        <ListItemIcon>
                            <BarChartIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Lihat Laporan"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="/manage-user" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Pengaturan User"}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Pengaturan User"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="/tentang" style={{ textDecoration: "none", color: "initial" }}>
                    <ListItem button key={"Tentang Aplikasi"}>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Tentang Aplikasi"} />
                    </ListItem>
                </Link>
            </List>
        </Box>
    );

    return (
        <div>
            <React.Fragment key={'left'}>
                <Drawer
                    anchor={'left'}
                    open={props.isOpen}
                    onClose={() => props.handleClick(false)}
                >
                    {list('left')}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export default RMSTempDrawer;
