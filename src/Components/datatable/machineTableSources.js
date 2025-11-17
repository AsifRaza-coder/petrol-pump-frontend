import { Delete, Edit, Lock } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

// SAMPLE DATA FOR USERS
//Export Machine Columns
export const machineColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog,
  setSelectedRowId,
  setDeleteMachineId,
  handleUnlockMachine
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.name}</div>;
    },
  },
  // { field: "email", headerName: "Email", width: 230 },
  { field: "type", headerName: "Fuel Type", width: 150 },
  { field: "prevReading", headerName: "Previous Reading", width: 150 },
  { field: "newReading", headerName: "Current Reading", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div
          style={{
            background: params.row.status.toLowerCase() === "active" ? "#02bf2e" : "#999",
            color: "white",
            width: 65,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Edit Machine">
            <IconButton
              className="viewButton"
              onClick={() => {
                setSelectedRowId(params.row.id);
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          {params.row.lockStatus === "locked" ? (
            <Tooltip title="Unlock Machine">
              <IconButton
                className="viewButton"
                onClick={() => handleUnlockMachine(params.row.id)}
              >
                <Lock style={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Delete Machine">
              <IconButton
                className="viewButton"
                onClick={() => {
                  setSelectedRowId(params.row.id);
                  setDeleteMachineId(params.row.id);
                  setOpenDeleteDialog(true);
                }}
              >
                <Delete style={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    },
  },
];
