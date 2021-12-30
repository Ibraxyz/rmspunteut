import React from 'react';
import { Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RMSTextField from "../components/RMSTextField";
import RMSSelect from './RMSSelect';
import RMSDatePicker from './RMSDatePicker';

const RMSEditData = (props) => {
    return (
        <>
            <Dialog open={props.isOpen}>
                <DialogTitle>Edit Data</DialogTitle>
                <Divider />
                <DialogContent ref={null}>
                    <Stack spacing={1} direction={"column"}>
                        {
                            props.inputs.length === 0 ? "" : props.inputs[0].map((ip) => {
                                if (ip.type === 'text') {
                                    return (
                                        <RMSTextField isError={ip['isError']()} isRequired={ip['isRequired']} displayFilter={"default"} label={ip['text']} helperText={ip['helperText']} value={ip['propertyValue']} handleChange={(value) => { ip.handleChange(value) }} />
                                    )
                                } else if (ip.type === 'select') {
                                    return (
                                        <RMSSelect isError={ip['isError']()} items={ip['items']} isRequired={ip['isRequired']} displayFilter={"default"} label={ip['text']} helperText={ip['helperText']} value={ip['propertyValue']} handleChange={(value) => { ip.handleChange(value) }} />
                                    )
                                } else if (ip.type === 'date') {
                                    return (
                                        <RMSDatePicker isError={ip['isError']()} isRequired={ip['isRequired']} displayFilter={"default"} label={ip['text']} helperText={ip['helperText']} value={ip['propertyValue']} handleChange={(value) => { ip.handleChange(value) }} />
                                    )
                                }
                            })
                        }
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Stack direction="column" spacing={1} sx={{ width: '100%' }} >
                        <Button startIcon={<RotateLeftIcon />} onClick={props.resetEdit} variant="outlined" disabled={false}>Reset</Button>
                        <Button startIcon={<CancelIcon />} onClick={props.cancelEdit} variant="outlined" disabled={false}>Batal</Button>
                        <Button startIcon={<CheckIcon />} onClick={props.updateData} variant="contained" disabled={false}>Update</Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default RMSEditData;
