import React, { useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import md5 from 'md5';

const RMSSelect = (props) => {
    return (
        <FormControl sx={{ margin: "5px", display: props.displayFilter }}>
            <InputLabel id="demo-simple-select-helper-label">{props.label}</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={props.value}
                label={props.label}
                onChange={(event) => props.handleChange(event.target.value)}
                required={props.isRequired}
                error={props.isError}
            >
                {
                    props.items.map((item) => {
                        return (
                            <MenuItem key={md5(item.value + "," + item.text)} value={item.value}>{item.text}</MenuItem>
                        )
                    })
                }
            </Select>
            <FormHelperText>{props.helperText}</FormHelperText>
        </FormControl>
    )
}

export default RMSSelect;