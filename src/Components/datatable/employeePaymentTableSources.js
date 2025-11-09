import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Employee Payment Columns
export const employeePaymentColumns = (
  setOpenDeleteDialog,
  setOpenDetailsDialog,
  setOpenFormDialog
) => [
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      const imageUrl = params.row.employee?.pic
        ? `${DOMAIN}/public/employees/images/${params.row.employee.pic}`
        : null;
      const employeeName = params.row.name || params.row.employee?.name || 'N/A';
      const displayName = employeeName.length > 25
        ? employeeName.substring(0, 25) + '...'
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
  {
    field: "prevAdvance",
    headerName: "Previous Advance",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.prevAdvance?.toLocaleString("en-US", {
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
    field: "amount",
    headerName: "Paid Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.amount?.toLocaleString("en-US", {
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
    field: "remaining",
    headerName: "Remaining Advance",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.remAdvance?.toLocaleString("en-US", {
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
    width: 100,
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      const isOpen = params.row.status === "open";
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="Employee Payment Details">
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
          {isOpen && (
            <>
              <Tooltip title="Edit Employee Payment">
                <IconButton
                  size="small"
                  onClick={() => {
                    setOpenFormDialog(true);
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
              <Tooltip title="Delete Employee Payment">
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
            </>
          )}
        </Box>
      );
    },
  },
];
