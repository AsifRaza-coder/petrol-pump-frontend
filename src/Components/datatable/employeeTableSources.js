import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

// SAMPLE DATA FOR USERS
//Export Employee Columns
export const employeeColumns = (setOpenDeleteDialog, setOpenDetailsDialog, setOpenFormDialog) => [
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      const imageUrl = params.row.pic
        ? `${DOMAIN}/public/employees/images/${params.row.pic}`
        : null;
      const employeeName = params.row.name || 'N/A';
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
              maxWidth: '170px'
            }}
          >
            {displayName}
          </Typography>
        </Box>
      );
    },
  },
  // { field: "email", headerName: "Email", width: 230 },
  {
    field: "salary", headerName: "Salary", width: 150, renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.salary}`}>
          {params.row.salary?.toLocaleString("en-US", {
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
    field: "remainingAdvance", headerName: "Remaining Advance", width: 150, renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.advance}`}>
          {params.row.advance?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0}
        </div>
      );
    },
  },
  { field: "contact", headerName: "Contact", width: 130 },
  { field: "designation", headerName: "Designation", width: 130 },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    renderCell: (params) => {
      const isActive = params.row.status === "Active" || params.row.status === "active";
      return (
        <Box
          sx={{
            background: isActive ? "#02bf2e" : "#777",
            color: "white",
            px: 1.5,
            py: 0.5,
            textAlign: "center",
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-block',
            minWidth: 65
          }}
        >
          {params.row.status || 'N/A'}
        </Box>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="Edit Employee">
            <IconButton
              size="small"
              onClick={() => {
                setOpenFormDialog(true)
              }}
              sx={{
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Employee Details">
            <IconButton 
              size="small"
              onClick={() => setOpenDetailsDialog(true)}
              sx={{
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Employee">
            <IconButton
              size="small"
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                color: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#ffebee'
                }
              }}
            >
              <Delete style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
];

