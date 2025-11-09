import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Employee Payment Columns
export const employeeSalaryColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  {
    field: "name",
    headerName: "Name",
    width: 300,
    renderCell: (params) => {
      const imageUrl = params.row.employee?.pic
        ? `${DOMAIN}/public/employees/images/${params.row.employee.pic}`
        : null;
      const employeeName = params.row.name || params.row.employee?.name || 'N/A';
      const displayName = employeeName.length > 20
        ? employeeName.substring(0, 20) + '...'
        : employeeName;
      
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%'
          }}
        >
          <Avatar
            src={imageUrl}
            alt={employeeName}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #e0e0e0',
              bgcolor: '#1976d2'
            }}
          >
            {employeeName ? employeeName.charAt(0).toUpperCase() : 'E'}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: '#333',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '240px'
            }}
          >
            {displayName}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "netSalary",
    headerName: "Net Salary",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.netSalary?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
  },
  {
    field: "salaryOfMonth",
    headerName: "Month of",
    width: 130,
  },
  {
    field: "salaryOfYear",
    headerName: "Year",
    width: 120,
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Delete Employee Salary">
            <IconButton
              className="viewButton"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Delete style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  },
];
