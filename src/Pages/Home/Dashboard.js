import Widget from "../../Components/widgets/Widget";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cleardata,
  getAllActiveCustomers,
  getAllStocks,
  getAllActiveSuppliers,
  getAllEmployees,
  getAllProducts,
} from "../../redux/completeDataSlice/completeDataSlice";
import { getSales } from "../../redux/saleSlice/saleSlice";
import { getPurchases } from "../../redux/purchaseStockSlice/purchaseStockSlice";
import { getExpenses } from "../../redux/expenseSlice/expenseSlice";
import { getCashes } from "../../redux/cashSlice/cashSlice";
import { getCustomerPayments } from "../../redux/customerPaymentSlice/customerPaymentSlice";
import { getSupplierPayments } from "../../redux/supplierPaymentSlice/supplierPaymentSlice";
import { getAllMachines } from "../../redux/completeDataSlice/completeDataSlice";

const Dashboard = () => {
  //get from store
  const stocks = useSelector((state) => state.completeData.stocks);
  const customers = useSelector((state) => state.completeData.customers);
  const suppliers = useSelector((state) => state.completeData.suppliers);
  const employees = useSelector((state) => state.completeData.employees);
  const products = useSelector((state) => state.completeData.products);
  const sales = useSelector((state) => state.sales.data);
  const purchases = useSelector((state) => state.purchases.data);
  const expenses = useSelector((state) => state.expenses.data);
  const cashes = useSelector((state) => state.cashes.data);
  const machines = useSelector((state) => state.completeData.machines);
  const customerPayments = useSelector((state) => state.customerpayments.data);
  const supplierPayments = useSelector((state) => state.supplierpayments.data);
  
  //Setup dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    // Get basic data
    dispatch(getAllStocks());
    dispatch(getAllActiveCustomers());
    dispatch(getAllActiveSuppliers());
    dispatch(getAllEmployees());
    dispatch(getAllProducts());
    dispatch(getAllMachines());

    // Get today's date for filtering
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString().split('T')[0];
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString().split('T')[0];

    // Get financial data for today
    dispatch(getSales({
      field: "createdAt",
      operator: "inBetween",
      sort: "-createdAt",
      page: 1,
      searchInput: "",
      startDate: startOfToday,
      endDate: endOfToday
    }));

    dispatch(getPurchases({
      field: "createdAt",
      operator: "inBetween",
      sort: "-createdAt",
      page: 1,
      searchInput: "",
      startDate: startOfToday,
      endDate: endOfToday
    }));

    dispatch(getExpenses({
      field: "createdAt",
      operator: "inBetween",
      sort: "-createdAt",
      page: 1,
      searchInput: "",
      startDate: startOfToday,
      endDate: endOfToday
    }));

    dispatch(getCashes({
      field: "createdAt",
      operator: "inBetween",
      sort: "-createdAt",
      page: 1,
      searchInput: "",
      startDate: startOfToday,
      endDate: endOfToday
    }));

    // Get payment data for today
    dispatch(getCustomerPayments({
      field: "createdAt",
      operator: "inBetween",
      sort: "-createdAt",
      page: 1,
      searchInput: "",
      startDate: startOfToday,
      endDate: endOfToday
    }));

    dispatch(getSupplierPayments({
      field: "createdAt",
      operator: "inBetween",
      sort: "-createdAt",
      page: 1,
      searchInput: "",
      startDate: startOfToday,
      endDate: endOfToday
    }));

    //Call clear customers to clear customers from state on unmount
    return () => {
      dispatch(cleardata());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function analyzeBalances(data) {
    const result = {
      totalObjects: 0,
      balanceGreaterThanZero: 0,
      totalBalanceSum: 0,
    };

    for (const item of data) {
      result.totalObjects++;

      const balance = parseFloat(item.balance) || 0;
      result.totalBalanceSum += balance;

      if (balance > 0) {
        result.balanceGreaterThanZero++;
      }
    }

    return result;
  }

  const analyzeCustomer = analyzeBalances(customers);
  
  // Calculate low stock items (petrol/diesel < 2000)
  const lowStockCount = stocks.filter(
    (element) =>
      (element.product.type === "petrol" || element.product.type === "diesel") &&
      element.stock < 2000
  ).length;

  // Calculate today's financial totals
  const todaySalesTotal = sales?.reduce((sum, sale) => {
    return sum + (parseFloat(sale.totalAmount) || 0);
  }, 0) || 0;

  const todayPurchasesTotal = purchases?.reduce((sum, purchase) => {
    return sum + (parseFloat(purchase.totalAmount) || 0);
  }, 0) || 0;

  const todayExpensesTotal = expenses?.reduce((sum, expense) => {
    return sum + (parseFloat(expense.amount) || 0);
  }, 0) || 0;

  // Calculate cash balance (last cash entry or sum of all)
  const cashBalance = cashes?.length > 0 
    ? parseFloat(cashes[cashes.length - 1]?.balance || 0)
    : 0;

  // Calculate today's payment totals
  const todayCustomerPayments = customerPayments?.reduce((sum, payment) => {
    return sum + (parseFloat(payment.paidAmount) || 0);
  }, 0) || 0;

  const todaySupplierPayments = supplierPayments?.reduce((sum, payment) => {
    return sum + (parseFloat(payment.paidAmount) || 0);
  }, 0) || 0;

  // Calculate today's profit (Sales - Purchases - Expenses)
  const todayProfit = todaySalesTotal - todayPurchasesTotal - todayExpensesTotal;
  
  // Separate petrol and diesel stocks
  const mainStocks = stocks.filter(
    (element) =>
      element.product.name === "Petrol" || element.product.name === "Diesel"
  );
  
  const otherStocks = stocks.filter(
    (element) =>
      element.product.name !== "Petrol" && element.product.name !== "Diesel"
  );

  return (
    <div className="flex overflow-x-hidden bg-white min-h-screen">
      <div className="flex-[6] w-full">
        {/* Main Dashboard Container */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Welcome to Mudasar Filling Station Management System
            </p>
          </div>

          {/* Customer Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active Customers */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 rounded-xl p-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Active Customers</h3>
              <p className="text-4xl font-black text-gray-900 mb-1">{analyzeCustomer.totalObjects}</p>
              <p className="text-xs text-gray-500">Total registered</p>
            </div>

            {/* Credit Customers */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-50 rounded-xl p-3">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Credit Customers</h3>
              <p className="text-4xl font-black text-gray-900 mb-1">{analyzeCustomer.balanceGreaterThanZero}</p>
              <p className="text-xs text-gray-500">With pending balance</p>
            </div>

            {/* Total Balance */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-50 rounded-xl p-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Total Balance</h3>
              <p className="text-2xl font-black text-gray-900 mb-1 break-words">
                {analyzeCustomer.totalBalanceSum?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "PKR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500">Receivable amount</p>
            </div>
          </div>

          {/* Business Summary Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Business Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Today's Profit */}
              <div className={`bg-gradient-to-br ${todayProfit >= 0 ? 'from-emerald-500 to-green-600' : 'from-red-500 to-rose-600'} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-2 opacity-90 uppercase tracking-wide">Today's Profit</h3>
                <p className="text-2xl font-black mb-1">
                  {todayProfit.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs opacity-75">{todayProfit >= 0 ? 'Net profit' : 'Net loss'}</p>
              </div>

              {/* Customer Payments Received */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-2 opacity-90 uppercase tracking-wide">Customer Payments</h3>
                <p className="text-2xl font-black mb-1">
                  {todayCustomerPayments.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs opacity-75">Received today</p>
              </div>

              {/* Supplier Payments Made */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-2 opacity-90 uppercase tracking-wide">Supplier Payments</h3>
                <p className="text-2xl font-black mb-1">
                  {todaySupplierPayments.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs opacity-75">Paid today</p>
              </div>

              {/* Total Machines */}
              <div className="bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-2 opacity-90 uppercase tracking-wide">Total Machines</h3>
                <p className="text-3xl font-black mb-1">{machines?.length || 0}</p>
                <p className="text-xs opacity-75">Active machines</p>
              </div>
            </div>
          </div>

          {/* Main Fuel Products Section */}
          {mainStocks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Main Fuel Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStocks.map((element) => (
                  <div key={element._id}>
                    <Widget type="users" data={element} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Products Section */}
          {otherStocks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Other Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherStocks.map((element) => (
                  <div key={element._id}>
                    <Widget type="users" data={element} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
