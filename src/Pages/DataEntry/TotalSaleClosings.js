import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Dialogue from "../../Components/dialogue/Dialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { Assessment, PendingActions } from "@mui/icons-material";
// import "./sales.scss";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
// import { getMachines } from "../../redux/machineSlice/machineSlice";
import { searchInput } from "../../Components/sources/formSources";
// import { salesColumns } from "../../Components/datatable/salesTableSources";
import {
  // clearSales,
  // deleteSale,
  getSingleSale,
} from "../../redux/saleSlice/saleSlice";
import SaleDetails from "../Customer/SaleDetails";
import { searchSalesFilters } from "../../Components/sources/salesFormSources";
import { salesClosingsColumns } from "../../Components/datatable/salesClosingsTableSources";
import {
  clearClosings,
  deleteClosing,
  getPrintClosingReport,
  getSaleClosings,
} from "../../redux/closingsSlice/closingsSlice";
import AuthContext from "../../context/auth/AuthContext";
import { DOMAIN } from "../../backend/API";

const TotalSaleClosings = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Call Auth Context & Extract Logout
  const { user } = useContext(AuthContext);
  //Initializing useSelector to get data from redux store
  const closings = useSelector((state) => state.closings.data);
  //Initializing the current machine
  const currentData = useSelector((state) => state.sales.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.closings.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.sales.errors);
  //Use State for Handle Open and close of form dialog
  const [openFormDialog] = useState(false);
  // const [openFormDialog, setOpenFormDialog] = useState(false);
  //Use State for handle Open and close of Details Dialog
  const [openDetailsDialog, setDetailsDialog] = useState(false);
  //Use State for Handle Open and close of dialog box
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  //Use State for selected row item id
  const [selectedRowId, setSelectedRowId] = useState(null);
  //Use State for manage pages
  const [currentPage, setCurrentPage] = useState(0);
  //Setup use state for search filters
  const [filters, setFilter] = useState({
    field: "",
    operator: "",
    sort: -1,
  });
  //Use State for search inputs
  const [search, setSearch] = useState({
    searchInput: "",
    startDate: "",
    endDate: "",
  });
  //Setup state for values
  // const [state, setState] = useState({
  const [, setState] = useState({
    name: "",
    type: "",
    initialReading: "",
    currentReading: "",
    status: "",
  });

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Customer API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current supplier
      dispatch(getSingleSale(selectedRowId[0]));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  console.log("Checking the search State ", search);
  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        name: currentData.name,
        type: currentData.type,
        initialReading: currentData.initialReading,
        currentReading: currentData.currentReading,
        status: currentData.status,
      });
    }
  }, [currentData]);

  //useEffect to dispatch all machines
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getMachines using dispatch
    // dispatch(getMachines(initialData));
    dispatch(getSaleClosings(initialData));

    //Call clear machines to clear machines from state on unmount
    return () => {
      dispatch(clearClosings());
    };
    //eslint-disable-next-line
  }, []);

  //useEffect to handle the dates filter
  useEffect(() => {
    if (filters.field === "date") {
      setFilter({ ...filters, operator: "inBetween" });
    } else {
      if (filters.operator === "inBetween") {
        setFilter({ ...filters, operator: "$regex" });
      }
    }
    // eslint-disable-next-line
  }, [filters.field]);

  //useEffect to Iterate submit Errors
  useEffect(() => {
    if (submitErrors?.length > 0) {
      //iterate submit errors
      submitErrors.forEach((item) => {
        toast(item.msg, { position: "top-right", type: "error" });
      });
    }
    // else {
    //   // handleOnFormDialogClose();
    // }
  }, [submitErrors]);

  //Handle Delete Sale func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteClosing(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Handle Print Sale func
  const handlePrint = async (id) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast("Please allow pop-ups to view the report.", {
        position: "top-right",
        type: "warning",
      });
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Generating Report...</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f0f4ff, #e0ecff);
              color: #1f2937;
            }
            .message {
              text-align: center;
            }
            h1 {
              font-size: 22px;
              margin-bottom: 12px;
            }
            p {
              margin: 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h1>Generating report...</h1>
            <p>Please wait while we prepare your closing report.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    try {
      // Show loading state
      const loadingInterval = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(loadingInterval);
          return;
        }
        const dots = printWindow.document.querySelector('.dots') || printWindow.document.createElement('span');
        dots.className = 'dots';
        dots.textContent = '.'.repeat((Math.floor(Date.now() / 500) % 4));
        if (!printWindow.document.querySelector('.dots')) {
          const message = printWindow.document.querySelector('.message p');
          if (message) {
            message.appendChild(dots);
          }
        }
      }, 500);

      const response = await dispatch(getPrintClosingReport(id)).unwrap();
      clearInterval(loadingInterval);
      console.log("Print response:", response);
      
      if (response?.success && response?.url) {
        // Add a small delay to ensure PDF is ready
        setTimeout(() => {
          printWindow.location.href = `${DOMAIN}${response.url}`;
        }, 500);
      } else {
        // Handle error response
        const errorMsg = 
          (response?.errors && Array.isArray(response.errors) && response.errors[0]?.msg) ||
          response?.msg || 
          "Unable to generate report. Please try again later.";
        
        printWindow.document.body.innerHTML = `
          <div style='font-family: Arial, sans-serif; text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #fef2f2, #fee2e2);'>
            <div style='background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;'>
              <p style='color: #dc2626; font-size: 18px; font-weight: bold; margin-bottom: 12px;'>Unable to generate report</p>
              <p style='color: #666; font-size: 14px; margin-bottom: 20px;'>${errorMsg}</p>
              <button onclick='window.close()' style='padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;'>Close</button>
            </div>
          </div>
        `;
        toast(errorMsg, { position: "top-right", type: "error" });
      }
    } catch (error) {
      console.error("Print error:", error);
      console.error("Error details:", error);
      
      // Safely extract error message
      let errorMsg = "An error occurred while generating the report.";
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors[0]?.msg) {
          errorMsg = errorData.errors[0].msg;
        } else if (errorData.msg) {
          errorMsg = errorData.msg;
        } else if (errorData.error && Array.isArray(errorData.error) && errorData.error[0]?.msg) {
          errorMsg = errorData.error[0].msg;
        }
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      printWindow.document.body.innerHTML = `
        <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
          <p style='color: #dc2626; font-size: 16px; margin-bottom: 10px;'>Error generating report</p>
          <p style='color: #666; font-size: 14px;'>${errorMsg}</p>
          <p style='color: #999; font-size: 12px; margin-top: 20px;'>Please check your connection and try again.</p>
        </div>
      `;
      toast(errorMsg, { position: "top-right", type: "error" });
    }
  };
  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getSaleClosings using dispatch
    dispatch(getSaleClosings(initialData));
  };
  //Handle On submit
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    //Destructuring values from state
    const { startDate, endDate, searchInput } = search;
    //Destructuring values from filters
    const { field, operator, sort } = filters;
    //Organizing data from filters and search Input
    let newState = {
      field: field === "" ? undefined : field,
      operator: operator,
      sort: sort,
      page: 0,
      searchInput: searchInput,
      startDate: endDate !== "" && startDate === "" ? endDate : startDate,
      endDate: endDate === "" && startDate !== "" ? startDate : endDate,
    };
    if (field === "date") {
      if (startDate === "" && endDate === "") {
        toast("Please Select Date", { position: "top-right", type: "error" });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getSaleClosings(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getSaleClosings(newState));
      //After search results close the filters panel
      setOpenFiltersPanel(!openFiltersPanel);
      //Set Page to Zero
      setCurrentPage(0);
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else if (field !== "" && searchInput !== "" && operator === "") {
        toast("Please select condition", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getSaleClosings(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    }
  };

  //Handle on Page Change
  const handleOnPageChange = (e) => {
    //Setting pagination
    setCurrentPage(e);
    //Destructuring values from state
    const { startDate, endDate, searchInput } = search;
    //Destructuring values from filters
    const { field, operator, sort } = filters;
    //Organizing data from filters and search Input
    let newState = {
      field: field === "" ? "" : field,
      operator: operator,
      sort: sort,
      page: e,
      searchInput: searchInput,
      startDate: endDate !== "" && startDate === "" ? endDate : startDate,
      endDate: endDate === "" && startDate !== "" ? startDate : endDate,
    };

    if (field === "date") {
      if (startDate === "" && endDate === "") {
        toast("Please Select Date", { position: "top-right", type: "error" });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getSaleClosings(newState));
      }
    } else if (field === "") {
      dispatch(getSaleClosings(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getSaleClosings(newState));
      }
    }
  };
  // Function for Capitalizing the data
  // function capitalizeEachWord(sentence) {
  //   return sentence
  //     .split(" ")
  //     .map((word) => {
  //       return word.charAt(0).toUpperCase() + word.slice(1);
  //     })
  //     .join(" ");
  // }

  function calculateTotalAndDiscount(items) {
    let totalAmount = 0;
    let totalDiscount = 0;

    items?.forEach((item) => {
      totalAmount += item.quantity * item.price.newSellingPrice;
      totalDiscount +=
        (item.price.newSellingPrice / 100) * item.discount * item.quantity;
    });

    return { totalAmount, totalDiscount };
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows =
    closings.length > 0
      ? closings.map((row) => ({
          ...row,
          totalAmount:
            row.items && calculateTotalAndDiscount(row.items).totalAmount,
          totalDiscount:
            row.items && calculateTotalAndDiscount(row.items).totalDiscount,
          product: row.items,
        }))
      : [];

  const handleOnCloseDetails = () => {
    setDetailsDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Enhanced Styling */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-md">
                <PendingActions sx={{ fontSize: 28, color: "white" }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  Shift Closings
                </h1>
                <p className="text-gray-600 text-sm font-medium">
                  Manage Application Sale Closings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card with Modern Design */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Employee Details Dialog box  */}
          <SaleDetails
            openDetailsDialog={openDetailsDialog}
            heading={
              Object.keys(currentData).length !== 0
                ? `Sales Detail of ${currentData.customer.name}`
                : "Sale Details"
            }
            inputs={Object.keys(currentData).length !== 0 && currentData}
            icon={<Assessment style={{ marginRight: "10px" }} />}
            handleOnCloseDetails={handleOnCloseDetails}
          />
          
          {/* Delete Content Dialog box  */}
          <Dialogue
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
            handleOnDelete={handleOnDelete}
            heading={"DELETE SALE"}
            color="#ff0000"
            icon={<DangerousIcon style={{ marginRight: "10px" }} />}
            message={"Are sure you want to delete Sale?."}
          />

          {/* Search Component */}
          <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <Search
              submit={handleOnSubmit}
              filters={filters}
              setFilter={setFilter}
              state={search}
              setState={setSearch}
              openFiltersPanel={openFiltersPanel}
              setOpenFiltersPanel={setOpenFiltersPanel}
              loadDataFunc={loadData}
              searchFiltersForm={searchSalesFilters}
              searchInputForm={searchInput}
            />
          </div>

          {/* DataTable with Enhanced Styling */}
          <div className="p-6">
            <DataTable
              columns={salesClosingsColumns(
                setOpenDeleteDialog,
                setDetailsDialog,
                handlePrint,
                user,
                setSelectedRowId
              )}
              rows={capitalizedRows}
              currentPage={currentPage}
              totalRecords={totalRecords}
              selectedRowId={selectedRowId}
              setSelectedRowId={setSelectedRowId}
              handleOnPageChange={handleOnPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSaleClosings;
