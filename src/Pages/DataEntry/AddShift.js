import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  activeCustomerAdvanceInputFields,
  activeCustomerCreditInputFields,
  activeCustomerInputFields,
  activeEmployeeCreditInputFields,
  activeEmployeeDebitInputFields,
  expenseInputFields,
  shiftClosingForm,
  shiftmobileOilsClosingForm,
  shiftproductsClosingForm,
} from "../../Components/sources/shiftFormSources";
import GridForm from "../../Components/form/GridForm";
import { useDispatch, useSelector } from "react-redux";
import {
  cleardata,
  getAllActiveCustomers,
  getAllEmployees,
  getAllProducts,
  getCurrentReadings,
} from "../../redux/completeDataSlice/completeDataSlice";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalance,
  AddOutlined,
  Assessment,
  Cancel,
  EnhancedEncryption,
  LockOpen,
  Loop,
  Person,
  Receipt,
  Store,
  SwitchAccount,
  SyncDisabled,
  Widgets,
} from "@mui/icons-material";
import FormDialog from "../../Components/dialogue/FormDialogue";
import { v4 as uuidv4 } from "uuid";
import ShiftDialog from "./ShiftDialog";
import { toast } from "react-toastify";
import { petrolDipChart } from "../../Components/sources/petrolDipChart";
import { dieselDipChart } from "../../Components/sources/dieselDipChart";
import AuthContext from "../../context/auth/AuthContext";
import { addClosing } from "../../redux/closingsSlice/closingsSlice";

