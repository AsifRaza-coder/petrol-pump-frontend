import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Purchase Columns
export const purchaseColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "supplier",
    headerName: "Supplier Name",
    width: 230,
    renderCell: (params) => {
      const imageUrl = params.row.supplier?.pic
        ? `${DOMAIN}/public/suppliers/images/${params.row.supplier.pic}`
        : null;
      const supplierName = params.row.supplierName || params.row.supplier?.name || 'N/A';
      const displayName = supplierName.length > 20
        ? supplierName.substring(0, 20) + '...'
        : supplierName;
      
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
            alt={supplierName}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #e0e0e0',
              bgcolor: '#1976d2'
            }}
          >
            {supplierName ? supplierName.charAt(0).toUpperCase() : 'S'}
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
    field: "productName",
    headerName: "Product Name",
    width: 150,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#333'
          }}
        >
          {params.row.productName || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 120,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500
          }}
        >
          {params.row.quantity || '0'}
        </Typography>
      );
    },
  },
  {
    field: "costPrice",
    headerName: "Cost Price",
    width: 130,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500
          }}
        >
          {(params.row.costPrice || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },
  {
    field: "sellingPrice",
    headerName: "Selling Price",
    width: 130,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#1976d2',
            fontWeight: 600
          }}
        >
          {(params.row.sellingPrice || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 120,
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
    width: 100,
    renderCell: (params) => {
      const isOpen = params.row.status === "open";
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {isOpen && (
            <Tooltip title="Delete Purchase">
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
