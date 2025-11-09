import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import GridForm from "../../Components/form/GridForm";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReports,
  getCustomerReports,
  getPrintCustomerReport,
} from "../../redux/reportSlice/reportSlice";
import { DOMAIN } from "../../backend/API";
import { getAllActiveCustomers } from "../../redux/completeDataSlice/completeDataSlice";
import { clearCustomers } from "../../redux/customerSlice/customerSlice";

// SEARCH FORM FIELDS
const searchReportInput = (printReport, customers) => [
  {
    id: 1,
    label: "Customer",
    type: "select",
    name: "customerId",
    options: (customers || []).map((item) => ({
      id: item._id,
      name: item.name,
      value: item._id,
      avatarUrl: `${DOMAIN}/public/customers/images/${item.pic}`,
      avatarAlt: "./img/avatarfile.png",
      salary: item?.balance?.toLocaleString("en-US", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    })),
    grid: { xs: 12, sm: 12, md: 12, lg: 12 },
  },
  {
    id: 2,
    label: "Start Date",
    type: "date",
    name: "startDate",
    grid: { xs: 12, sm: 4 },
  },
  {
    id: 3,
    label: "End Date",
    type: "date",
    name: "endDate",
    grid: { xs: 12, sm: 4 },
  },
  {
    id: 4,
    label: "Filter",
    type: "button",
    btntype: "submit",
    variant: "contained",
    color: "primary",
    grid: { xs: 12, sm: 2 },
  },
  {
    id: 5,
    label: "Print",
    type: "button",
    btntype: "button",
    variant: "contained",
    btnFunc: printReport,
    color: "primary",
    grid: { xs: 12, sm: 2 },
  },
];

export default function CustomerReport() {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.customerReports);
  const customers = useSelector((state) => state.completeData.customers);

  const [state, setState] = useState({
    customerId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllActiveCustomers());
    return () => {
      dispatch(clearCustomers());
      dispatch(clearReports());
    };
  }, [dispatch]);

  const printReport = async () => {
    const { customerId, startDate, endDate } = state;
    if (!customerId && !startDate && !endDate) {
      return toast("Please select date first", { type: "error" });
    }

    const newData = {
      customerId,
      startDate: startDate || endDate,
      endDate: endDate || startDate,
    };
    dispatch(getPrintCustomerReport(newData));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const { customerId, startDate, endDate } = state;

    if (!customerId) {
      return toast("Please Select the Customer", { type: "error" });
    }

    if (!startDate && !endDate) {
      return toast("Please select date first", { type: "error" });
    }

    const newData = {
      customerId,
      startDate: startDate || endDate,
      endDate: endDate || startDate,
    };

    dispatch(getCustomerReports(newData));
  };

  const data = reports?.[0];
  const customer = data?.customer;

  const creditRecords = data?.credits?.records || [];
  const creditTotal = data?.credits?.grandTotal || 0;
  const lastCredit = data?.lastAmount || 0;

  const paymentRecords = data?.payments?.records || [];
  const paymentTotal = data?.payments?.grandTotal || 0;

  const advanceRecords = data?.advances?.records || [];
  const advanceTotal = data?.advances?.grandTotal || 0;

  const totalCredit = creditTotal + advanceTotal;
  const remaining = lastCredit + totalCredit - paymentTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="m-0 mx-5 mb-5">
        <Header
          title="Customer Reports"
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
            inputs={searchReportInput(printReport, customers)}
            state={state}
            setState={setState}
            submit={handleOnSubmit}
          />
        </div>

        {/* Customer Info Card */}
        {data && customer && (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm opacity-90 mb-1 font-medium">Customer Name</p>
                <h3 className="text-2xl font-black">{customer?.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1 font-medium">Current Credit</p>
                <p className="text-2xl font-black">
                  {customer?.balance?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Content */}
        {data && (
          <div className="space-y-6 mb-8">
            {/* Main Report Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="mb-8 pb-6 border-b-2 border-gray-200">
                <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Customer Statement
                </h1>
                <p className="text-gray-500 font-medium">
                  Complete financial overview for {customer?.name}
                </p>
              </div>

              {/* Customer Credit Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-red-500 to-rose-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Customer Credit</h2>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200">
                  <div className="overflow-x-auto rounded-lg border border-red-100 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-100 to-rose-100 border-b-2 border-red-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Product Name</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {creditRecords.length > 0 ? (
                          creditRecords.map((item, i) => (
                            <tr key={i} className="hover:bg-red-50 transition-colors">
                              <td className="px-6 py-4 text-gray-700 font-semibold">
                                {item.productName && String(item.productName).trim() ? item.productName : "-"}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {item.description && String(item.description).trim() ? item.description : "-"}
                              </td>
                              <td className="px-6 py-4 text-center text-gray-700 font-medium">
                                {item.date && String(item.date).trim() ? item.date : "-"}
                              </td>
                              <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                {item.amount?.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "PKR",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) || "PKR 0.00"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                              No credit records found for the selected date range
                            </td>
                          </tr>
                        )}
                        <tr className="bg-gradient-to-r from-red-100 to-rose-100 font-black border-t-2 border-red-300">
                          <td colSpan={3} className="px-6 py-4 text-gray-900">Total Amount</td>
                          <td className="px-6 py-4 text-right text-lg text-gray-900">
                            {creditTotal.toLocaleString("en-US", {
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

              {/* Advance - Debit Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Advance - Debit</h2>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="overflow-x-auto rounded-lg border border-purple-100 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b-2 border-purple-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Debit</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Advance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {(() => {
                          const maxLength = Math.max(
                            paymentRecords.length,
                            advanceRecords.length
                          );
                          const rows = [];
                          
                          if (maxLength === 0) {
                            rows.push(
                              <tr key="empty">
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                  No payment or advance records found for the selected date range
                                </td>
                              </tr>
                            );
                          } else {
                            for (let i = 0; i < maxLength; i++) {
                              const payment = paymentRecords[i];
                              const advance = advanceRecords[i];

                              rows.push(
                                <tr key={i} className="hover:bg-purple-50 transition-colors">
                                  <td className="px-6 py-4 text-gray-700 font-medium">{payment?.date || "-"}</td>
                                  <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                    {payment?.payingAmount?.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "PKR",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }) || "-"}
                                  </td>
                                  <td className="px-6 py-4 text-gray-700 font-medium">{advance?.date || "-"}</td>
                                  <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                    {advance?.amount?.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "PKR",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }) || "-"}
                                  </td>
                                </tr>
                              );
                            }
                          }

                          rows.push(
                            <tr key="totals" className="bg-gradient-to-r from-purple-100 to-indigo-100 font-black border-t-2 border-purple-300">
                              <td className="px-6 py-4 text-gray-900">Totals</td>
                              <td className="px-6 py-4 text-right text-lg text-gray-900">
                                {paymentTotal.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "PKR",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) || "PKR 0.00"}
                              </td>
                              <td className="px-6 py-4 text-gray-900">Totals</td>
                              <td className="px-6 py-4 text-right text-lg text-gray-900">
                                {advanceTotal.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "PKR",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) || "PKR 0.00"}
                              </td>
                            </tr>
                          );

                          return rows;
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900">Summary</h2>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="overflow-x-auto rounded-lg border border-green-100 bg-white shadow-sm max-w-2xl">
                    <table className="w-full border-collapse">
                      <tbody className="bg-white divide-y divide-gray-100">
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Credit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {creditTotal.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Advance</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {advanceTotal.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors bg-gray-50">
                          <td className="px-6 py-4 text-gray-900 font-black">Total Credit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-black">
                            {totalCredit.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors bg-gray-50">
                          <td className="px-6 py-4 text-gray-900 font-black">Last Credit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-black">
                            {lastCredit.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className="hover:bg-green-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-semibold">Debit</td>
                          <td className="px-6 py-4 text-right text-gray-900 font-medium">
                            {paymentTotal.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "PKR 0.00"}
                          </td>
                        </tr>
                        <tr className={`bg-gradient-to-r ${remaining >= 0 ? 'from-green-100 to-emerald-100 border-green-300' : 'from-red-100 to-rose-100 border-red-300'} font-black border-t-2`}>
                          <td className="px-6 py-4 text-gray-900">Remaining</td>
                          <td className={`px-6 py-4 text-right text-lg ${remaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {remaining.toLocaleString("en-US", {
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