//This is add shift page
const AddShift = () => {
  //Call Auth Context & Extract Logout
  const { user } = useContext(AuthContext);
  console.log("Check the User => ", user);
  //Initializing useSelector to get data from redux store
  const readings = useSelector((state) => state.completeData.readings);
  //Initializing the useSelector to get products data from the redux store
  const products = useSelector((state) => state.completeData.products);
  //Initializing the useSelector to get active customers
  const customers = useSelector((state) => state.completeData.customers);
  //Initializing th useSelector to get active employees
  const employees = useSelector((state) => state.completeData.employees);
  //Errors log
  const submitErrors = useSelector((state) => state.closings.errors);
  //Initializing the use Dispatch
  const dispatch = useDispatch();

  //Creating the use state for the form
  const [state, setState] = useState({
    userId: "",
    dips: [],
    products: [],
    customer: [],
    employees: [],
    expenses: [],
    bankAmount: "",
    cashInHand: "",
    date: "",
  });

  //Use State for hold sales entry
  const [salesEntry, setSalesEntry] = useState("");

  //Use State for mobile products sale
  const [mobileSaleEntry, setMobileSaleEntry] = useState("");

  //Use state for calculate the Total Depensed fuel
  const [totalSaleSum, setTotalSaleSum] = useState({
    petrol: 0,
    diesel: 0,
  });
  //Use State for calculate Test
  const [testEntry, setTestEntry] = useState({
    petrol: 0,
    diesel: 0,
  });

  //Use state to store calculated total Sale and total amount of fuel products
  const [netSale, setNetSale] = useState({
    petrolSale: 0,
    dieselSale: 0,
    petrolAmount: 0,
    dieselAmount: 0,
  });
  //Use state to handle customer payment dialog
  const [customerPaymentDialog, setCustomerPaymentDialog] = useState(false);
  //Use state to handle customer credit dialog
  const [customerCreditDialog, setCustomerCreditDialog] = useState(false);
  //Use state to handle employee advance dialog
  const [employeeDebitDialog, setEmployeeDebitDialog] = useState(false);
  //Use state to handle employee credit dialog
  const [employeeCreditDialog, setEmployeeCreditDialog] = useState(false);
  //Use State to handle open expense dialog
  const [expenseOpen, setExpenseOpen] = useState(false);
  //Use state to handle customer Advance dialog
  const [customerAdvanceDialog, setCustomerAdvanceDialog] = useState(false);
  //Use state to handle add credit product
  const [addCreditProduct, setAddCreditProduct] = useState({
    customerId: "",
    productId: "",
    amount: 0,
    description: "",
  });

  //Use state to control dip calculations
  const [dipCalculations, setDipCalculations] = useState({
    petrol: 0,
    diesel: 0,
  });

  //Use state to control dip
  const [dip, setDip] = useState({
    petrolDip: "",
    dieselDip: "",
    date: "",
  });

  //Use state to save products for each customer
  const [addCustomerCreditProduct, setAddCustomerCreditProduct] = useState([]);

  //Use state to handle add debit
  const [addDebit, setAddDebit] = useState({
    customerId: "",
    employeeId: "",
    amount: "",
    description: "",
  });

  //Use State to handle expense inputs
  const [addExpense, setAddExpense] = useState({
    name: "",
    description: "",
    amount: "",
  });

  const [expense, setExpense] = useState([]);
  //Use state to handle add debit
  const [addCustomerDebit, setAddCustomerDebit] = useState([]);
  const [addCustomerAdvance, setAddCustomerAdvance] = useState([]);

  //Use state to handle add debit
  const [addEmployeeDebit, setAddEmployeeDebit] = useState([]);
  const [addEmployeeCredit, setAddEmployeeCredit] = useState([]);

  //set disable on click
  const [disableClose, setDisableClose] = useState(true)

  //Use state for totals
  const [totals, setTotals] = useState({});

  //Dip litres calculations
  const calculateLitres = (value, chart) => {
    const dipValue = parseFloat(value);
    if (isNaN(dipValue)) return 0;

    const sorted = [...chart].sort((a, b) => a.dip - b.dip);

    const floor = sorted.filter((d) => d.dip <= dipValue).pop();
    const ceiling = sorted.find((d) => d.dip >= dipValue);

    if (!floor || !ceiling) return 0;

    if (floor.dip === ceiling.dip) {
      return floor.litres.toFixed(2);
    }

    const dipDiff = ceiling.dip - floor.dip;
    const litresDiff = ceiling.litres - floor.litres;
    const litresPerDip = litresDiff / dipDiff;

    const extraDip = dipValue - floor.dip;
    const finalLitres = floor.litres + extraDip * litresPerDip;

    return finalLitres.toFixed(2);
  };

  // Display submit errors if any
  useEffect(() => {
    if (submitErrors?.length > 0) {
      submitErrors.forEach((item) => {
        toast(item.msg, { position: "top-right", type: "error" });
      });
    }
  }, [submitErrors]);
  useEffect(() => {
    const petrolLitres = calculateLitres(dip.petrolDip, petrolDipChart);
    const dieselLitres = calculateLitres(dip.dieselDip, dieselDipChart); // use same chart or another for diesel
    setDipCalculations({
      petrol: petrolLitres,
      diesel: dieselLitres,
    });
  }, [dip]);
  //Use effect to calculate total sale of all machine per product

  //Use effect to get complete data
  useEffect(() => {
    dispatch(getAllProducts()); //Dispatch function to get all products
    dispatch(getAllActiveCustomers()); //Dispatch function to get all products
    dispatch(getAllEmployees()); //Dispatch function to get all products
    dispatch(getCurrentReadings()); // Dispatch function to get current machine readings

    return () => {
      dispatch(cleardata());
    };
    // eslint-disable-next-line
  }, []);

  //Refresh products when Customer Credit dialog opens to ensure latest products are shown
  useEffect(() => {
    if (customerCreditDialog) {
      dispatch(getAllProducts());
    }
  }, [customerCreditDialog, dispatch]);

  useEffect(() => {
    if (!readings || readings.length === 0) return;

    let updatedSales = { ...salesEntry };
    let totalSale = { petrol: 0, diesel: 0 };
    let shouldUpdateSalesEntry = false;

    Object.entries(salesEntry).forEach(([key, value]) => {
      const [machineId, field] = key.split("-");

      if (field === "newReading") {
        const reading = readings.find((r) => r.machineId === machineId);
        if (!reading) return;

        const lastReading = parseFloat(reading.newReading);
        const price = parseFloat(reading.price);
        const newReading = parseFloat(value);

        if (!isNaN(lastReading) && !isNaN(price) && !isNaN(newReading)) {
          const diff = newReading - lastReading;
          const amount = diff * price;

          const saleKey = `${machineId}-totalSale`;
          const amountKey = `${machineId}-totalAmount`;

          const formattedDiff = diff > 0 ? diff.toFixed(2) : "0";
          const formattedAmount = amount > 0 ? amount.toFixed(2) : "0";

          if (
            updatedSales[saleKey] !== formattedDiff ||
            updatedSales[amountKey] !== formattedAmount
          ) {
            updatedSales[saleKey] = formattedDiff;
            updatedSales[amountKey] = formattedAmount;
            shouldUpdateSalesEntry = true;
          }
        }
      }

      if (key.endsWith("-totalSale")) {
        const machineId = key.split("-")[0];
        const reading = readings.find((r) => r.machineId === machineId);
        if (!reading) return;

        const product = reading.product?.toLowerCase();
        const numericValue = parseFloat(value);

        if (!isNaN(numericValue)) {
          if (product === "petrol") {
            totalSale.petrol += numericValue;
          } else if (product === "diesel") {
            totalSale.diesel += numericValue;
          }
        }
      }
    });

    if (shouldUpdateSalesEntry) {
      setSalesEntry((prev) =>
        JSON.stringify(prev) !== JSON.stringify(updatedSales)
          ? updatedSales
          : prev
      );
    }

    setTotalSaleSum((prev) =>
      prev.petrol !== totalSale.petrol || prev.diesel !== totalSale.diesel
        ? totalSale
        : prev
    );

    const netPetrol =
      parseFloat(totalSale.petrol) - parseFloat(testEntry.petrol || 0);
    const netDiesel =
      parseFloat(totalSale.diesel) - parseFloat(testEntry.diesel || 0);

    const petrolReading = readings.find(
      (r) => r.product?.toLowerCase() === "petrol"
    );
    const dieselReading = readings.find(
      (r) => r.product?.toLowerCase() === "diesel"
    );

    const petrolPrice = petrolReading?.price || 0;
    const dieselPrice = dieselReading?.price || 0;

    const petrolAmount = parseFloat((netPetrol * petrolPrice).toFixed(2));
    const dieselAmount = parseFloat((netDiesel * dieselPrice).toFixed(2));

    setNetSale({
      petrolSale: parseFloat(netPetrol.toFixed(2)),
      dieselSale: parseFloat(netDiesel.toFixed(2)),
      petrolAmount,
      dieselAmount,
    });
  }, [salesEntry, readings, testEntry]);

  useEffect(() => {
    if (
      !mobileSaleEntry ||
      Object.keys(mobileSaleEntry).length === 0 ||
      !products?.length
    )
      return;

    let totalMobileAmount = 0;
    const updated = { ...mobileSaleEntry };
    let hasChanges = false;

    Object.entries(mobileSaleEntry).forEach(([key, value]) => {
      if (key.endsWith("-quantity")) {
        const productId = key.split("-")[0];
        const quantity = parseFloat(value || 0);

        const product = products.find((p) => p._id === productId);
        const price = parseFloat(product?.price?.newSellingPrice || 0);

        if (!isNaN(quantity) && !isNaN(price)) {
          const amount = parseFloat((quantity * price).toFixed(2));
          totalMobileAmount += amount;

          if (updated[`${productId}-sold`] !== quantity) {
            updated[`${productId}-sold`] = quantity;
            hasChanges = true;
          }
          if (updated[`${productId}-amount`] !== amount) {
            updated[`${productId}-amount`] = amount;
            hasChanges = true;
          }
        }
      }
    });

    totalMobileAmount = parseFloat(totalMobileAmount.toFixed(2));

    if (updated.totalMobileAmount !== totalMobileAmount) {
      updated.totalMobileAmount = totalMobileAmount;
      hasChanges = true;
    }

    if (
      hasChanges &&
      JSON.stringify(mobileSaleEntry) !== JSON.stringify(updated)
    ) {
      setMobileSaleEntry(updated);
    }
  }, [mobileSaleEntry, products]);

  //handle on testEntry
  const handleTestEntry = (e) => {
    const { name, value } = e.target;

    // Match numbers with up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // If user clears the field
    if (value === "") {
      setTestEntry((prev) => ({
        ...(prev || {}),
        [name]: 0,
      }));
      return;
    }

    // If input is valid per regex
    if (regex.test(value)) {
      setTestEntry((prev) => {
        const prevValue = prev?.[name] ?? 0;

        // If previous value was 0 or empty and user starts typing — replace, not append
        if (prevValue === 0 || prevValue === "") {
          return {
            ...(prev || {}),
            [name]: value.replace(/^0+/, "") || "0", // ensures no leading zeros
          };
        }

        // If no change, return previous state
        if (prevValue === value) return prev;

        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  //Capitalize function
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  //handle Customer Advance
  const handleCustomerAdvance = (e) => {
    e.preventDefault();
    if (
      addDebit?.customerId !== "" &&
      addDebit?.amount !== "" &&
      addDebit?.description !== ""
    ) {
      setAddCustomerAdvance((prev) => [
        ...prev,
        {
          customerId: addDebit.customerId,
          description: addDebit.description,
          amount: addDebit.amount,
        },
      ]);

      setAddDebit({
        customerId: "",
        employeeId: "",
        amount: "",
        description: "",
      });
    } else {
      toast("Fill all the fields of customer advance", {
        position: "top-right",
      });
    }
  };
  //Grouping the machines with products function
  const grouped = {};

  readings.forEach((item) => {
    const key = item.product.toLowerCase();

    if (!grouped[key]) {
      grouped[key] = [];
    }

    // Check if machineId already exists in this product group
    const exists = grouped[key].some((i) => i.machineId === item.machineId);

    if (!exists) {
      grouped[key].push({
        productId: item.productId,
        machineId: item.machineId,
        product: key,
      });
    }
  });

  //Get Current stock from readings data
  const getStockByProduct = (productName) => {
    const match = readings.find(
      (item) => item.product.toLowerCase() === productName.toLowerCase()
    );
    return match ? match.stock : null; // or 0 or "Not found"
  };
  //Get Unit selling price of product from readings data
  const getPriceByProduct = (productName) => {
    const match = readings.find(
      (item) => item.product.toLowerCase() === productName.toLowerCase()
    );
    return match ? match.price : null; // or 0 or "Not found"
  };

  //Handle on Add debit customers
  const handleAddDebit = (e) => {
    e.preventDefault();

    const { customerId, amount, description } = addDebit;
    const newAmount = parseFloat(amount);

    if (customerId !== "" && !isNaN(newAmount) && newAmount > 0) {
      const newObj = {
        uId: uuidv4(),
        customerId,
        amount: newAmount,
        description: description || "",
      };

      setAddCustomerDebit((prev) => [...prev, newObj]);
      setAddDebit({ customerId: "", employeeId: "", amount: "", description: "" });
      // Close modal after adding
      setCustomerPaymentDialog(false);
      toast("Customer debit added successfully", {
        position: "top-right",
        type: "success",
      });
    } else {
      console.warn("Please enter valid customer ID and amount.");
      toast("Please enter valid customer ID and amount", {
        position: "top-right",
        type: "error",
      });
    }
  };
  //handle CUstomer credit
  const handleAddCreditProduct = () => {
    const { customerId, productId, amount, description } = addCreditProduct;

    // Validate inputs
    if (!customerId || !productId || amount <= 0 || !description) {
      toast("Fill all fields first", {
        position: "top-right",
        type: "error",
      });
      return;
    }

    setAddCustomerCreditProduct((prev) => {
      // Make a shallow copy of previous state
      const updated = [...(Array.isArray(prev) ? prev : [])];

      // Check if customer already exists
      const customerIndex = updated.findIndex(
        (c) => c.customerId === customerId
      );

      if (customerIndex !== -1) {
        // Customer exists, push new product to their products array
        updated[customerIndex].products.push({
          productId,
          amount,
          description,
        });
      } else {
        // New customer, create new entry
        updated.push({
          customerId,
          products: [{ productId, amount, description }],
        });
      }

      return updated;
    });

    // Optionally reset the form
    setAddCreditProduct({
      ...addCreditProduct,
      productId: "",
      amount: 0,
      description: "",
    });
  };

  //handle employee debit
  const handleEmployeeDebitCredit = (e, status) => {
    e.preventDefault();
    if (
      addDebit?.employeeId !== "" &&
      addDebit.amount !== "" &&
      status === "debit"
    ) {
      setAddEmployeeDebit((prev) => [
        ...prev,
        {
          employeeId: addDebit.employeeId,
          amount: addDebit.amount,
        },
      ]);

      // Optionally reset the input
      setAddDebit({ employeeId: "", amount: "" });
    } else if (
      addDebit?.employeeId !== "" &&
      addDebit.amount !== "" &&
      status === "credit"
    ) {
      setAddEmployeeCredit((prev) => [
        ...prev,
        {
          employeeId: addDebit.employeeId,
          amount: addDebit.amount,
          description: addDebit.description,
        },
      ]);

      // Optionally reset the input
      setAddDebit({ employeeId: "", amount: "", description: "" });
    }
  };

  //Handle add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();

    const { name, description, amount } = addExpense;

    if (name === "" || description === "" || amount === "") {
      toast("Please fill all the fields", {
        position: "top-right",
        type: "error",
      });
    } else {
      setExpense((prev) => [
        ...prev,
        {
          id: uuidv4(),
          name: name,
          description: description,
          amount: amount,
        },
      ]);

      // Optionally reset the input
      setAddExpense({ name: "", description: "", amount: "" });
    }
  };
  //Handle on remove
  const handleOnRemove = (id, status) => {
    console.log("Check Id in Remove => ", id, status);
    console.log("State of Employee Debit => ", addEmployeeDebit);
    if (id !== "" && status === "customerDebit") {
      let customers = addCustomerDebit.filter((item) => item.uId !== id);

      setAddCustomerDebit(customers);
    } else if (id !== "" && status === "customerCredit") {
      let customers = addCustomerCreditProduct.filter(
        (item) => item.customerId !== id
      );
      setAddCustomerCreditProduct(customers);
    } else if (id !== "" && status === "employeeDebit") {
      let employees = addEmployeeDebit.filter((item) => item.employeeId !== id);
      setAddEmployeeDebit(employees);
    } else if (id !== "" && status === "employeeCredit") {
      let employees = addEmployeeCredit.filter(
        (item) => item.employeeId !== id
      );
      setAddEmployeeCredit(employees);
    } else if (id !== "" && status === "expense") {
      let expenses = expense.filter((item) => item.id !== id);
      setExpense(expenses);
    } else if (id !== "" && status === "customerAdvance") {
      let customers = addCustomerAdvance.filter(
        (item) => item.customerId !== id
      );
      setAddCustomerAdvance(customers);
    }
  };

  //^*********************************STRUCTURING THE READINGS DATA TO GENERATE REPORT ****************************************
  const result = useMemo(() => {
    if (!readings?.length || !products?.length) return null;

    const petrol = [];
    const diesel = [];
    const lubricant = [];

    let petrolTotalAmount = 0;
    let dieselTotalAmount = 0;
    let lubricantTotalAmount = 0;
    let petrolTestEntry = 0;
    let dieselTestEntry = 0;

    const toFloat = (val) => parseFloat(val || 0);

    // Step 1: Identify petrol/diesel machine IDs
    const petrolMachineIds = [];
    const dieselMachineIds = [];

    readings.forEach((reading) => {
      const product = products.find((p) => p._id === reading.productId);
      if (!product) return;
      const type = product.type.toLowerCase();
      if (type === "petrol") petrolMachineIds.push(reading.machineId);
      else if (type === "diesel") dieselMachineIds.push(reading.machineId);
    });

    // Step 2: Process salesEntry
    Object.entries(salesEntry).forEach(([key, value]) => {
      const [machineId, field] = key.split("-");
      if (field !== "newReading") return;

      const reading = readings.find((r) => r.machineId === machineId);
      if (!reading) return;

      const prevReading = toFloat(reading.newReading);
      const newReading = toFloat(value);
      if (newReading === 0 || newReading < prevReading) return;

      const type = petrolMachineIds.includes(machineId)
        ? "petrol"
        : dieselMachineIds.includes(machineId)
        ? "diesel"
        : null;

      if (!type) return;

      const entry = { machineId, newReading };
      const totalAmountKey = `${machineId}-totalAmount`;
      const totalAmount = toFloat(salesEntry[totalAmountKey]);

      if (type === "petrol") {
        petrol.push(entry);
        petrolTotalAmount += totalAmount;
      } else {
        diesel.push(entry);
        dieselTotalAmount += totalAmount;
      }
    });

    // Step 3: Subtract test sales
    const petrolProduct = products.find(
      (p) => p.type.toLowerCase() === "petrol"
    );
    const dieselProduct = products.find(
      (p) => p.type.toLowerCase() === "diesel"
    );

    const petrolPrice = toFloat(petrolProduct?.price?.newSellingPrice) || 0;
    const dieselPrice = toFloat(dieselProduct?.price?.newSellingPrice) || 0;

    const petrolTestQty = toFloat(testEntry.petrol);
    const dieselTestQty = toFloat(testEntry.diesel);

    petrolTotalAmount -= petrolTestQty * petrolPrice;
    dieselTotalAmount -= dieselTestQty * dieselPrice;

    //Setting test entries for backend
    petrolTestEntry = parseFloat(petrolTestQty).toFixed(2);
    dieselTestEntry = parseFloat(dieselTestQty).toFixed(2);
    // Step 4: Lubricant sales from mobileSaleEntry
    Object.entries(mobileSaleEntry).forEach(([key, value]) => {
      const isStandard = key.endsWith("-quantity");
      const isDrum = key.endsWith("-drum-quantity");

      if (!isStandard && !isDrum) return;
      if (!value || isNaN(value)) return;

      const quantity = toFloat(value);
      if (quantity < 0) return;

      const productId = key.split("-")[0];
      lubricant.push({ productId, quantity: value });

      const amountKey = `${productId}-amount`;
      const amount = toFloat(mobileSaleEntry[amountKey]);
      if (!isNaN(amount)) lubricantTotalAmount += amount;
    });

    // ✅ Return final sale summary
    return {
      petrol,
      diesel,
      lubricant,
      petrolMachines: petrolMachineIds.length,
      dieselMachines: dieselMachineIds.length,
      petrolTotalAmount,
      dieselTotalAmount,
      lubricantTotalAmount,
      petrolTestEntry,
      dieselTestEntry,
    };
  }, [salesEntry, testEntry, readings, products, mobileSaleEntry]);

  //^*********************************END STRUCTURING THE READINGS DATA TO GENERATE REPORT ****************************************

  function calculateTotals(state) {
    if (!Array.isArray(state) || state.length === 0) return {};

    const data = state[0];

    const {
      bankAmount = 0,
      customer = [],
      employees = [],
      products = [{}],
      expenses = [],
    } = data;

    const customerData = customer[0] || {};
    const employeeData = employees[0] || {};

    const {
      petrolTotalAmount = 0,
      dieselTotalAmount = 0,
      lubricantTotalAmount = 0,
    } = products[0] || {};

    const totalSaleAmount =
      petrolTotalAmount + dieselTotalAmount + lubricantTotalAmount;

    const totalCustomerDebit = (customerData.debits || []).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const totalCustomerAdvance = (customerData.advances || []).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const totalCustomerCredit = (customerData.credits || []).reduce(
      (sum, credit) => {
        const productTotal = (credit.products || []).reduce(
          (sub, p) => sub + parseFloat(p.amount || 0),
          0
        );
        return sum + productTotal;
      },
      0
    );

    const totalEmployeeDebit = (employeeData.debits || []).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const totalEmployeeCredit = (employeeData.credits || []).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0
    );

    const totalBankAmount = parseFloat(bankAmount || 0);

    const totalDebit = totalCustomerDebit + totalEmployeeDebit;
    const totalCredit = totalCustomerCredit + totalEmployeeCredit;

    const cashInHand =
      totalSaleAmount +
      totalDebit -
      (totalCredit + totalExpenses + totalBankAmount + totalCustomerAdvance);

    // ✅ Round all values to 2 decimal places
    const round = (val) => parseFloat(val.toFixed(2));

    const roundToInteger = (value) => Math.round(+value || 0);

    //Set Cash in hand
    setState((prevState) => ({
      ...prevState,
      cashInHand: roundToInteger(cashInHand),
    }));

    return {
      petrolTotalAmount: round(petrolTotalAmount),
      dieselTotalAmount: round(dieselTotalAmount),
      lubricantTotalAmount: round(lubricantTotalAmount),
      totalCustomerDebit: round(totalCustomerDebit),
      totalCustomerCredit: round(totalCustomerCredit),
      totalCustomerAdvance: round(totalCustomerAdvance),
      totalEmployeeDebit: round(totalEmployeeDebit),
      totalEmployeeCredit: round(totalEmployeeCredit),
      totalBankAmount: round(totalBankAmount),
      totalExpenses: round(totalExpenses),
      totalDebit: round(totalDebit),
      totalCredit: round(totalCredit),
      totalSaleAmount: round(totalSaleAmount),
      cashInHand: round(cashInHand),
    };
  }

  //Handle On Generate Report Function
  const handleOnGenerateSummary = (e) => {
    e.preventDefault();

    if (dip.petrolDip === "") {
      toast("Petrol dip is not entered ", {
        position: "top-right",
        type: "error",
      });
    } else if (dip.dieselDip === "") {
      toast("Diesel dip is not entered", {
        position: "top-right",
        type: "error",
      });
    } else if (dip.date === "") {
      toast("Date is not selected", { position: "top-right", type: "error" });
    } else if (result?.petrol.length !== result?.petrolMachines) {
      toast("Some petrol readings are missing or less than last readings", {
        position: "top-right",
        type: "error",
      });
    } else if (result?.diesel.length !== result?.dieselMachines) {
      toast("Some diesel readings are missing or less than last readings", {
        position: "top-right",
        type: "error",
      });
    // Lubricants are optional - only validate if user has entered some but not all
    // Allow either all entries or no entries
    } else if (
      products.filter((product) => product?.type?.toLowerCase() === "mobile")
        .length > 0 &&
      result?.lubricant.length > 0 &&
      result?.lubricant.length <
      products.filter((product) => product?.type?.toLowerCase() === "mobile")
        .length
    ) {
      toast("If entering lubricant quantities, please enter for all lubricants or leave all empty", {
        position: "top-right",
        type: "error",
      });
    } else {
      //Restructured dips data
      let newDips = {
        petrol: {
          dip: dip.petrolDip,
          litres: dipCalculations.petrol,
        },
        diesel: {
          dip: dip.dieselDip,
          litres: dipCalculations.diesel,
        },
      };

      //Collected products data
      let products = { ...result };

      //Restructured the customers data
      let customers = {
        debits: [...addCustomerDebit],
        credits: [...addCustomerCreditProduct],
        advances: [...addCustomerAdvance],
      };

      //Restructured the employees data
      let employees = {
        debits: [...addEmployeeDebit],
        credits: [...addEmployeeCredit],
      };

      const updatedState = {
        userId: user._id,
        dips: [newDips],
        products: [products],
        customer: [customers],
        employees: [employees],
        expenses: [...expense],
        date: dip.date,
        bankAmount: state.bankAmount || 0,
      };

      setState(updatedState);
      setTotals(calculateTotals([updatedState]));
      setDisableClose(false)
    }
  };

  //Handle on Clear State function
  const handleOnClearState = (e) => {
    e.preventDefault();

    //Clear state
    setState({
      userId: "",
      dips: [],
      products: [],
      customer: [],
      employees: [],
      expenses: [],
      bankAmount: "",
      date: "",
    });

    // //Clear the set totals state
    setTotals({});

    //Set Dip Entries clear
    setDip({
      petrolDip: "",
      dieselDip: "",
      date: "",
    });

    //Set Dip calculations Clear
    setDipCalculations({
      petrol: 0,
      diesel: 0,
    });

    //Set Sales entry clear to clear all readings
    setSalesEntry("");

    //Set Mobile Sale Entry clear to clear all quantities of mobile Oil
    setMobileSaleEntry("");

    //Set Net Sale
    setNetSale({
      petrolSale: 0,
      dieselSale: 0,
      petrolAmount: 0,
      dieselAmount: 0,
    });

    //Set Test Entry
    setTestEntry({
      petrol: 0,
      diesel: 0,
    });

    //Clear Customer debit
    setAddCustomerDebit([]);
    //Clear Customers credit
    setAddCustomerCreditProduct([]);

    //Set Employees debit clear
    setAddEmployeeDebit([]);
    //Set Add Employee credit clear
    setAddEmployeeCredit([]);
    //Clear expense state
    setExpense([]);
  };

  const handleOnUnlockState = (e) => {
    e.preventDefault();

    //Clear state
    setState({
      userId: "",
      dips: [],
      products: [],
      customer: [],
      employees: [],
      expenses: [],
      bankAmount: "",
      cashInHand: "",
      date: "",
    });

    // //Clear the set totals state
    setTotals({});
  };
  //Creating on submit function
  const handleOnSubmit = (e) => {
    e.preventDefault();

    setDisableClose(true)
    setTimeout(() => {
      dispatch(addClosing(state));
    }, 3000);
  };

 
  let selectedRowId = 0;

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Modern Header */}
      <Box sx={{ mb: 4 }}>
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
          <Receipt sx={{ fontSize: 32 }} />
          Add Shift Record
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete shift closing information and generate summary report
        </Typography>
      </Box>

      {/* Basic info section starts from here  */}
      <Box 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Store sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Basic Information
          </Typography>
        </Box>
        <GridForm
          title="Add New Reading"
          inputs={shiftClosingForm(dipCalculations, totals)}
          state={dip}
          setState={setDip}
          submit={handleOnSubmit}
        />
      </Box>
      {/* Basic info section ends here  */}
      
      {/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& PRODUCTS ENTRY SECTION &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}
      <Box 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Widgets sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Products Entry
          </Typography>
        </Box>
        {Object.entries(grouped)
          .sort(([a], [b]) => {
            // Ensure petrol comes first, diesel second, others last (if any)
            if (a.toLowerCase() === "petrol") return -1;
            if (b.toLowerCase() === "petrol") return 1;
            if (a.toLowerCase() === "diesel") return -1;
            if (b.toLowerCase() === "diesel") return 1;
            return a.localeCompare(b); // fallback alphabetical
          })
          .map(([productName], index) => (
            <Box 
              key={index}
              sx={{ 
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                border: '1px solid #e0e0e0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <Grid container spacing={2}>
                <Grid
                  item
                  lg={2}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {capitalizeWords(productName)}
                    </span>
                    <span>{`Lt. ${getStockByProduct(productName)}`}</span>
                    <span>
                      {getPriceByProduct(productName).toLocaleString("en-US", {
                        style: "currency",
                        currency: "PKR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </Grid>
                <Grid item lg={10}>
                  {readings.map((item) => {
                    if (item.product.toLowerCase() === productName) {
                      return (
                        <GridForm
                          key={item.machineId}
                          title={`Add New Reading`}
                          inputs={shiftproductsClosingForm(item, totals)}
                          state={salesEntry}
                          setState={setSalesEntry}
                          submit={handleOnSubmit}
                        />
                      );
                    }
                  })}
                  <Grid
                    container
                    style={{ marginTop: 10, alignItems: "center" }}
                  >
                    <Grid item lg={2}>
                      <span style={{ fontWeight: "bold" }}>
                        Total Calculations
                      </span>
                    </Grid>
                    <Grid item lg={3}>
                      <TextField
                        label="Total Dispensed Fuel"
                        size="small"
                        name={`${productName}`}
                        disabled
                        value={parseFloat(totalSaleSum[productName])?.toFixed(
                          2
                        )}
                        style={{ marginRight: 10 }}
                      />
                    </Grid>
                    <Grid item lg={3}>
                      <TextField
                        label="Fuel Test"
                        size="small"
                        disabled={
                          Object.entries(totals).length !== 0 ? true : false
                        }
                        name={`${productName}`}
                        onChange={handleTestEntry}
                        value={testEntry[productName]}
                        style={{ marginRight: 7, marginLeft: 7 }}
                      />
                    </Grid>
                    <Grid item lg={2}>
                      <TextField
                        label="Total Sale"
                        disabled
                        size="small"
                        name="productTest"
                        value={netSale[`${productName}Sale`]}
                        style={{ marginRight: 4, marginLeft: 10 }}
                      />
                    </Grid>
                    <Grid item lg={2} style={{ paddingleft: 20 }}>
                      <TextField
                        label="Total Sale Amount"
                        disabled
                        size="small"
                        name="productTest"
                        value={netSale[`${productName}Amount`]}
                        style={{ marginRight: 1, marginLeft: 11 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item lg={3}></Grid>
              </Grid>
            </Box>
          ))}
        {/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& END OF MACHINE PRODUCTS ENTRY &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}

        {/* £££££££££££££££££££££££££££££££££££ MOBILE OIL PRODUCTS ENTRY SECTION £££££££££££££££££££££££££££££  */}
        <Box 
          sx={{ 
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}
        >
          {products
            .filter(
              (item) =>
                item.type.toLowerCase() !== "petrol" &&
                item.type.toLowerCase() !== "diesel"
            )
            .sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn)) // Sort by createdOn ascending
            .map((item) => (
              <GridForm
                key={item._id}
                title={`Add New Reading`}
                inputs={shiftmobileOilsClosingForm(item, totals)}
                state={mobileSaleEntry}
                setState={setMobileSaleEntry}
                submit={handleOnSubmit}
              />
            ))}

          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <TextField
              label="Total Amount"
              size="small"
              disabled
              name={`totalAmount`}
              onChange={handleTestEntry}
              value={
                mobileSaleEntry.totalMobileAmount
                  ? mobileSaleEntry.totalMobileAmount
                  : 0
              }
            />
          </Box>
        </Box>
      </Box>
      {/* £££££££££££££££ &&&&&&&&&&&&&&&&&&& END OF PRODUCT OILY AND MACHINE &&&&&&&&&&&&&&&&££££££££££££££££££££ */}

      {/* ********************************** START OF DEBIT AND CREDIT SECTION **********************************  */}
      <Box 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        {/* Add OR Update Customer Dialog Box  */}
        <FormDialog
          openFormDialog={customerPaymentDialog}
          setOpenFormDialog={setCustomerPaymentDialog}
          heading={"ADD CUSTOMER PAYMENT"}
          color="#999999"
          state={addDebit}
          Id={selectedRowId}
          setState={setAddDebit}
          handleOnClose={() => setCustomerPaymentDialog(false)}
          handleOnSubmit={handleAddDebit}
          inputs={activeCustomerInputFields(customers || [])}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />

        {/* Employee Debit Dialog Box  */}
        <FormDialog
          openFormDialog={employeeDebitDialog}
          setOpenFormDialog={setEmployeeDebitDialog}
          heading={"STAFF DEBIT ADVANCE"}
          color="#999999"
          state={addDebit}
          Id={selectedRowId}
          setState={setAddDebit}
          handleOnClose={() => setEmployeeDebitDialog(false)}
          handleOnSubmit={(e) => handleEmployeeDebitCredit(e, "debit")}
          inputs={activeEmployeeDebitInputFields(employees || [])}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />

        {/* Employee CREDIT Dialog Box  */}
        <FormDialog
          openFormDialog={employeeCreditDialog}
          setOpenFormDialog={setEmployeeCreditDialog}
          heading={"STAFF CREDIT ADVANCE"}
          color="#999999"
          state={addDebit}
          Id={selectedRowId}
          setState={setAddDebit}
          handleOnClose={() => setEmployeeCreditDialog(false)}
          handleOnSubmit={(e) => handleEmployeeDebitCredit(e, "credit")}
          inputs={activeEmployeeCreditInputFields(employees || [])}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />

        {/* Customer Advance Dialog Box  */}
        <FormDialog
          openFormDialog={customerAdvanceDialog}
          setOpenFormDialog={setCustomerAdvanceDialog}
          heading={"CUSTOMER ADVANCE"}
          color="#999999"
          state={addDebit}
          Id={selectedRowId}
          setState={setAddDebit}
          handleOnClose={() => setCustomerAdvanceDialog(false)}
          handleOnSubmit={(e) => handleCustomerAdvance(e)}
          inputs={activeCustomerAdvanceInputFields(customers || [])}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />

        {/* Expense Dialog Box  */}
        <FormDialog
          openFormDialog={expenseOpen}
          setOpenFormDialog={setExpenseOpen}
          heading={"ADD EXPENSE"}
          color="#999999"
          state={addExpense}
          Id={selectedRowId}
          setState={setAddExpense}
          handleOnClose={() => setExpenseOpen(false)}
          handleOnSubmit={(e) => handleAddExpense(e)}
          inputs={expenseInputFields}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />

        <ShiftDialog
          openDetailsDialog={customerCreditDialog}
          heading={"Add Customer Credit"}
          inputs={activeCustomerCreditInputFields(
            customers || [],
            handleAddCreditProduct,
            products || [],
            addCustomerCreditProduct,
            addCreditProduct
          )}
          data={addCustomerCreditProduct}
          state={addCreditProduct}
          products={products || []}
          setState={setAddCreditProduct}
          icon={<Assessment style={{ marginRight: "10px" }} />}
          handleOnCloseDetails={() => setCustomerCreditDialog(false)}
        />

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Debit and Credit Entry
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={6} style={{ paddingTop: 40 }}>
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f0f9f4',
                border: '1px solid #07bc58',
                height: '100%',
                minHeight: 300
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log('Customer Debit clicked', { customers: customers?.length, totals });
                  setCustomerPaymentDialog(true);
                }}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                startIcon={<AddOutlined />}
                sx={{
                  mb: 2,
                  backgroundColor: "#07bc58",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": {
                    backgroundColor: "#12cf6a",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Customer Debit
              </Button>
              {/* Iterating the added debits  */}
              <Box>
                {addCustomerDebit.length > 0 &&
                  addCustomerDebit.map((item) => {
                    return (
                      <Box
                        key={uuidv4()}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1.5,
                          backgroundColor: "#daeade",
                          borderRadius: 1,
                          mt: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#c8e6d3',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <Typography>
                          {`${customers.find((element) => element._id === item.customerId)?.name || ""}${item.description ? " - " + item.description : ""}`}
                        </Typography>
                        <Typography>
                          {item.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleOnRemove(item.uId, "customerDebit")
                          }
                          aria-label="remove-debit"
                          disabled={
                            Object.entries(totals).length !== 0 ? true : false
                          }
                        >
                          <Cancel style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: "100%",
                    pr: 2,
                    pt: 2,
                    pb: 1,
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    Total:{" "}
                    {addCustomerDebit.reduce((total, item) => {
                      return total + parseFloat(item.amount || 0);
                    }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} lg={6} sx={{ pt: 5 }}>
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fffbf0',
                border: '1px solid #f7aa03',
                height: '100%',
                minHeight: 300
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log('Customer Credit clicked', { customers: customers?.length, products: products?.length });
                  setCustomerCreditDialog(true);
                }}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                startIcon={<AddOutlined />}
                sx={{
                  mb: 2,
                  backgroundColor: "#f7aa03",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": {
                    backgroundColor: "#ffbd33",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Customer Credit
              </Button>
              <Box>
                {Array.isArray(addCustomerCreditProduct) &&
                  addCustomerCreditProduct.length > 0 &&
                  addCustomerCreditProduct.map((item, index) => {
                    const customer = customers.find(
                      (c) => c._id === item.customerId
                    );
                    const customerName = customer
                      ? customer.name
                      : "Unknown Customer";

                    const totalAmount = Array.isArray(item.products)
                      ? item.products.reduce(
                          (sum, p) => sum + parseFloat(p.amount || 0),
                          0
                        )
                      : 0;

                    return (
                      <Box
                        key={`customer-credit-${index}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1.5,
                          backgroundColor: "#faebc9",
                          borderRadius: 1,
                          mt: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#f5e0b8',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <Typography>{customerName}</Typography>
                        <Typography>
                          {totalAmount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleOnRemove(item.customerId, "customerCredit")
                          }
                          aria-label="remove-debit"
                          disabled={
                            Object.entries(totals).length !== 0 ? true : false
                          }
                        >
                          <Cancel style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: "100%",
                    pr: 2,
                    pt: 2,
                    pb: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    Total:{" "}
                    {addCustomerCreditProduct.reduce((total, customer) => {
                      const customerTotal = customer.products.reduce(
                        (sum, product) => {
                          return sum + parseFloat(product.amount || 0);
                        },
                        0
                      );
                      return total + customerTotal;
                    }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f0f5ff',
                border: '1px solid #3f88f5',
                height: '100%',
                minHeight: 300
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log('Customer Advance clicked', { customers: customers?.length });
                  setCustomerAdvanceDialog(true);
                }}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                startIcon={<AddOutlined />}
                sx={{
                  mb: 2,
                  backgroundColor: "#3f88f5",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": {
                    backgroundColor: "#4f91f5",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Customer Advance
              </Button>
              {/* Iterating the added debits  */}
              <Box>
                {addCustomerAdvance.length > 0 &&
                  addCustomerAdvance.map((item) => {
                    return (
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 5,
                          backgroundColor: "#cadffb",
                          borderRadius: "3px",
                          marginTop: "5px",
                        }}
                      >
                        <Typography>
                          {
                            customers.find(
                              (element) => element._id === item.customerId
                            )?.name
                          }
                        </Typography>
                        <Typography>
                          {parseFloat(item.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleOnRemove(item.customerId, "customerAdvance")
                          }
                          aria-label="remove-debit"
                          disabled={
                            Object.entries(totals).length !== 0 ? true : false
                          }
                        >
                          <Cancel style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: "100%",
                    pr: 2,
                    pt: 2,
                    pb: 1,
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    Total:{" "}
                    {addCustomerAdvance.reduce((total, item) => {
                      return total + parseFloat(item.amount || 0);
                    }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fff5f3',
                border: '1px solid #eb6955',
                height: '100%',
                minHeight: 300
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log('Expense clicked', { expenseOpen });
                  setExpenseOpen(true);
                }}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                startIcon={<AddOutlined />}
                sx={{
                  mb: 2,
                  backgroundColor: "#eb6955",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": {
                    backgroundColor: "#f17d6d",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Expense
              </Button>
              {/* Iterating the added debits  */}
              <Box>
                {expense?.length > 0 &&
                  expense.map((item) => {
                    return (
                      <Box
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 5,
                          backgroundColor: "#ffe0dc",
                          borderRadius: "3px",
                          marginTop: "5px",
                        }}
                      >
                        <Typography>{item.name}</Typography>
                        <Typography>
                          {parseFloat(item.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <IconButton
                          onClick={() => handleOnRemove(item.id, "expense")}
                          aria-label="remove-debit"
                          disabled={
                            Object.entries(totals).length !== 0 ? true : false
                          }
                        >
                          <Cancel style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: "100%",
                    p: 2,
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    Total:{" "}
                    {expense.reduce((total, item) => {
                      return total + parseFloat(item.amount || 0);
                    }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ############################################## STAFF DEBIT CREDIT ################################################ */}
      <Box 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Staff Advance Entry
          </Typography>
        </Box>
        <Grid container>
          <Grid
            item
            lg={6}
            md={6}
            sm={12}
            xs={12}
            sx={{ mt: 3, pr: 2 }}
          >
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f0f9f4',
                border: '1px solid #07bc58',
                height: '100%',
                minHeight: 250
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log('Staff Debit clicked', { employees: employees?.length });
                  setEmployeeDebitDialog(true);
                }}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                startIcon={<AddOutlined />}
                sx={{
                  mb: 2,
                  backgroundColor: "#07bc58",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": {
                    backgroundColor: "#12cf6a",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Staff Debit
              </Button>
              {/* Iterating the added debits  */}
              <Box>
                {addEmployeeDebit.length > 0 &&
                  addEmployeeDebit.map((item) => {
                    return (
                      <Box
                        key={item.employeeId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 5,
                          backgroundColor: "#daeade",
                          borderRadius: "3px",
                          marginTop: "5px",
                        }}
                      >
                        <Typography>
                          {
                            employees.find(
                              (element) => element._id === item.employeeId
                            )?.name
                          }
                        </Typography>
                        <Typography>
                          {parseFloat(item.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleOnRemove(item.employeeId, "employeeDebit")
                          }
                          aria-label="remove-debit"
                          disabled={
                            Object.entries(totals).length !== 0 ? true : false
                          }
                        >
                          <Cancel style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: "100%",
                    pr: 2,
                    pt: 2,
                    pb: 1,
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    Total:{" "}
                    {addEmployeeDebit.reduce((total, item) => {
                      return total + parseFloat(item.amount || 0);
                    }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 3 }}>
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f0f5ff',
                border: '1px solid #3f88f5',
                height: '100%',
                minHeight: 250
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  console.log('Staff Advance clicked', { employees: employees?.length });
                  setEmployeeCreditDialog(true);
                }}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                startIcon={<AddOutlined />}
                sx={{
                  mb: 2,
                  backgroundColor: "#3f88f5",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": {
                    backgroundColor: "#4f91f5",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                Staff Advance
              </Button>
              {/* Iterating the added debits  */}
              <Box>
                {addEmployeeCredit.length > 0 &&
                  addEmployeeCredit.map((item) => {
                    return (
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 5,
                          backgroundColor: "#cadffb",
                          borderRadius: "3px",
                          marginTop: "5px",
                        }}
                      >
                        <Typography>
                          {
                            employees.find(
                              (element) => element._id === item.employeeId
                            )?.name
                          }
                        </Typography>
                        <Typography>
                          {parseFloat(item.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleOnRemove(item.employeeId, "employeeCredit")
                          }
                          aria-label="remove-debit"
                          disabled={
                            Object.entries(totals).length !== 0 ? true : false
                          }
                        >
                          <Cancel style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: "100%",
                    pr: 2,
                    pt: 2,
                    pb: 1,
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    Total:{" "}
                    {addEmployeeCredit.reduce((total, item) => {
                      return total + parseFloat(item.amount || 0);
                    }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* ********************************* END OF DEBIT AND CREDIT SECTION ************************************  */}
      <Box 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Bank Amount
          </Typography>
        </Box>
        <Box
          sx={{ 
            p: 2,
            borderRadius: 2,
            backgroundColor: '#f0f5ff',
            border: '1px solid #3f88f5'
          }}
        >
          <TextField
            label="Bank Amount"
            size="small"
            name="bankAmount"
            fullWidth
            style={{ marginTop: 5 }}
            disabled={Object.entries(totals).length !== 0 ? true : false}
            value={state.bankAmount ? state.bankAmount : 0}
            onChange={(e) => {
              let { name, value } = e.target;

              // Allow only valid numbers with optional decimal point and up to 2 decimal places
              const regex = /^\d*\.?\d{0,2}$/;

              // Remove leading zeros unless it's '0' or starts with '0.'
              if (
                value.startsWith("0") &&
                !value.startsWith("0.") &&
                value.length > 1
              ) {
                value = value.replace(/^0+/, "");
              }

              // Apply regex validation
              if (value === "" || regex.test(value)) {
                setState({ ...state, [name]: value });
              }
            }}
          />
        </Box>
      </Box>
      <Box 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Summary Report
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: 3,
            borderRadius: 2,
            backgroundColor: '#fafafa',
            border: '1px solid #e0e0e0'
          }}
        >
          <Grid container>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SUMMARY SECTION AND SUBMIT ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <Grid
              item
              lg={6}
              md={6}
              sm={12}
              xs={12}
              style={{ paddingRight: 10 }}
            >
              <div className="summaryBody flex justify-between ">
                <div className="fieldName">
                  <p>Petrol:</p>
                  <p>Diesel:</p>
                  <p>Lubricant:</p>
                </div>

                <div className="fieldValue ">
                  <p>
                    {totals?.petrolTotalAmount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    {totals?.dieselTotalAmount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    {totals?.lubricantTotalAmount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <hr />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#c2d7f7",
                }}
              >
                <Typography style={{ fontWeight: "bold" }}>
                  Total Sale Amount:
                </Typography>
                <Typography style={{ fontWeight: "bold" }}>
                  {totals?.totalSaleAmount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </div>

              <div className="summaryBody flex justify-between ">
                <div className="fieldName">
                  <p>Customer Debit:</p>
                  <p>Staff Debit:</p>
                </div>
                <div className="fieldValue">
                  <p>
                    {totals?.totalCustomerDebit?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    {totals?.totalEmployeeDebit?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <hr />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#daeade",
                }}
              >
                <Typography style={{ fontWeight: "bold" }}>
                  Total Recovery:
                </Typography>
                <Typography style={{ fontWeight: "bold" }}>
                  {totals?.totalDebit?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </div>
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              sm={12}
              xs={12}
              sx={{ 
                pl: 2, 
                borderLeft: "3px solid #1976d2",
                '@media (max-width: 960px)': {
                  borderLeft: 'none',
                  borderTop: '3px solid #1976d2',
                  pt: 2,
                  mt: 2
                }
              }}
            >
              <div className="summaryBody flex justify-between">
                <div className="fieldName">
                  <p>Customer Credit:</p>
                  <p>Customer Advance:</p>
                  <p>Staff Advance:</p>
                </div>
                <div className="fieldValue">
                  <p>
                    {totals?.totalCustomerCredit?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    {totals?.totalCustomerAdvance?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    {totals?.totalEmployeeCredit?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <hr />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#faebc9",
                }}
              >
                <Typography style={{ fontWeight: "bold", paddingLeft: 1 }}>
                  Total Credit:
                </Typography>
                <Typography style={{ fontWeight: "bold", paddingRight: 1 }}>
                  {totals?.totalCredit?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </div>
              <div className="summaryBody flex justify-between">
                <div className="fieldName">
                  <p>Bank Amount:</p>
                </div>
                <div className="fieldValue">
                  <p>
                    {totals?.totalBankAmount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <hr style={{ fontWeight: "800" }} />
              <div
                className="summaryBody flex justify-between"
                style={{ backgroundColor: "#ffe0dc" }}
              >
                <div className="fieldName">
                  <p style={{ fontWeight: "bold", paddingLeft: 1 }}>Expense:</p>
                </div>
                <div className="fieldValue font-bold">
                  <p style={{ fontWeight: "bold", paddingRight: 1 }}>
                    {totals?.totalExpenses?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>

          <Box style={{ marginTop: 20 }}>
            <div
              className="summaryBody flex justify-between"
              style={{ backgroundColor: "#daeade", padding: 5 }}
            >
              <div className="fieldName">
                <p style={{ fontWeight: "bold", paddingLeft: 5 }}>
                  Cash In Hand:
                </p>
              </div>
              <div className="fieldValue">
                <p style={{ fontWeight: "bold", paddingRight: 5 }}>
                  {totals?.cashInHand?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ACTIONS OF SUMMARY $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
            <Box 
              sx={{ 
                mt: 3,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <Button
                variant="outlined"
                size="medium"
                startIcon={<SyncDisabled />}
                disabled={Object.entries(totals).length === 0 ? false : true}
                onClick={(e) => handleOnClearState(e)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Clear
              </Button>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<LockOpen />}
                disabled={Object.entries(totals).length !== 0 ? false : true}
                onClick={(e) => handleOnUnlockState(e)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Unlock
              </Button>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Loop />}
                onClick={(e) => handleOnGenerateSummary(e)}
                disabled={Object.entries(totals).length !== 0 ? true : false}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
              >
                Generate Summary
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<EnhancedEncryption />}
                disabled={disableClose ? true : false}
                onClick={(e) => handleOnSubmit(e)}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  backgroundColor: '#2e7d32',
                  '&:hover': { backgroundColor: '#1b5e20' },
                  px: 4
                }}
              >
                Close Sale
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddShift;
