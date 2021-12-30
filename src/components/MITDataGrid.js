import React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  gridClasses,
} from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function MITDataGrid(props) {
  return (
    <div style={{ minHeight: 400, height: '100%', width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={props.rows}
            columns={props.columns}
            checkboxSelection={props.isCheckbox}
            onSelectionModelChange={props.selectionModelChangeAction}
            onEditRowsModelChange={props.editRowsModelChangeAction}
            components={{
              Toolbar: CustomToolbar,
            }} />
        </div>
      </div>
    </div>
  );
}

export default MITDataGrid;