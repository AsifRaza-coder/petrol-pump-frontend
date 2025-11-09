import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DOMAIN, ENDPOINTS } from "../../backend/API";
//GET ALL REPORTS AXIOS CALL USING ASYNC THUNK
export const getReports = createAsyncThunk("getReports", async (initData) => {
  try {
    const { startDate, endDate } = initData;

    //Creating API call using ENDPOINTS as Base URL (/api/reports)
    return await axios
      .get(`${ENDPOINTS.REPORT}?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

export const getCustomerReports = createAsyncThunk(
  "getCustomerReports",
  async (initData) => {
    try {
      const { customerId, startDate, endDate } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/reports)
      return await axios
        .get(
          `${ENDPOINTS.CUSTOMERREPORT}?startDate=${startDate}&endDate=${endDate}&customerId=${customerId}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  }
);

//GET PRINT CLOSING AXIOS CALL USING ASYNC THUNK
export const getPrintMonthlyReport = createAsyncThunk(
  "getPrintMonthlyReport",
  async (initData) => {
    try {
      const { startDate, endDate } = initData;
      //Creating API Call using base url (/api/printClosing/:id)
      return await axios
        .get(
          `${ENDPOINTS.PRINTREPORT}?startDate=${startDate}&endDate=${endDate}`
        )
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);

//GET PRINT CLOSING AXIOS CALL USING ASYNC THUNK
export const getPrintCustomerReport = createAsyncThunk(
  "getPrintCustomerReport",
  async (initData) => {
    try {
      const { customerId, startDate, endDate } = initData;
      //Creating API Call using base url (/api/printClosing/:id)
      return await axios
        .get(
          `${ENDPOINTS.PRINTCUSTOMERREPORT}?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`
        )
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
export const genReport = createAsyncThunk("genReport", async (initData) => {
  try {
    const { startDate, endDate } = initData;

    //Creating API call using ENDPOINTS as Base URL (/api/reports)
    return await axios
      .get(`${ENDPOINTS.GENREPORT}?startDate=${startDate}&endDate=${endDate}`, {
        responseType: "blob", // Important to specify 'blob' response type for binary data
      })
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//create new slice
export const reportSlice = createSlice({
  name: "reports",
  initialState: {
    data: [],
    errors: [],
  },
  reducers: {
    clearReports() {
      return {
        data: [],
        customerReports: [],
        errors: [],
      };
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET REPORTS
    //@Data         Data stored in state
    builder.addCase(genReport.fulfilled, (state, actions) => {
      // Create a blob from the PDF response
      // const pdfBlob = new Blob([actions.payload], { type: "application/pdf" });

      // // Create a URL for the blob
      // const pdfUrl = window.URL.createObjectURL(pdfBlob);

      console.log("This is the pdf actions => ", actions.payload);
      // Open the new PDF in a new tab
      window.open(`${DOMAIN + actions.payload.url}`, "_blank");

      // Optionally, revoke the object URL after use (for memory cleanup)
      // window.URL.revokeObjectURL(pdfUrl);
      //Check for request success
      console.log(actions.payload);
    });

    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET REPORTS
    //@Data         Data stored in state
    builder.addCase(getReports.fulfilled, (state, actions) => {
      //Check for request success
      console.log(actions.payload);
      if (actions.payload.success === true) {
        //First Removing all the previous page readings
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          // const report = { ...item, id: item._id };
          //Here we are setting the fetched readings in redux store
          return state.data.push(item);
        });
      }
    });

    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET REPORTS
    //@Data         Data stored in state
    builder.addCase(getCustomerReports.fulfilled, (state, actions) => {
      console.log("Customers Report => ", actions.payload);
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page readings
        state.customerReports = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          //Here we are setting the fetched readings in redux store
          return state.customerReports.push(item);
        });
      }
    });

    builder.addCase(getPrintMonthlyReport.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        // const url = action.payload.url;

        // // Normalize backslashes and use RegExp to find exact /backend/ folder
        // const normalizedUrl = url.replace(/\\/g, "/");

        // // Match everything after "/backend/"
        // const match = normalizedUrl.match(/\/backend\/(.+)$/);

        // const relativePath = match ? `/${match[1]}` : "";

        // const fullUrl = DOMAIN + relativePath;

        // // Open the new PDF in a new tab
        // window.open(fullUrl, "_blank");

        // Optionally, revoke the object URL after use (for memory cleanup)
        // window.URL.revokeObjectURL(fullUrl);
        console.log("This is the pdf actions => ", action.payload);
        // Open the new PDF in a new tab
        window.open(`${DOMAIN + action.payload.url}`, "_blank");
      }
    });

    builder.addCase(getPrintCustomerReport.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        // const url = action.payload.url;

        // // Normalize backslashes and use RegExp to find exact /backend/ folder
        // const normalizedUrl = url.replace(/\\/g, "/");

        // // Match everything after "/backend/"
        // const match = normalizedUrl.match(/\/backend\/(.+)$/);

        // const relativePath = match ? `/${match[1]}` : "";

        // const fullUrl = DOMAIN + relativePath;

        // // Open the new PDF in a new tab
        // window.open(fullUrl, "_blank");

        // // Optionally, revoke the object URL after use (for memory cleanup)
        // window.URL.revokeObjectURL(fullUrl);

        console.log("This is the pdf actions => ", action.payload);
        // Open the new PDF in a new tab
        window.open(`${DOMAIN + action.payload.url}`, "_blank");
      }
    });
  },
});

export const { clearReports } = reportSlice.actions;
export default reportSlice.reducer;
