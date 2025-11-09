import { Delete, Info } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Price Columns
export const priceColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params) => {
      const imageUrl = params.row.product?.pic
        ? `${DOMAIN}/public/products/images/${params.row.product.pic}`
        : null;
      const productName = params.row.product?.name || 'N/A';
      const displayName = productName.length > 20
        ? productName.substring(0, 20) + '...'
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
              maxWidth: '140px'
            }}
          >
            {displayName}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "costPrice",
    headerName: "Cost Price",
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
    field: "oldSellingPrice",
    headerName: "Old Selling Price",
    width: 140,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontWeight: 400
          }}
        >
          {(params.row.oldSellingPrice || 0).toLocaleString("en-US", {
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
    field: "newSellingPrice",
    headerName: "Selling Price",
    width: 120,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#1976d2',
            fontWeight: 600
          }}
        >
          {(params.row.newSellingPrice || 0).toLocaleString("en-US", {
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
    field: "differenceValue",
    headerName: "Difference Amount",
    width: 170,
    renderCell: (params) => {
      const diffValue = params.row.differenceValue || 0;
      const isPositive = diffValue > 0;
      return (
        <Typography
          variant="body2"
          sx={{
            color: isPositive ? '#2e7d32' : diffValue < 0 ? '#d32f2f' : '#666',
            fontWeight: 600
          }}
        >
          {diffValue.toLocaleString("en-US", {
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
    width: 110,
    renderCell: (params) => {
      const isOpen = params.row?.status === "open";
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="Price Details">
            <IconButton
              size="small"
              onClick={() => setDetailsDialog(true)}
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
            <Tooltip title="Delete Price">
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
