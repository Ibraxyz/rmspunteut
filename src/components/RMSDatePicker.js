import React, { useState, useEffect } from "react";
// date-fns
import DateAdapter from '@mui/lab/AdapterDateFns';
import {getTime} from 'date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText } from "@mui/material";

const RMSDatePicker = (props) => {
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
                label={props.title}
                value={props.value}
                onChange={(newValue) => {
                    props.handleChange(newValue);
                }}
                renderInput={(params) =>
                    <FormControl sx={{margin:"5px",display:props.displayFilter}}>
                        <TextField {...params} />
                        <FormHelperText>{props.helperText}</FormHelperText>
                    </FormControl>
                }
            />
        </LocalizationProvider>
    )
}

export default RMSDatePicker;