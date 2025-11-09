import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Customer Columns
export const customerColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="flex items-center">
          <img
            src={
              params.row.pic
                ? `${DOMAIN}/public/customers/images/${params.row.pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="w-8 h-8 rounded-full object-cover mr-5 border-2 border-gray-200"
          />
           <span className="text-gray-800 font-medium">
            {params.row.name.length > 30
              ? params.row.name.substring(0, 30) + `....`
              : params.row.name}
          </span>
        </div>
      );
    },
  },

  {
    field: "balance",
    headerName: "Receivable",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="px-2 py-1 rounded-md text-sm font-semibold text-gray-700 bg-gray-50">
          {params.row.balance?.toLocaleString("en-US", {
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
    field: "contact", 
    headerName: "Contact", 
    width: 150,
    renderCell: (params) => (
      <span className="text-gray-600 font-medium">{params.row.contact}</span>
    )
  },
  { 
    field: "address", 
    headerName: "Address", 
    width: 200,
    renderCell: (params) => (
      <span className="text-gray-600 text-sm">
        {params.row.address?.length > 25 
          ? params.row.address.substring(0, 25) + '...'
          : params.row.address}
      </span>
    )
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      const status = params.row.status?.toLowerCase();
      const statusStyles = {
        active: "bg-green-500 text-white",
        pending: "bg-yellow-500 text-white",
        passive: "bg-red-500 text-white",
      };
      const defaultStyle = "bg-gray-500 text-white";
      
      return (
        <div
          className={`px-3 py-1 rounded-md text-xs font-semibold text-center min-w-[65px] ${
            statusStyles[status] || defaultStyle
          }`}
        >
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Customer">
            <IconButton
              className="!text-blue-600 hover:!bg-blue-50 !border !border-blue-200 !border-dotted !rounded-md"
              onClick={() => {
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Details">
            <IconButton
              className="!text-indigo-600 hover:!bg-indigo-50 !border !border-indigo-200 !border-dotted !rounded-md"
              onClick={() => setDetailsDialog(true)}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton
              className="!text-red-600 hover:!bg-red-50 !border !border-red-200 !border-dotted !rounded-md"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Delete style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </div>
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
