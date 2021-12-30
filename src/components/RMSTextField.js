import React from "react";
import { FormControl, FormHelperText, TextField } from "@mui/material";

const RMSTextField = (props) => {
    return (
        <FormControl sx={{display:props.displayFilter,margin:"5px"}}>
            <TextField id="outlined-basic" label={props.label} variant="outlined" type={props.type === null || props.type === undefined || props.type.length == 0 ? "text" : props.type} onChange={(e)=>props.handleChange(e.target.value)} value={props.value} required={props.isRequired} error={props.isError}/>
            <FormHelperText>{props.helperText}</FormHelperText>
        </FormControl>
    )
}

export default RMSTextField;