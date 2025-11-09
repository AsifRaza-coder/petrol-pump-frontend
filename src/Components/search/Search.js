import { FilterList } from "@mui/icons-material";
import SyncIcon from "@mui/icons-material/Sync";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import FilterForm from "./FilterForm";
import GridForm from "../form/GridForm";


const Search = ({
  filters,
  submit,
  setFilter,
  state,
  setState,
  loadDataFunc,
  openFiltersPanel,
  setOpenFiltersPanel,
  searchFiltersForm,
  searchInputForm
}) => {
  
  //Handle open filters panel
  const handleOpenFiltersPanel = (event) => {
    event.preventDefault();
    setOpenFiltersPanel(!openFiltersPanel);
  };

  //Handle clear filters function
  const handleClearFilters = () => {
    //Clear the filters
    setFilter({ ...filters, field: "", operator: "", sort: -1 });
    //clear the input state as well
    setState({ searchInput: "", startDate: "", endDate: "" });
    //If Filters panel is open then close it
    openFiltersPanel
      ? setOpenFiltersPanel(!openFiltersPanel)
      : setOpenFiltersPanel(openFiltersPanel);
    //Reload the fetch data or normal get
    loadDataFunc();
  };
  return (
    <Box className="mb-4">
      {/* FILTER COMPONENTS  */}
      <Box className="flex items-center gap-4 mb-3">
        <Box className="flex items-center gap-2">
          <IconButton 
            onClick={handleOpenFiltersPanel}
            className="!text-blue-600 hover:!bg-blue-50"
          >
            <FilterList />
          </IconButton>
          <Typography className="!font-medium !text-gray-700">Filter</Typography>
        </Box>
        {filters.field !== "" && (
          <Box className="flex items-center gap-2">
            <IconButton 
              onClick={handleClearFilters}
              className="!text-green-600 hover:!bg-green-50"
            >
              <SyncIcon />
            </IconButton>
            <Typography className="!font-medium !text-gray-700">Clear Filters</Typography>
          </Box>
        )}
      </Box>
      <Box
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          openFiltersPanel 
            ? "max-h-[400px] opacity-100 p-5 mb-4 bg-white rounded-lg shadow-md border border-gray-200" 
            : "max-h-0 opacity-0"
        }`}
      >
        <FilterForm
          inputs={searchFiltersForm(filters)}
          filters={filters}
          setFilter={setFilter}
        />
        {/* SEARCH INPUTS  */}
        <Box>
           <GridForm
            inputs={searchInputForm(filters)}
            submit={submit}
            state={state}
            setState={setState}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Search;
