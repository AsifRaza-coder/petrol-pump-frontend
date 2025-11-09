import { Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip, Avatar, Box, Typography, Chip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

// SAMPLE DATA FOR USERS
//Export User Columns
export const userColumns = (
  setOpenFormDialog,
  setDetailsDialog,
  setOpenDeleteDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      const imageUrl = params.row.pic
        ? `${DOMAIN}/public/users/images/${params.row.pic}`
        : null;
      const userName = params.row.name || 'N/A';
      const displayName = userName.length > 25
        ? userName.substring(0, 25) + '...'
        : userName;
      
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
            alt={userName}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #e0e0e0',
              bgcolor: '#1976d2'
            }}
          >
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
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
    field: "email",
    headerName: "Email",
    width: 230,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '210px'
          }}
        >
          {params.row.email || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "contact",
    headerName: "Contact",
    width: 150,
    renderCell: (params) => {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#333'
          }}
        >
          {params.row.contact || 'N/A'}
        </Typography>
      );
    },
  },
  {
    field: "access",
    headerName: "Role",
    width: 120,
    renderCell: (params) => {
      const role = params.row.access || 'N/A';
      const roleColors = {
        'admin': { bg: '#1976d2', color: '#fff' },
        'tenant_admin': { bg: '#9c27b0', color: '#fff' },
        'cashier': { bg: '#f57c00', color: '#fff' },
      };
      const roleColor = roleColors[role?.toLowerCase()] || { bg: '#666', color: '#fff' };
      
      return (
        <Chip
          label={role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          size="small"
          sx={{
            backgroundColor: roleColor.bg,
            color: roleColor.color,
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24
          }}
        />
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
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
          <Tooltip title="Edit User">
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

          <Tooltip title="User Details">
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
//DATA TABLE FORMATE FOR TENANTS
export const tenantsRows = [
  {
    id: 1,
    name: "Kashif Hussain",
    image: "img/blackberry.png",
    email: "kashif@gmail.com",
    tenantName: "Saimon Technologies",
    contact: "0302-2365926",
    address: "Qaim colony Naushahro feroze",
  },
  {
    id: 2,
    name: "Kashif Hussain",
    image: "img/blackberry.png",
    // username: "kashif",
    email: "kashif@gmail.com",
    tenantName: "Saimon Technologies",
    contact: "0302-2365926",
    address: "Qaim colony Naushahro feroze",
  },
];
