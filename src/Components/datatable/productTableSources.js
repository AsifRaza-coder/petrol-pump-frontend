import { Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Product Columns
export const productColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      const imageUrl = params.row.pic
        ? `${DOMAIN}/public/products/images/${params.row.pic}`
        : null;
      const productName = params.row.name || 'N/A';
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
    field: "type",
    headerName: "Type",
    width: 100,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500,
            textTransform: 'capitalize'
          }}
        >
          {params.row.type || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "costPrice",
    headerName: "Cost Price",
    width: 150,
    renderCell: (params) => {
      const costPrice = params.row.prices?.costPrice;
      return (
        <Typography
          variant="body2"
          sx={{
            color: costPrice ? '#333' : '#999',
            fontWeight: costPrice ? 500 : 400
          }}
        >
          {costPrice
            ? costPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "—"}
        </Typography>
      );
    },
  },
  {
    field: "sellingPrice",
    headerName: "Selling Price",
    width: 140,
    renderCell: (params) => {
      const sellingPrice = params.row.prices?.newSellingPrice;
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500
          }}
        >
          {(sellingPrice || 0).toLocaleString("en-US", {
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
    headerName: "Last Updated",
    width: 120,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333'
          }}
        >
          {params.row.prices?.date || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    renderCell: (params) => {
      const isActive = params.row.status?.toLowerCase() === "active";
      return (
        <Box
          sx={{
            background: isActive ? "#02bf2e" : "#999",
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
          <Tooltip title="Edit Product">
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

          <Tooltip title="Product Details">
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
        </Box>
      );
    },
  },
];
