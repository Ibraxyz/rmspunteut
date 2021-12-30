import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const RMSSwitch = (props) => {
    const { label } = props;
    return (
        <FormGroup>
            <FormControlLabel control={<Switch onChange={(e) => props.handleChange(e.target.checked)} />} label={label} />
        </FormGroup>
    );
}

export default RMSSwitch;