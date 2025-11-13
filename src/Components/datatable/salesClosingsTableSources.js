import { Delete, NoEncryption, Print } from "@mui/icons-material";
import { IconButton, Tooltip, Chip, Avatar } from "@mui/material";
import { DOMAIN } from "../../backend/API";
import LockIcon from "@mui/icons-material/Lock";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

//Export sales Columns
export const salesClosingsColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  handlePrint,
  user,
  setSelectedRowId
) => [
  {
    field: "name",
    headerName: "Cashier Name",
    width: 280,
    renderCell: (params) => {
      const cashierName = params.row.cashier?.name || "N/A";
      const displayName = cashierName.length > 15 
        ? cashierName.substring(0, 15) + "..." 
        : cashierName;
      
      return (
        <div className="flex items-center gap-3 py-2">
          <Avatar
            src={
              params.row.cashier?.pic
                ? `${DOMAIN}/public/users/images/${params.row.cashier.pic}`
                : "./img/avatarfile.png"
            }
            alt={cashierName}
            sx={{
              width: 42,
              height: 42,
              border: "2px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <span className="font-medium text-gray-800 text-sm">
            {displayName}
          </span>
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 200,
    renderCell: (params) => {
      const formattedDate = formatDate(params.row.date);
      return (
        <div className="flex items-center gap-2 py-2">
          <CalendarTodayIcon 
            sx={{ 
              fontSize: 16, 
              color: "#6b7280",
              marginRight: "4px"
            }} 
          />
          <span className="text-gray-700 font-medium text-sm">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    renderCell: (params) => {
      const isOpen = params.row.status === "open";
      return (
        <Chip
          icon={
            isOpen ? (
              <NoEncryption sx={{ fontSize: 16, color: "inherit" }} />
            ) : (
              <LockIcon sx={{ fontSize: 16, color: "inherit" }} />
            )
          }
          label={params.row.status?.charAt(0).toUpperCase() + params.row.status?.slice(1)}
          sx={{
            backgroundColor: isOpen ? "#10b981" : "#6b7280",
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
            height: "28px",
            "& .MuiChip-icon": {
              color: "white",
            },
            boxShadow: isOpen 
              ? "0 2px 8px rgba(16, 185, 129, 0.3)" 
              : "0 2px 8px rgba(107, 114, 128, 0.2)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: isOpen 
                ? "0 4px 12px rgba(16, 185, 129, 0.4)" 
                : "0 4px 12px rgba(107, 114, 128, 0.3)",
            },
          }}
        />
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 180,
    renderCell: (params) => {
      return (
        <div className="flex items-center gap-2">
          <Tooltip title="Print Report">
            <IconButton
              className="viewButton"
              onClick={(event) => {
                event.stopPropagation();
                handlePrint(params.row._id);
              }}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
                "&:focus": {
                  outline: "none",
                  border: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                  border: "none",
                },
              }}
            >
              <Print style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          {params.row.status === "open" && user.access === "web_admin" && (
            <Tooltip title="Delete Closing" arrow>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  if (setSelectedRowId) {
                    setSelectedRowId([params.row._id]);
                  }
                  setOpenDeleteDialog(true);
                }}
                sx={{
                  backgroundColor: "",
                  color: "gray",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    backgroundColor: "",
                    transform: "scale(1.05)",
                  },
                  "&:focus": {
                    outline: "none",
                    border: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    border: "none",
                  },
                  transition: "all 0.2s ease",
                  // boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
                }}
              >
                <Delete sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    },
  },
];
