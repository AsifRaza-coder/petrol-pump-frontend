import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import FormDialog from "../../Components/dialogue/FormDialogue";
import Dialogue from "../../Components/dialogue/Dialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";

import {
  
  Speed,

} from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";

import { addMachine, clearMachines, deleteMachine, getMachines, getSingleMachine, updateMachine } from "../../redux/machineSlice/machineSlice";
import { machineInputFields, searchMachineFilters } from "../../Components/sources/machinesFormSources";
import { searchInput } from "../../Components/sources/formSources";
import { readingColumns } from "../../Components/datatable/readingTableSources";
import { clearReadings, deleteReading, getReadings, addReading } from "../../redux/readingSlice/readingSlice";
import { searchReadingFilters } from "../../Components/sources/readingsFormSources";
import { getAllMachines } from "../../redux/completeDataSlice/completeDataSlice";

const Readings = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
 
  const readings = useSelector((state) => state.readings.data);
  const machines = useSelector((state) => state.completeData.machines);
 
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.readings.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.readings.errors);
  //Use State for Handle Open and close of form dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);
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
    startDate: "",
    endDate: "",
    searchInput: ""
  });
  //Form state for adding reading
  const [state, setState] = useState({
    machineId: "",
    reading: "",
    salesCash: "",
    date: ""
  });

  
  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Customer API Hit
 

  //useEffect to dispatch all machines and readings
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    dispatch(getReadings(initialData));
    dispatch(getAllMachines());

    //Call clear machines to clear machines from state on unmount
    return () => {
      dispatch(clearReadings());
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
}, [submitErrors]);

//Handle form dialog close
const handleOnFormDialogClose = () => {
  setOpenFormDialog(false);
  setSelectedRowId(null);
  setState({
    machineId: "",
    reading: "",
    salesCash: "",
    date: ""
  });
};

//Handle form submit for adding reading
const handleOnAddFormSubmit = async (e) => {
  e.preventDefault();
  const { machineId, reading, salesCash, date } = state;
  
  if (!machineId || !reading || !date) {
    toast("Please fill all required fields", { position: "top-right", type: "error" });
    return;
  }

  //Find selected machine to get previous reading
  const selectedMachine = machines.find(m => m._id === machineId || m.id === machineId);
  if (!selectedMachine) {
    toast("Machine not found", { position: "top-right", type: "error" });
    return;
  }

  const prevReading = selectedMachine.currentReading || selectedMachine.initialReading || 0;

  const readingData = {
    machineId,
    reading: parseFloat(reading),
    prevReading: parseFloat(prevReading),
    salesCash: salesCash ? parseFloat(salesCash) : 0,
    date
  };

  const result = await dispatch(addReading(readingData));
  
  //Check if successful and close dialog
  if (result.payload?.success === true) {
    handleOnFormDialogClose();
    //Reload data
    loadData();
  }
};


//Load The Data
const loadData = () => {
  const initialData = { page: 0, sort: -1 };
  //Call get Readings using dispatch
  dispatch(getReadings(initialData));
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
      dispatch(getReadings(newState));
      //After search results close the filters panel
      setOpenFiltersPanel(!openFiltersPanel);
      //Set Page to Zero
      setCurrentPage(0);
    }
  } else if (field === "") {
    //Calling dispatch function to hit API Call
    dispatch(getReadings(newState));
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
      dispatch(getReadings(newState));
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
        dispatch(getReadings(newState));
      }
    } else if (field === "") {
      dispatch(getReadings(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getReadings(newState));
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
  const capitalizedRows = readings.map((row) => ({
    ...row,
    name: row.machine.name && capitalizeEachWord(row.machine.name),
    type: row.machine.type && capitalizeEachWord(row.machine.type)
  }));

  //Generate form fields with machine selection
  const readingInputFields = [
    {
      id: 1,
      label: "Machine",
      type: "select",
      name: "machineId",
      options: machines.map(machine => ({
        id: machine._id || machine.id,
        name: `${machine.name} (${machine.type})`,
        value: machine._id || machine.id
      })),
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 2,
      label: "New Reading",
      type: "number",
      name: "reading",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 3,
      label: "Cash Sales (Amount)",
      type: "number",
      name: "salesCash",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 4,
      label: "Date",
      type: "date",
      name: "date",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 5,
      label: "Add Reading",
      type: "button",
      btntype: "submit",
      color: "primary",
      variant: "contained",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      }
    }
  ];

  //Handle delete reading
  const handleOnDelete = () => {
    if (selectedRowId) {
      dispatch(deleteReading(selectedRowId));
      setOpenDeleteDialog(false);
      setSelectedRowId(null);
      //Reload data after delete
      setTimeout(() => {
        loadData();
      }, 500);
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Employee Page  */}
      <Header
        icon={<Speed style={{ marginRight: "10px" }} />}
        title="Machine Readings"
        subTitle="Manage Application Machines Readings"
        addBtnTitle="Add Reading"
        dialog={openFormDialog}
        setDialog={setOpenFormDialog}
      />
      {/* Main Card for setup employees Table */}
      <Box className="mainCard">
        {/* Form Dialog for Adding Reading */}
        <FormDialog
          openFormDialog={openFormDialog}
          setOpenFormDialog={setOpenFormDialog}
          heading="ADD METER READING"
          color="#999999"
          state={state}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddFormSubmit}
          inputs={readingInputFields}
          icon={<Speed style={{ marginRight: "10px" }} />}
        />

        {/* Delete Confirmation Dialog */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading="DELETE READING"
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message="Are you sure you want to delete this reading? This action cannot be undone."
        />
      
        {/* Here we calling Search component in which we 
        are passing Filters state and Input Values state  */}
        <Search
          submit={handleOnSubmit}
          filters={filters}
          setFilter={setFilter}
          state={search}
          setState={setSearch}
          openFiltersPanel={openFiltersPanel}
          setOpenFiltersPanel={setOpenFiltersPanel}
          loadDataFunc={loadData}
          searchFiltersForm={searchReadingFilters}
          searchInputForm={searchInput}
        />
        {/* DataTable for Employees  */}
        <DataTable
          columns={readingColumns(
            setOpenDeleteDialog,
            setDetailsDialog,
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
    </Box>
  );
};

export default Readings;
