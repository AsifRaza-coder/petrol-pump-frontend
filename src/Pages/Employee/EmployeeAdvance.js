// import "./customer.scss";
import { Box, Typography, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  Assessment,
  AssignmentInd,
  AttachMoney,
  // CurrencyExchangeRounded,
  SwitchAccount,
  AccountBalanceWallet,
} from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";

import { searchCustomerInput } from "../../Components/sources/customersFormSources";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
// import { getCustomerPayments } from "../../redux/customerPaymentSlice/customerPaymentSlice";
import { searchCustomerPaymentFilters } from "../../Components/sources/customerPaymentsFormSources";
// import {
//   deleteSupplierPayment,
//   getSingleSupplierPayment,
//   getSupplierPayments,
// } from "../../redux/supplierPaymentSlice/supplierPaymentSlice";
// import {
//   addEmployeeSalary,
//   getEmployeeSalaries,
//   updateEmployeeSalary,
// } from "../../redux/employeeSalarySlice/employeeSalarySlice";
import { clearEmployeeSalaries } from "../../redux/employeeSalarySlice/employeeSalarySlice";
// import { getEmployees } from "../../redux/employeeSlice/employeeSlice";
// import dayjs from "dayjs";
import { employeeAdvanceColumns } from "../../Components/datatable/employeeAdvanceTableSources";
import { employeeAdvanceInputFields } from "../../Components/sources/employeeAdvanceFormSources";
import {
  // addAdvanceInstallment,
  addEmployeeAdvance,
  clearCurrentEmployeeAdvance,
  deleteEmployeeAdvance,
  getEmployeeAdvances,
  getSingleEmployeeAdvance,
} from "../../redux/employeeAdvanceSlice/employeeAdvanceSlice";
// import { advanceInstallmentsInputFields } from "../../Components/sources/AdvanceInstallmentFormSources";
import {
  getAllActiveAdvances,
  getAllEmployees,
} from "../../redux/completeDataSlice/completeDataSlice";
// import AdvanceDetails from "./AdvanceDetails";
import AuthContext from "../../context/auth/AuthContext";

