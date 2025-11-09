import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import GridForm from "../../Components/form/GridForm";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrintMonthlyReport,
  getReports,
} from "../../redux/reportSlice/reportSlice";

//SEARCH USERS INPUTS
const searchReportInput = (printReport) => [
  {
    id: 1,
    label: "Start Date",
    type: "date",
    name: "startDate",
    grid: {
      xs: 12,
      sm: 4,
    },
  },
  {
    id: 2,
    label: "End Date",
    type: "date",
    name: "endDate",
    grid: {
      xs: 12,
      sm: 4,
    },
  },

  {
    id: 3,
    label: "Filter",
    type: "button",
    btntype: "submit",
    variant: "contained",
    color: "primary",
    grid: {
      xs: 12,
      sm: 2,
    },
  },
  {
    id: 4,
    label: "Print",
    type: "button",
    btntype: "button",
    variant: "contained",
    btnFunc: printReport,
    color: "primary",
    grid: {
      xs: 12,
      sm: 2,
    },
  },
];

export default function Report() {
  //Initializing use dispatch
  const disptach = useDispatch();
  //Initializing reports
  const reports = useSelector((state) => state.reports.data);

  //State for hold values
  const [state, setState] = useState({
    startDate: "",
    endDate: "",
  });

  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    console.log(sentence);
    return sentence
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const printReport = async () => {
    const { startDate, endDate } = state;

    if (startDate === "" && endDate === "") {
      toast("Please select date first", {
        position: "top-right",
        type: "error",
      });
    } else {
      if (startDate !== "" && endDate !== "") {
        //If both dates are selected
        let newData = { startDate: startDate, endDate: endDate };
        //Hid Function
        disptach(getPrintMonthlyReport(newData));
      } else if (startDate !== "" && endDate === "") {
        //If start date is selected set endDate same to start date
        let newData = { startDate: startDate, endDate: startDate };
        //Hit API Call
        disptach(getPrintMonthlyReport(newData));
      } else if (startDate === "" && endDate !== "") {
        //If start date is selected set endDate same to start date
        let newData = { startDate: endDate, endDate: endDate };
        //Hit API Call
        disptach(getPrintMonthlyReport(newData));
      }
    }
  };

  //Create handle one submit function
  const handleOnSubmit = (e) => {
    e.preventDefault();

    const { startDate, endDate } = state;

    if (startDate === "" && endDate === "") {
      toast("Please select date first", {
        position: "top-right",
        type: "error",
      });
    } else {
      if (startDate !== "" && endDate !== "") {
        //If both dates are selected
        let newData = { startDate: startDate, endDate: endDate };
        //Hid Function
        disptach(getReports(newData));
      } else if (startDate !== "" && endDate === "") {
        //If start date is selected set endDate same to start date
        let newData = { startDate: startDate, endDate: startDate };
        //Hit API Call
        disptach(getReports(newData));
      } else if (startDate === "" && endDate !== "") {
        //If start date is selected set endDate same to start date
        let newData = { startDate: endDate, endDate: endDate };
        //Hit API Call
        disptach(getReports(newData));
      }
    }
  };

  const fuelProducts = ["petrol", "diesel"];

  // 1. Group by product name
  const grouped =
    reports[0]?.products?.reduce((acc, item) => {
      acc[item.productName] = acc[item.productName] || [];
      acc[item.productName].push(item);
      return acc;
    }, {}) || {};

  // 2. Separate fuel and other products
  const fuelGroup = {};
  const otherGroup = {};

  Object.entries(grouped)?.length > 0 &&
    Object.entries(grouped)?.forEach(([name, items]) => {
      if (fuelProducts.includes(name.toLowerCase())) {
        fuelGroup[name] = items;
      } else {
        otherGroup[name] = items;
      }
    });

  // 3. Helper to render table rows + group totals
  const renderGroup = (group) => {
    let groupTotalQty = 0;
    let groupTotalAmt = 0;
    // let groupTestEntry = 0; // Commented: unused variable
    let totalProfit = 0;

    const rows = Object.entries(group)?.flatMap(([productName, items]) =>
      items.map((item, index) => {
        groupTotalQty += roundValue(item.quantity);
        groupTotalAmt += roundValue(item.amount);
        // groupTestEntry += roundValue(item.testEntry); // Commented: unused variable

        totalProfit += roundValue(
          roundValue(
            (roundValue(item.sellingPrice) - roundValue(item.costPrice)) *
              roundValue(item.quantity)
          )
        );

        return (
          <tr key={productName + index} className="hover:bg-blue-50 transition-colors">
            {index === 0 && (
              <td className="px-6 py-4 text-gray-700 font-semibold" rowSpan={items.length}>
                {capitalizeEachWord(productName)}
              </td>
            )}
            <td className="px-6 py-4 text-center text-gray-900 font-medium">{roundValue(item.quantity)}</td>
            <td className="px-6 py-4 text-center text-gray-900 font-medium">
              {roundValue(item.sellingPrice)?.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "PKR 0.00"}
            </td>
            <td className="px-6 py-4 text-right text-gray-900 font-medium">
              {roundValue(item.amount)?.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "PKR 0.00"}
            </td>
            <td className="px-6 py-4 text-right text-green-600 font-semibold">
              {roundValue((item.sellingPrice - item.costPrice) * item.quantity)?.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "PKR 0.00"}
            </td>
          </tr>
        );
      })
    );

    // Add total row for the group
    rows.push(
      <tr
        key={group === fuelGroup ? "fuel-total" : "other-total"}
        className="bg-gradient-to-r from-gray-50 to-blue-50 font-bold border-t-2 border-gray-300"
      >
        <td className="px-6 py-4 text-gray-900">Totals</td>
        <td className="px-6 py-4 text-center text-gray-900">{roundValue(groupTotalQty)}</td>
        <td className="px-6 py-4"></td>
        <td className="px-6 py-4 text-right text-gray-900">
          {groupTotalAmt?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "PKR 0.00"}
        </td>
        <td className="px-6 py-4 text-right text-green-600">
          {totalProfit?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "PKR 0.00"}
        </td>
      </tr>
    );

    return { rows, totalProfit, groupTotalAmt };
  };

  //Remaining stock
  const remainingStockAmount = () => {
    let stockAmount = 0;
    reports[0]?.endDateProductStocks.forEach(
      (item) => (stockAmount += item.amount)
    );

    return roundValue(stockAmount);
  };

  const roundValue = (value, decimals = 2) => {
    if (isNaN(value)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="m-0 mx-5 mb-5">
        {/* Header for Reports page  */}
        <Header
          title="Reports"
          subTitle="Generate Statement or Report"
          icon={
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <GridForm
            inputs={searchReportInput(printReport)}
            state={state}
            setState={setState}
            submit={handleOnSubmit}
          />
        </div>

        {/* Report Content */}
        {reports.length > 0 && (
          <div className="space-y-6 mb-8">
            {/* Main Report Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="mb-8 pb-6 border-b-2 border-gray-200">
                <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Monthly Sales Report
                </h1>
                <p className="text-gray-500 font-medium">
                  Comprehensive financial overview for selected period
                </p>
              </div>

              {/* Product Sales Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Product Sales</h2>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {reports.length > 0 && renderGroup(fuelGroup).rows}
                      {reports.length > 0 && renderGroup(otherGroup).rows}
                      {/* Gross Total */}
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 font-black border-t-2 border-gray-300">
                        <td colSpan="3" className="px-6 py-4 text-left text-gray-900">Gross Total</td>
                        <td className="px-6 py-4 text-right text-lg text-gray-900">
                          {(
                            renderGroup(fuelGroup).groupTotalAmt +
                            renderGroup(otherGroup).groupTotalAmt
                          )?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "PKR 0.00"}
                        </td>
                        <td className="px-6 py-4 text-right text-lg text-green-600">
                          {(
                            renderGroup(fuelGroup).totalProfit +
                            renderGroup(otherGroup).totalProfit
                          )?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "PKR 0.00"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Debit - Credit Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Debit - Credit</h2>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="overflow-x-auto rounded-lg border border-purple-100 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        <tr className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Total Customer Debit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalCustomerDebit?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">Total Customer Credit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalCustomerCredit?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Total Staff Debit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalEmployeeAdvanceReturn?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">Total Staff Credit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalEmployeeAdvance?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">Total Customer Advance</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalCustomerAdvance?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="bg-gradient-to-r from-purple-100 to-pink-100 font-black border-t-2 border-purple-300">
                          <td className="px-6 py-4 text-gray-900">Recovery</td>
                          <td className="px-6 py-4 text-right text-lg text-gray-900">
                            {(
                              reports[0]?.totalEmployeeAdvanceReturn +
                              reports[0]?.totalCustomerDebit
                            )?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                          <td className="px-6 py-4 text-gray-900">Total Credit</td>
                          <td className="px-6 py-4 text-right text-lg text-gray-900">
                            {(
                              reports[0]?.totalCustomerCredit +
                              reports[0]?.totalEmployeeAdvance +
                              reports[0]?.totalCustomerAdvance
                            )?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Expense & Total Purchase Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-red-500 to-rose-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Expense & Total Purchase</h2>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200">
                  <div className="overflow-x-auto rounded-lg border border-red-100 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-100 to-rose-100 border-b-2 border-red-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        <tr className="hover:bg-red-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Total Expense</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalExpenses?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-red-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Supplier Payments</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {reports[0]?.totalSupplierPaymentAmount?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="bg-gradient-to-r from-red-100 to-rose-100 font-black border-t-2 border-red-300">
                          <td className="px-6 py-4 text-gray-900">Total</td>
                          <td className="px-6 py-4 text-right text-lg text-gray-900">
                            {(
                              reports[0]?.totalSupplierPaymentAmount +
                              reports[0]?.totalExpenses
                            )?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Stock Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Stock</h2>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="overflow-x-auto rounded-lg border border-green-100 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Current Stock</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {reports[0]?.endDateProductStocks.map((item) => {
                          return (
                            <tr key={item.productId} className="hover:bg-green-50 transition-colors">
                              <td className="px-6 py-4 text-gray-700 font-semibold">{capitalizeEachWord(item.productName)}</td>
                              <td className="px-6 py-4 text-center text-gray-900 font-medium">{roundValue(item.newStock) || 0.0}</td>
                              <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                {roundValue(item.amount)?.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "PKR",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) || "PKR 0.00"}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gradient-to-r from-green-100 to-emerald-100 font-black border-t-2 border-green-300">
                          <td colSpan={2} className="px-6 py-4 text-gray-900">Total</td>
                          <td className="px-6 py-4 text-right text-lg text-gray-900">
                            {remainingStockAmount()?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Summary Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Summary</h2>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                  <div className="overflow-x-auto rounded-lg border border-amber-100 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        <tr className="hover:bg-amber-50 transition-colors">
                          <td colSpan={2} className="px-6 py-4 text-gray-700 font-semibold">Gross Sale Profit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {roundValue(
                              renderGroup(fuelGroup).totalProfit +
                                renderGroup(otherGroup).totalProfit
                            )?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-amber-50 transition-colors">
                          <td colSpan={2} className="px-6 py-4 text-gray-700 font-semibold">Profit Price Change</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {roundValue(reports[0]?.priceChangeProfit)?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        {reports[0]?.gain.map((item) => (
                          <tr key={item.productId} className="hover:bg-amber-50 transition-colors">
                            <td className="px-6 py-4 text-gray-700 font-semibold">{capitalizeEachWord(item.productName)}</td>
                            <td className="px-6 py-4 text-center text-gray-900 font-medium">{roundValue(item.totalGain)}</td>
                            <td className="px-6 py-4 text-right text-gray-900 font-medium">
                              {roundValue(item.totalAmount)?.toLocaleString("en-US", {
                                style: "currency",
                                currency: "PKR",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "PKR 0.00"}
                            </td>
                          </tr>
                        ))}
                        <tr className="hover:bg-amber-50 transition-colors">
                          <td colSpan={2} className="px-6 py-4 text-gray-700 font-semibold">Expense</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {roundValue(reports[0]?.totalExpenses)?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="bg-gradient-to-r from-amber-100 to-orange-100 font-black border-t-2 border-amber-300">
                          <td colSpan={2} className="px-6 py-4 text-gray-900">Gross Total Profit</td>
                          <td className="px-6 py-4 text-right text-lg text-gray-900">
                            {((renderGroup(fuelGroup)?.totalProfit || 0) +
                              (renderGroup(otherGroup)?.totalProfit || 0) +
                              (reports[0]?.priceChangeProfit || 0)) > 0 ?
                              ((renderGroup(fuelGroup)?.totalProfit || 0) +
                                (renderGroup(otherGroup)?.totalProfit || 0) +
                                (reports[0]?.priceChangeProfit || 0))?.toLocaleString("en-US", {
                                style: "currency",
                                currency: "PKR",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) : "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-amber-50 transition-colors">
                          <td colSpan={2} className="px-6 py-4 text-gray-700 font-semibold">Zakat (2.5%)</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {roundValue(
                              (renderGroup(fuelGroup)?.totalProfit || 0) +
                                (renderGroup(otherGroup)?.totalProfit || 0) +
                                (reports[0]?.priceChangeProfit || 0) -
                                (reports[0]?.totalExpenses || 0) >
                                0 &&
                                (((renderGroup(fuelGroup)?.totalProfit || 0) +
                                  (renderGroup(otherGroup)?.totalProfit || 0) +
                                  (reports[0]?.priceChangeProfit || 0) -
                                  (reports[0]?.totalExpenses || 0)) /
                                  100) *
                                  2.5
                            )?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className={`bg-gradient-to-r ${(renderGroup(fuelGroup)?.totalProfit || 0) +
                          (renderGroup(otherGroup)?.totalProfit || 0) +
                          (reports[0]?.priceChangeProfit || 0) -
                          (reports[0]?.totalExpenses || 0) >
                          0 ? 'from-green-100 to-emerald-100 border-green-300' : 'from-red-100 to-rose-100 border-red-300'} font-black border-t-2`}>
                          <td colSpan={2} className="px-6 py-4 text-gray-900">Net Profit</td>
                          <td className={`px-6 py-4 text-right text-lg ${(renderGroup(fuelGroup)?.totalProfit || 0) +
                            (renderGroup(otherGroup)?.totalProfit || 0) +
                            (reports[0]?.priceChangeProfit || 0) -
                            (reports[0]?.totalExpenses || 0) >
                            0 ? 'text-green-700' : 'text-red-700'}`}>
                            {(
                              (renderGroup(fuelGroup)?.totalProfit || 0) +
                              (renderGroup(otherGroup)?.totalProfit || 0) +
                              (reports[0]?.priceChangeProfit || 0) -
                              (reports[0]?.totalExpenses || 0) -
                              (((renderGroup(fuelGroup)?.totalProfit || 0) +
                                (renderGroup(otherGroup)?.totalProfit || 0) +
                                (reports[0]?.priceChangeProfit || 0) -
                                (reports[0]?.totalExpenses || 0) >
                                0 &&
                                (((renderGroup(fuelGroup)?.totalProfit || 0) +
                                  (renderGroup(otherGroup)?.totalProfit || 0) +
                                  (reports[0]?.priceChangeProfit || 0) -
                                  (reports[0]?.totalExpenses || 0)) /
                                  100) *
                                  2.5) ||
                                0)
                            )?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
