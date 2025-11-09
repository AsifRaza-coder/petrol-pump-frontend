import { DOMAIN } from "../../backend/API";

// SVG Icons Components (using Tailwind CSS instead of MUI)
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

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

//Export Customer Payment Columns
export const customerAdvanceColumns = (
  setOpenDeleteDialog,
  setOpenDetailsDialog,
  setOpenFormDialog
) => [
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
    field: "description",
    headerName: "Description",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
          <span className="text-gray-700 text-sm font-medium">
            {params.row.description?.length > 35
              ? params.row.description.substring(0, 35) + '...'
              : params.row.description}
          </span>
        </div>
      );
    },
  },
  { 
    field: "amount", 
    headerName: "Amount", 
    width: 150,
    renderCell: (params) => {
      return (
        <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
          {params.row.amount?.toLocaleString("en-US", {
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
    field: "date",
    headerName: "Date",
    width: 150,
    renderCell: (params) => (
      <div className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
        <span className="text-gray-700 font-medium text-sm">{params.row.date}</span>
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="flex items-center gap-2">
          <button
            className="relative group text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 border-dotted rounded-lg p-2.5 transition-all duration-200 hover:shadow-md hover:border-indigo-300"
            onClick={() => setOpenDetailsDialog(true)}
            title="Customer Advance Details"
          >
            <InfoIcon />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
              Customer Advance Details
            </span>
          </button>

          {params.row.status === "open" && (
            <>
              <button
                className="relative group text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 border-dotted rounded-lg p-2.5 transition-all duration-200 hover:shadow-md hover:border-blue-300"
                onClick={() => {
                  setOpenFormDialog(true);
                }}
                title="Edit Customer Advance"
              >
                <EditIcon />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
                  Edit Customer Advance
                </span>
              </button>
              <button
                className="relative group text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 border-dotted rounded-lg p-2.5 transition-all duration-200 hover:shadow-md hover:border-red-300"
                onClick={() => setOpenDeleteDialog(true)}
                title="Delete Customer Advance"
              >
                <DeleteIcon />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
                  Delete Customer Advance
                </span>
              </button>
            </>
          )}
        </div>
      );
    },
  },
];

