import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip, Box, Typography } from "@mui/material";

// SAMPLE DATA FOR USERS
//Export Expense Columns
export const expenseColumns = (setOpenDeleteDialog, setDetailsDialog, setOpenFormDialog) => [
  {
    field: "name",
    headerName: "Expense Name",
    width: 230,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#333'
          }}
        >
          {params.row.name || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "description",
    headerName: "Description",
    width: 300,
    renderCell: (params) => {
      const description = params.row.description || 'N/A';
      const displayDescription = description.length > 40
        ? description.substring(0, 40) + '...'
        : description;
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '280px'
          }}
        >
          {displayDescription}
        </Typography>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#d32f2f',
            fontWeight: 600
          }}
        >
          {params.row.amount?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "PKR 0.00"}
        </Typography>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333'
          }}
        >
          {params.row.date || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 130,
    renderCell: (params) => {
      const isOpen = params.row.status === "open";
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {isOpen && (
            <Tooltip title="Delete Expense">
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
          )}
        </Box>
      );
    },
  },
];

