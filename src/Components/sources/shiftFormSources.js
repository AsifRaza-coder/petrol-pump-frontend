import { DOMAIN } from "../../backend/API";

//ADD shift closing fields
export const shiftClosingForm = (dipCalutions, totals) => [
  {
    id: 1,
    label: "Petrol Dip",
    type: "number",
    disabled: Object.entries(totals)?.length !== 0 ? true : false,
    name: "petrolDip",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 2,
    label: `${dipCalutions.petrol} Litres`,
    type: "label",
    name: "name",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 3,
    label: "Diesel Dip",
    type: "number",
    name: "dieselDip",
    disabled: Object.entries(totals)?.length !== 0 ? true : false,
    size: "small",
    minWidth: "100wh",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 4,
    label: `${dipCalutions.diesel} Litres`,
    type: "label",
    name: "name",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 5,
    label: "Date",
    type: "date",
    disabled: Object.entries(totals)?.length !== 0 ? true : false,
    name: "date",
    grid: {
      xs: 12,
      sm: 12,
      md: 4,
      lg: 4,
    },
  },
];

export const shiftproductsClosingForm = (item, totals) => [
  {
    id: 1,
    label: item.machine,
    type: "label",
    name: "name",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 2,
    label: "Last Reading",
    type: "number",
    disabled: true,
    value: item?.newReading,
    name: `${item.machineId}-prevReading`,
    grid: {
      xs: 12,
      sm: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    id: 3,
    label: "Today's Reading",
    type: "number",
    disabled: Object.entries(totals)?.length !== 0 ? true : false,
    name: `${item.machineId}-newReading`,
    grid: {
      xs: 12,
      sm: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    id: 4,
    label: "Total Sale",
    type: "number",
    disabled: true,
    name: `${item.machineId}-totalSale`,
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 5,
    label: "Sale Amount",
    type: "number",
    disabled: true,
    name: `${item.machineId}-totalAmount`,
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
];
export const shiftmobileOilsClosingForm = (item, totals) => [
  {
    id: 1,
    label: item.name,
    type: "label",
    name: "prevReading",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 2,
    label: `Qt. ${item.stock}`,
    type: "label",
    name: "prevReading",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 3,
    label: `${item.price.newSellingPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    type: "label",
    name: "prevReading",
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 4,
    label: "Quantity",
    type: "number",
    disabled: Object.entries(totals)?.length !== 0 ? true : false,
    name: item.name.toLowerCase().includes("drum")
      ? `${item._id}-drum-quantity`
      : `${item._id}-quantity`,
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 5,
    label: "Total Sale",
    type: "number",
    name: `${item._id}-sold`,
    disabled: true,
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
  {
    id: 6,
    label: "Sale Amount",
    type: "number",
    disabled: true,
    name: `${item._id}-amount`,
    grid: {
      xs: 12,
      sm: 12,
      md: 2,
      lg: 2,
    },
  },
];

//Add new customer form fields
export const activeCustomerInputFields = (customers) => [
  {
    id: 1,
    label: "Customer",
    type: "select",
    name: "customerId",
    options:
      customers && customers.length > 0
        ? customers.map((item) => ({
            id: item._id,
            name: item.name,
            value: item._id,
            avatarUrl: `${DOMAIN}/public/customers/images/${item.pic}`,
            avatarAlt: "./img/avatarfile.png",
            salary: item.balance?.toLocaleString("en-US", {
              style: "currency",
              currency: "PKR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "PKR 0.00",
          }))
        : [],
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Balance",
    tabIndex: 3,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Description",
    tabIndex: 4,
    type: "text",
    name: "description",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },

  {
    id: 7,
    label: "ADD CUSTOMER DEBIT",
    type: "button",
    tabIndex: 6,
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
];

//Add new customer form fields
export const activeCustomerCreditInputFields = (
  customers,
  handleAddCreditProduct,
  products,
  addCustomerCreditProduct,
  addCreditProduct
) => [
  {
    id: 1,
    label: "Customer",
    type: "select",
    name: "customerId",
    options:
      customers && customers.length > 0
        ? customers.map((item) => ({
            id: item._id,
            name: item.name,
            value: item._id,
            avatarUrl: `${DOMAIN}/public/customers/images/${item.pic}`,
            avatarAlt: "./img/avatarfile.png",
            salary: item.balance?.toLocaleString("en-US", {
              style: "currency",
              currency: "PKR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "PKR 0.00",
          }))
        : [],
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Product",
    type: "select",
    name: "productId",
    options:
      products && products.length > 0
        ? products
            .map((item) => ({
              id: item._id,
              name: item.name,
              value: item._id,
            }))
        : [],
    // Debug: Log products count
    // console.log('Customer Credit Products:', products?.length, products),
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Amount",
    tabIndex: 3,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 4,
    label: "Description",
    tabIndex: 3,
    type: "text",
    name: "description",
    grid: {
      xs: 12,
      sm: 12,
      md: 10,
      lg: 10,
    },
  },

  {
    id: 6,
    label: "ADD",
    type: "button",
    tabIndex: 6,
    btnFunc: handleAddCreditProduct,
    color: "primary",
    variant: "contained",
    grid: {
      xs: 2,
      sm: 2,
      md: 10,
      lg: 10,
    },
  },
];

//Add new staff form fields
export const activeEmployeeDebitInputFields = (employees) => [
  {
    id: 1,
    label: "Staff",
    type: "select",
    name: "employeeId",
    options:
      employees && employees.length > 0
        ? employees.map((item) => ({
            id: item._id,
            name: item.name,
            value: item._id,
            salary: item.advance?.toLocaleString("en-US", {
              style: "currency",
              currency: "PKR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "PKR 0.00",
          }))
        : [],
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Amount",
    tabIndex: 3,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },

  {
    id: 7,
    label: "ADD Staff AdvANCE",
    type: "button",
    tabIndex: 6,
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
];
//Add new Employee form fields
export const activeEmployeeCreditInputFields = (employees) => [
  {
    id: 1,
    label: "Staff",
    type: "select",
    name: "employeeId",
    options:
      employees && employees.length > 0
        ? employees.map((item) => ({
            id: item._id,
            name: item.name,
            value: item._id,
            salary: item.advance?.toLocaleString("en-US", {
              style: "currency",
              currency: "PKR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "PKR 0.00",
          }))
        : [],
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Description",
    tabIndex: 3,
    type: "text",
    name: "description",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Amount",
    tabIndex: 3,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },

  {
    id: 7,
    label: "ADD Credit AdvANCE",
    type: "button",
    tabIndex: 6,
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
];
//Add new Employee form fields
export const activeCustomerAdvanceInputFields = (customers) => [
  {
    id: 1,
    label: "Customer",
    type: "select",
    name: "customerId",
    options:
      customers && customers.length > 0
        ? customers.map((item) => ({
            id: item._id,
            name: item.name,
            value: item._id,
            salary: item.balance?.toLocaleString("en-US", {
              style: "currency",
              currency: "PKR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "PKR 0.00",
          }))
        : [],
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Description",
    tabIndex: 3,
    type: "text",
    name: "description",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Amount",
    tabIndex: 3,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },

  {
    id: 7,
    label: "ADD Credit AdvANCE",
    type: "button",
    tabIndex: 6,
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
];

//Add new expense form fields
export const expenseInputFields = [
  {
    id: 1,
    label: "Expense",
    type: "text",
    name: "name",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Description",
    tabIndex: 3,
    type: "text",
    name: "description",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Amount",
    tabIndex: 3,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },

  {
    id: 7,
    label: "ADD EXPENSE",
    type: "button",
    tabIndex: 6,
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
];
