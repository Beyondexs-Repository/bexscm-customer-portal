import customers from "@/data/livedata/Customers.json";
import invoices from "@/data/livedata/Invoices.json";
import invoiceStatuses from "@/data/livedata/InvoicesStatus.json";
import staticItems from "@/data/livedata/Items.json";
import { fetchItemsApi } from "@/lib/api/itemsApi";

export const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const number = new Intl.NumberFormat("en-US");

const clean = (value) => String(value ?? "").trim();

// Property normalizer to handle both static JSON (PascalCase) and API responses (camelCase)
export const getItemAvailable = (item) => clean(item.Available ?? item.available);
export const getItemProprietary = (item) => clean(item.Proprietary ?? item.proprietary);
export const getItemMainGroup = (item) => clean(item.MainGroup ?? item.mainGroup) || "Unassigned";

const invoiceMap = new Map();
for (const invoice of invoices) {
  const invoiceNumber = clean(invoice.InvoiceNumber);

  if (!invoiceMap.has(invoiceNumber)) {
    invoiceMap.set(invoiceNumber, {
      invoiceNumber,
      customerId: clean(invoice.CustomerID),
      company: clean(invoice.Company),
      date: invoice.InvoiceDate,
      amount: Number(invoice.OrderAmount) || 0,
    });
  }
}

export const uniqueInvoices = [...invoiceMap.values()];

const openInvoices = invoiceStatuses.filter((invoice) => clean(invoice.Status) === "Open");
const openBalance = invoiceStatuses.reduce(
  (total, invoice) => total + (Number(invoice.Balance) || 0),
  0
);
const activeCustomers = customers.filter((customer) => Number(customer.INACTIVE ?? customer.inactive) === 0);

/**
 * Calculate dashboard stats dynamically using provided items array
 * Works with both static Items.json and https://crateapi.bexlgems.com/api/items
 */
export function buildDashboardStats(itemsList = staticItems) {
  const availableItems = itemsList.filter((item) => getItemAvailable(item) === "Yes");
  const proprietaryAvailableItems = itemsList.filter(
    (item) => getItemProprietary(item) === "Yes" && getItemAvailable(item) === "Yes"
  );

  return [
    {
      label: "Open Balance",
      value: money.format(openBalance),
      helper: `${number.format(openInvoices.length)} open invoices`,
      type: "balance",
    },
    {
      label: "Invoice Volume",
      value: number.format(uniqueInvoices.length),
      helper: `${number.format(invoices.length)} invoice lines`,
      type: "invoices",
    },
    {
      label: "Customers",
      value: number.format(activeCustomers.length),
      helper: `${number.format(customers.length)} total accounts`,
      type: "customers",
    },
    {
      label: "Available Items",
      value: number.format(availableItems.length),
      helper: `${number.format(proprietaryAvailableItems.length)} proprietary`,
      type: "items",
    },
  ];
}

/**
 * Calculate top item categories dynamically using provided items array
 */
export function buildTopCategories(itemsList = staticItems) {
  return Object.entries(
    itemsList.reduce((groups, item) => {
      const group = getItemMainGroup(item);
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

// Initial static exports for fallback/prerendering
export const stats = buildDashboardStats(staticItems);
export const topCategories = buildTopCategories(staticItems);

export const recentInvoices = uniqueInvoices
  .toSorted((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 6);

const latestInvoiceDate = uniqueInvoices.reduce((latest, invoice) => {
  const invoiceDate = new Date(invoice.date);
  return invoiceDate > latest ? invoiceDate : latest;
}, new Date(0));

export const salesYear = latestInvoiceDate.getFullYear();

export const monthlySales = Array.from({ length: 6 }, (_, index) => {
  const month = new Date(salesYear, latestInvoiceDate.getMonth() - 5 + index, 1);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const amount = uniqueInvoices.reduce((total, invoice) => {
    const invoiceDate = new Date(invoice.date);
    if (invoiceDate.getFullYear() === year && invoiceDate.getMonth() === monthIndex) {
      return total + invoice.amount;
    }
    return total;
  }, 0);

  return {
    label: month.toLocaleDateString("en-US", { month: "short" }),
    year,
    amount,
  };
});

export const yearSales = uniqueInvoices.reduce((total, invoice) => {
  const invoiceDate = new Date(invoice.date);
  return invoiceDate.getFullYear() === salesYear ? total + invoice.amount : total;
}, 0);

export { fetchItemsApi };
