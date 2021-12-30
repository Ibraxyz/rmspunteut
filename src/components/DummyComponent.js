import React from "react";
import { Paper } from "@mui/material";

const DummyComponent = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            <Paper sx={{ padding: "10px" }}>
                {props.text}
            </Paper>
        </div>
    )
})


export default DummyComponent;