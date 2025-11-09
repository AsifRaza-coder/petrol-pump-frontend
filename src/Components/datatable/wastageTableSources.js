import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export wastage Columns
export const wastageColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 300,
    renderCell: (params) => {
      const imageUrl = params.row.product?.pic
        ? `${DOMAIN}/public/products/images/${params.row.product.pic}`
        : null;
      const productName = params.row.product?.name || params.row.productName || 'N/A';
      const displayName = productName.length > 25
        ? productName.substring(0, 25) + '...'
        : productName;
      
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
            alt={productName}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #e0e0e0',
              bgcolor: '#1976d2'
            }}
          >
            {productName ? productName.charAt(0).toUpperCase() : 'P'}
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
    field: "quantity",
    headerName: "Quantity",
    width: 250,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#d32f2f',
            fontWeight: 600
          }}
        >
          {params.row.quantity || '0'}
        </Typography>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 250,
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
            <Tooltip title="Delete Wastage">
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