const EmployeeAdvance = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();

  //Use Auth Context get user
  const { user } = useContext(AuthContext);
  //Initializing useSelector to get data from redux store
  const allActiveEmployees = useSelector(
    (state) => state.completeData.employees
  );
  // const allActiveAdvances = useSelector((state) => state.completeData.advances);
  const advances = useSelector((state) => state.advances.data);
  //Initializing the current customer
  const currentData = useSelector((state) => state.advances.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.advances.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.advances.errors);
  //Use State for Handle Open and close of form dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);

  //Use State for handle Open and close of Details Dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
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
  const [state, setState] = useState({
    userId: user._id,
    employeeId: "",
    description: "",
    amount: 0,
    date: "",
  });

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Supplier API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current supplier
      dispatch(getSingleEmployeeAdvance(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        supplierId: currentData.supplierId,
        amount: currentData.amount,
        date: currentData.date,
      });
    }
  }, [currentData]);

  //useEffect to dispatch all customers
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getEmployees using dispatch
    dispatch(getAllEmployees());
    dispatch(getAllActiveAdvances());
    dispatch(getEmployeeAdvances(initialData));

    //Call clear employee payments to clear employee payments from state on unmount
    return () => {
      dispatch(clearEmployeeSalaries());
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
    } else {
      handleOnFormDialogClose();
    }
  }, [submitErrors]);

  //Handle Delete Tenant func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteEmployeeAdvance(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getSuppliers Payments using dispatch
    dispatch(getEmployeeAdvances(initialData));
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
        dispatch(getEmployeeAdvances(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getEmployeeAdvances(newState));
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
        console.log("New State => ", newState);
        //Calling dispatch function to hit API Call
        dispatch(getEmployeeAdvances(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    }
  };

  //Handle On Form Dialog Close
  const handleOnFormDialogClose = () => {
    //Close Form Dialog
    setOpenFormDialog(false);

    //Clear selected Row Id
    setSelectedRowId(null);
    //Clear State and remove previous data
    setState({
      userId: user._id,
      employeeId: "",
      description: "",
      amount: 0,
      date: "",
    });
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
        dispatch(getEmployeeAdvances(newState));
      }
    } else if (field === "") {
      dispatch(getEmployeeAdvances(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getEmployeeAdvances(newState));
      }
    }
  };
  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    return sentence
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows = advances.map((row) => ({
    ...row,
    name: row.employee.name && capitalizeEachWord(row.employee.name),
    remaining: row.employee.balance ? row.employee.balance : 0,
  }));

  //Destructure values from the state
  const { employeeId, amount, date } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (employeeId === "") {
      toast("Select employee first ", {
        position: "top-right",
        type: "error",
      });
    } else if (amount === "" || amount === 0) {
      toast("Please amount given as advance", {
        position: "top-right",
        type: "error",
      });
    } else if (date === "") {
      toast("Select date", { position: "top-right", type: "error" });
    } else {
      //Check for image uploaded

      //Hit API Call using dispatch to add employee salar
      dispatch(addEmployeeAdvance(state));
    }
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh',
        m: 0
      }}
    >
      {/* Modern Header Section */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: 32 }} />
              Employee Advance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage Employee Advances
            </Typography>
          </Box>
          <Box>
            <Header
              icon={<AttachMoney style={{ marginRight: "10px" }} />}
              title=""
              subTitle=""
              addBtnTitle="Add Advance"
              dialog={openFormDialog}
              setDialog={setOpenFormDialog}
            />
          </Box>
        </Box>
      </Box>

      {/* Main Card for setup Employee Advances Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Employee Advance Details Dialog box  */}
        {Object.keys(currentData).length !== 0 && <DetailsDialog
          openDetailsDialog={openDetailsDialog}
          heading={`${capitalizeEachWord(
            currentData?.employeeName
          )} Advance Details`}
          inputs={currentData}
          handleOnCloseDetails={() => {
            setOpenDetailsDialog(false);
            setSelectedRowId(null);
            setState({
              userId: user._id,
              employeeId: "",
              amount: "",
              description: "",
              date: "",
            });
            dispatch(clearCurrentEmployeeAdvance());
          }}
          icon={<AssignmentInd style={{ marginRight: "10px" }} />}
        />}
        {/* Add OR Update Customer Dialog Box  */}
        {openFormDialog && (
          <FormDialog
            openFormDialog={openFormDialog}
            heading={
              selectedRowId !== null && Object.keys(currentData).length !== 0
                ? "UPDATE EMPLOYEE ADVANCE"
                : "ADD EMPLOYEE ADVANCE"
            }
            color="#999999"
            state={state}
            setState={setState}
            handleOnClose={handleOnFormDialogClose}
            handleOnSubmit={handleOnAddUpdateFormSubmit}
            inputs={employeeAdvanceInputFields(
              selectedRowId,
              currentData,
              allActiveEmployees
            )}
            icon={<SwitchAccount style={{ marginRight: "10px" }} />}
          />
        )}

        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE EMPLOYEE PAYMENT"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are you sure you want to delete this payment."}
        />

        {/* Search Section with Modern Styling */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Search
            submit={handleOnSubmit}
            filters={filters}
            setFilter={setFilter}
            state={search}
            setState={setSearch}
            openFiltersPanel={openFiltersPanel}
            setOpenFiltersPanel={setOpenFiltersPanel}
            loadDataFunc={loadData}
            searchFiltersForm={searchCustomerPaymentFilters}
            searchInputForm={searchCustomerInput}
          />
        </Box>
        {/* DataTable for Employee Advances */}
        <Box sx={{ p: 2 }}>
          <DataTable
            columns={employeeAdvanceColumns(
              setOpenDeleteDialog,
              setOpenDetailsDialog,
              setOpenFormDialog
            )}
            rows={capitalizedRows}
            currentPage={currentPage}
            totalRecords={totalRecords}
            selectedRowId={selectedRowId}
            setSelectedRowId={setSelectedRowId}
            handleOnPageChange={handleOnPageChange}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeAdvance;
