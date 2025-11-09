import { DOMAIN } from "../../backend/API";

// SVG Icons Components (using Tailwind CSS instead of MUI)
const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

//Export sales Columns
export const salesColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "date",
    headerName: "Date",
    width: 100,
    renderCell: (params) => (
      <div className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
        <span className="text-gray-700 font-medium text-sm">{params.row.date}</span>
      </div>
    ),
  },
  { 
    field: "receiptNo", 
    headerName: "Receipt No", 
    width: 90,
    renderCell: (params) => (
      <span className="text-gray-800 font-semibold text-sm">{params.row.receiptNo}</span>
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                params.row.pic
                  ? `${DOMAIN}/public/customers/images/${params.row.pic}`
                  : "./img/avatarfile.png"
              }
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm ring-2 ring-gray-100"
            />
          </div>
          <span className="text-gray-800 font-semibold text-sm">
            {params.row.name.length > 30
              ? params.row.name.substring(0, 30) + `....`
              : params.row.name}
          </span>
        </div>
      );
    },
  },
  {
    field: "product",
    headerName: "Products Info",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="w-full">
          {params.row.items?.length > 0 ? (
            <div className="flex flex-col gap-1">
              {params.row.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="px-2 py-1 rounded-md bg-purple-50 border border-purple-100 text-gray-700 text-xs font-medium"
                >
                  {item?.productName || 'N/A'}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">No products</span>
          )}
        </div>
      );
    },
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm">
          {params.row.totalAmount?.toLocaleString("en-US", {
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
    field: "action",
    headerName: "Action",
    width: 90,
    renderCell: (params) => {
      return (
        <div className="flex items-center gap-2">
          <button
            className="relative group text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 border-dotted rounded-lg p-2.5 transition-all duration-200 hover:shadow-md hover:border-indigo-300"
            onClick={() => setDetailsDialog(true)}
            title="Customer Sale Details"
          >
            <InfoIcon />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
              Customer Sale Details
            </span>
          </button>
          {params.row.status === "open" && (
            <button
              className="relative group text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 border-dotted rounded-lg p-2.5 transition-all duration-200 hover:shadow-md hover:border-red-300"
              onClick={() => setOpenDeleteDialog(true)}
              title="Delete Customer Sale"
            >
              <DeleteIcon />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
                Delete Customer Sale
              </span>
            </button>
          )}
        </div>
      );
    },
  },
];
