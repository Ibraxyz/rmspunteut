//import react
import React, { useState } from 'react';
//material-ui components
import { Button, Box, Chip, Divider, Paper } from '@mui/material';
//material icons
import AddIcon from '@mui/icons-material/Add';
//rms components
import RMSTextField from './RMSTextField';
import RMSSelect from './RMSSelect';
import RMSDatePicker from './RMSDatePicker';
import RMSAlert from './RMSAlert';
//utility components
import md5 from 'md5';

const RMSFilter = (props) => {
    const [ic_st_isSelectFilterOptionShown, ic_st_setIsSelectFilterShown] = useState(false);
    return (
        <Box style={{ marginBottom: "20px" }}>
            <Paper>
                <Box sx={{ padding: "10px" }}>
                    <RMSAlert isOpen={props.isAlertShown} message={props.alertMessage} setIsOpen={props.setAlertVisibilty} />
                    {
                        //create filter input dynamically
                        props.options.map((option, index) => {
                            switch (option.type) {
                                case 'select':
                                    return (
                                        <RMSSelect key={md5(option.value + ',' + index)} isError={option.isError(index) && props.isAlertShown ? true : false} isRequired={props.isRequired} displayFilter={option.isSelected ? "default" : "none"} label={option.text} helperText={option.helperText} items={option.items} value={option.propertyValue} handleChange={(value) => { option.handleChange(value, index) }} />
                                    );
                                case 'text':
                                    return (
                                        <RMSTextField key={md5(option.value + ',' + index)} isError={option.isError(index) && props.isAlertShown ? true : false} isRequired={props.isRequired} displayFilter={option.isSelected ? "default" : "none"} label={option.text} helperText={option.helperText} value={option.propertyValue} handleChange={(value) => { option.handleChange(value, index) }} />
                                    );
                                case 'date':
                                    return (
                                        <RMSDatePicker key={md5(option.value + ',' + index)} isRequired={props.isRequired} displayFilter={option.isSelected ? "default" : "none"} title={option.text} helperText={option.helperText} value={option.propertyValue} handleChange={(value) => { option.handleChange(value, index) }} />
                                    );
                                default:
                                    break;
                            }
                        })
                    }
                    <Box style={{ margin: "5px 5px 10px 5px" }}>
                        <Button variant="outlined" startIcon={<AddIcon />} disabled={props.options.filter((option) => { return option['isSelected'] === false }).length > 0 ? false : true} onClick={() => ic_st_setIsSelectFilterShown(!ic_st_isSelectFilterOptionShown)}>
                            Tambah Filter
                        </Button>
                    </Box>
                    <RMSSelect isError={false} isRequired={true} displayFilter={ic_st_isSelectFilterOptionShown ? "default" : "none"} label={"Pilih FIlter"} helperText={"Filter Yang akan Digunakan"} items={props.options.filter((option) => { return option['isSelected'] === false })} value={""} handleChange={(value) => { props.handleSelectFilterChange(value, true); ic_st_setIsSelectFilterShown(false) }} />
                </Box>
                <Box sx={{ padding: "10px", display: props.options.filter((option) => { return option['isSelected'] === true }).length > 0 ? "default" : "none" }}>
                    {
                        props.options.filter((option) => { return option['isSelected'] === true }).map((option) => {
                            return (
                                <Chip label={option.text} onDelete={() => { props.handleSelectFilterChange(option.value, false) }} sx={{ margin: "5px" }} />
                            )
                        })
                    }
                </Box>
                <Divider />
                <Box sx={{ paddingTop: "10px" , paddingLeft:'5px', paddingRight:'5px',paddingBottom:'10px'}}>
                    <Button variant="outlined" sx={{
                        margin: "5px"
                    }} disabled={props.options.filter((option) => { return option['isSelected'] === true }).length > 0 ? false : true} onClick={() => { props.handleResetFilter() }}>Hapus Filter</Button>
                    <Button sx={{ margin: "5px" }} onClick={props.showDataFunction} variant="contained" disabled={props.options.filter((option) => { return option['isSelected'] === true }).length === 0 ? true : false}>Tampilkan Data</Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default RMSFilter;