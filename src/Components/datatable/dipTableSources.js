import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip, Box, Typography } from "@mui/material";

//Export dips Columns
export const dipColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    renderCell: (params) => {
      const productName = params.row.product?.name || params.row.productName || 'N/A';
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#333'
          }}
        >
          {productName}
        </Typography>
      );
    },
  },
  {
    field: "prevDip",
    headerName: "Last Dip",
    width: 80,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontWeight: 400
          }}
        >
          {params.row.prevDip || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "prevStock",
    headerName: "Last Stock",
    width: 150,
    renderCell: (params) => {
      const prevStock = params.row.prevStock;
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontWeight: 400
          }}
        >
          {prevStock ? parseFloat(prevStock).toFixed(2) : '0.00'}
        </Typography>
      );
    },
  },
  {
    field: "dip",
    headerName: "Dip Reading",
    width: 100,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#1976d2',
            fontWeight: 600
          }}
        >
          {params.row.dip || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "stock",
    headerName: "Stock",
    width: 150,
    renderCell: (params) => {
      const stock = params.row.stock;
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500
          }}
        >
          {stock ? parseFloat(stock).toFixed(2) : '0.00'}
        </Typography>
      );
    },
  },
  {
    field: "stockDiff",
    headerName: "Stock Diff:",
    width: 100,
    renderCell: (params) => {
      const stockDiff = params.row.stockDiff !== undefined && params.row.stockDiff !== null ? params.row.stockDiff : 0;
      const isPositive = stockDiff > 0;
      const isNegative = stockDiff < 0;
      return (
        <Typography
          variant="body2"
          sx={{
            color: isPositive ? '#2e7d32' : isNegative ? '#d32f2f' : '#666',
            fontWeight: 600
          }}
        >
          {!isNaN(stockDiff) ? parseFloat(stockDiff).toFixed(2) : '0.00'}
        </Typography>
      );
    },
  },
  {
    field: "gain",
    headerName: "Gain",
    width: 100,
    renderCell: (params) => {
      const gain = params.row.gain || 0;
      return (
        <Typography
          variant="body2"
          sx={{
            color: gain > 0 ? '#2e7d32' : '#666',
            fontWeight: 500
          }}
        >
          {gain || '0'}
        </Typography>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 130,
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
    width: 160,
    renderCell: (params) => {
      const isOpen = params.row.status === "open";
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {isOpen && (
            <Tooltip title="Delete Dip Reading">
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
