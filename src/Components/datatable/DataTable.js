import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

const DataTable = ({ columns, footer, rows, totalRecords,selectedRowId, handleOnPageChange, currentPage, setSelectedRowId  }) => {
 
return (
<div className="h-[415px] p-5 m-0 bg-transparent rounded-lg [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar]:!h-2 hover:[&::-webkit-scrollbar-thumb]:!h-2 transition-all">
    <DataGrid
        className="!border-0 [&_.MuiDataGrid-root]:border-0 [&_.MuiDataGrid-cell]:focus:outline-none [&_.MuiDataGrid-columnHeader]:focus:outline-none [&_.MuiDataGrid-columnHeaders]:bg-gradient-to-r [&_.MuiDataGrid-columnHeaders]:from-gray-50 [&_.MuiDataGrid-columnHeaders]:to-gray-100 [&_.MuiDataGrid-columnHeader]:font-bold [&_.MuiDataGrid-columnHeader]:text-gray-800 [&_.MuiDataGrid-columnHeader]:text-sm [&_.MuiDataGrid-row:hover]:bg-gradient-to-r [&_.MuiDataGrid-row:hover]:from-blue-50 [&_.MuiDataGrid-row:hover]:to-indigo-50 [&_.MuiDataGrid-row]:border-b [&_.MuiDataGrid-row]:border-gray-100 [&_.MuiDataGrid-row]:transition-all [&_.MuiDataGrid-row]:duration-150"
        rows={rows}
        columns={columns}
        pageSize={5}
        disableColumnFilter
        rowCount={totalRecords}
        paginationMode="server"
        components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Record Available
              </Stack>
            ),
            Pagination: footer ? () => null  : undefined , // Hides the pagination component
          }}
        page={currentPage}
        onSelectionModelChange={item => setSelectedRowId(item)}
        selectionModel={selectedRowId ? [selectedRowId] : []}
        onPageChange={(e)=> {handleOnPageChange(e)}}
        rowsPerPageOptions={[5]}
        checkboxSelection={false} // Enable checkbox selection
        disableRowSelectionOnClick
    />
   
</div>
);
};

export default DataTable;
