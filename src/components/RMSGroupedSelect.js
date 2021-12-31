import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const RMSGroupedSelect = (props) => {
    return (
        <FormControl sx={{ m: 1, minWidth: 120, display: props.displayFilter}}>
            <InputLabel htmlFor="grouped-select">Pilih Blok</InputLabel>
            <Select defaultValue="" id="grouped-select" label="Grouping" onChange={(e)=>props.handleChange(e.target.value)}>
                <ListSubheader>TASBI I | A-N</ListSubheader>
                {
                    props.an.map((a) => {
                        return (
                            <MenuItem value={a.value}>{a.text}</MenuItem>
                        )
                    })
                }
                <ListSubheader>TASBI I | AA-ZZ</ListSubheader>
                {
                    props.aazz.map((a) => {
                        return (
                            <MenuItem value={a.value}>{a.text}</MenuItem>
                        )
                    })
                }
                <ListSubheader>TASBI II</ListSubheader>
                {
                    props.tasbiII.map((a) => {
                        return (
                            <MenuItem value={a.value}>{a.text}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    )
}

export default RMSGroupedSelect;