import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL SUPPLIER PAYMENTS AXIOS CALL USING ASYNC THUNK
export const getSupplierPayments = createAsyncThunk(
  "getSupplierPayments",
  async (initData) => {
    try {
      const { field, operator, sort, page, startDate, endDate, searchInput } =
        initData;

      //Creating API call using ENDPOINTS as Base URL (/api/supplierPayments)
      console.log(
        "Field => ",
        field,
        "Operator =>",
        operator,
        "sort => ",
        sort,
        "startDate => ",
        startDate,
        "EndDate => ",
        endDate,
        "Page =>",
        page,
        "Search Input =>",
        searchInput
      );
      return await axios
        .get(
          `${ENDPOINTS.SUPPLIERPAYMENT}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  }
);

//GET SINGLE SUPPLIER PAYMENT AXIOS CALL USING ASYNC THUNK
export const getSingleSupplierPayment = createAsyncThunk(
  "getSingleSupplierPayment",
  async (id) => {
    try {
      //Creating API Call using base url (/api/supplierpayments/:id)
      return await axios
        .get(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//ADD ADD PAYMENT AXIOS CALL USING ASYNC THUNK
export const addSupplierPayment = createAsyncThunk(
  "addSupplierPayment",
  async (Data) => {
    try {
      //Creating API call using ENDPOINTS as Base URL (/api/supplierpayments)
      return await axios
        .post(ENDPOINTS.SUPPLIERPAYMENT, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//UPDATE SUPPLIER AXIOS CALL USING ASYNC THUNK
export const updateSupplierPayment = createAsyncThunk(
  "updateSupplierPayment",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/supplierpayments/:id)
      return await axios
        .put(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE SUPPLIER PAYMENT AXIOS CALL USING ASYNC THUNK
export const deleteSupplierPayment = createAsyncThunk(
  "deleteSupplierPayment",
  async (id) => {
    try {
      //Creating API Call using ENDPOINTS as Base URL (/api/supplierpayments/:id)
      return await axios
        .delete(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      return error.response.data.error[0];
    }
  }
);

//Creating Suppliers Payemnt Slice
export const supplierPaymentSlice = createSlice({
  name: "supplierPayments",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearSupplierPayments() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
    // ✅ Clear only current selected item
    clearCurrentSupplierPayment(state) {
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SUPPLIER PAYMENTS
    //@Data         Data stored in state
    builder.addCase(getSupplierPayments.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page supplier payments
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const supplierPayment = { ...item, id: item._id };
          //Here we are setting the fetched supplier payments in redux store
          return state.data.push(supplierPayment);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE SUPPLIER PAYMENT
    //@Response     Date Stored in State current
    builder.addCase(getSingleSupplierPayment.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.data,
        };
      }
    });

    //@CaseNo       04
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Supplier Payment
    //@Response     Success Alert
    builder.addCase(addSupplierPayment.fulfilled, (state, action) => {
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });

        const supplierpayment = {
          ...action.payload.supplierpayment,
          id: action.payload.supplierpayment._id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [supplierpayment, ...poppedState];
        } else {
          state.data = [supplierpayment, ...state.data];
        }

        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Supplier Payment
    //@Response     Success Alert
    builder.addCase(updateSupplierPayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        const updatedSupplierPayment = {
          ...action.payload.updated[0],
          id: action.payload.updated[0]._id,
        };
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });
        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated[0]._id
              ? updatedSupplierPayment
              : item
          ),
          errors: [],
        };
      }
    });
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE SUPPLIER PAYMENT
    //@Data         Filtered data stored
    builder.addCase(deleteSupplierPayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for request success
      if (action.payload.success === true) {
        //Set Alert
        toast(action.payload.msg, { position: "top-right", type: "error" });
        return {
          ...state,
          data: [...state.data.filter((item) => item.id !== action.payload.id)],
          totalRecord: action.payload.totalRecord,
        };
      }
    });
  },
});

//Export Reducer functions
export const { clearSupplierPayments, clearCurrentSupplierPayment } =
  supplierPaymentSlice.actions;
export default supplierPaymentSlice.reducer;
