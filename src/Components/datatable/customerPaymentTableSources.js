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
export const customerPaymentColumns = (
  setOpenDeleteDialog,
  setOpenDetailsDialog,
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
              params.row.customer.pic
                ? `${DOMAIN}/public/customers/images/${params.row.customer.pic}`
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
    field: "prevAmount",
    headerName: "Previous Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="px-2 py-1 rounded-md text-sm font-semibold text-gray-700 bg-gray-50">
          {params.row.prevAmount?.toLocaleString("en-US", {
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
    field: "amount",
    headerName: "Paid Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="px-2 py-1 rounded-md text-sm font-semibold text-green-700 bg-green-50">
          {params.row.payingAmount?.toLocaleString("en-US", {
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
    field: "remaining",
    headerName: "Remaining Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="px-2 py-1 rounded-md text-sm font-semibold text-blue-700 bg-blue-50">
          {params.row.remAmount?.toLocaleString("en-US", {
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
      <span className="text-gray-600 font-medium">{params.row.date}</span>
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
            className="relative group text-indigo-600 hover:bg-indigo-50 border border-indigo-200 border-dotted rounded-md p-2 transition-colors duration-200"
            onClick={() => setOpenDetailsDialog(true)}
            title="Customer Payment Details"
          >
            <InfoIcon />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Customer Payment Details
            </span>
          </button>
          {params.row.status === "open" && (
            <>
              <button
                className="relative group text-blue-600 hover:bg-blue-50 border border-blue-200 border-dotted rounded-md p-2 transition-colors duration-200"
                onClick={() => {
                  setOpenFormDialog(true);
                }}
                title="Edit Customer Payment"
              >
                <EditIcon />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Edit Customer Payment
                </span>
              </button>
              <button
                className="relative group text-red-600 hover:bg-red-50 border border-red-200 border-dotted rounded-md p-2 transition-colors duration-200"
                onClick={() => setOpenDeleteDialog(true)}
                title="Delete Customer Payment"
              >
                <DeleteIcon />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Delete Customer Payment
                </span>
              </button>
            </>
          )}
        </div>
      );
    },
  },
];
