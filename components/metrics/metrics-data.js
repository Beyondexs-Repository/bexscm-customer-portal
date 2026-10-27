export const money = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
})

export const periods = {
  week: {
    label: "Last 7 days", dates: "October 21–27, 2026",
    labels: ["Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27"],
    purchases: [420, 560, 0, 740, 620, 0, 870], previous: [380, 500, 0, 650, 580, 0, 750],
    orders: [1, 1, 0, 1, 1, 0, 2], eligibleOrders: [1, 1, 0, 1, 1, 0, 1], previousOrders: 5,
    orderValues: [520, 560, 0, 540, 550, 0, 580], statuses: [3, 1, 1, 1],
    productMultiplier: 0.25,
  },
  month: {
    label: "Last 30 days", dates: "September 28–October 27, 2026",
    labels: ["Sep 28–Oct 4", "Oct 5–11", "Oct 12–18", "Oct 19–27"],
    purchases: [2860, 3240, 2980, 3400], previous: [2600, 3020, 2860, 3000],
    orders: [5, 6, 5, 6], eligibleOrders: [5, 6, 5, 5], previousOrders: 21,
    orderValues: [550, 520, 570, 540], statuses: [18, 2, 1, 1],
    productMultiplier: 1,
  },
  quarter: {
    label: "Last 3 months", dates: "July 28–October 27, 2026",
    labels: ["Jul 28–Aug 27", "Aug 28–Sep 27", "Sep 28–Oct 27"], purchases: [11200, 12480, 12480],
    previous: [9650, 9100, 10800], orders: [20, 24, 22], eligibleOrders: [20, 23, 21], previousOrders: 58,
    orderValues: [530, 510, 545], statuses: [59, 3, 2, 2],
    productMultiplier: 3,
  },
  sixMonths: {
    label: "Last 6 months", dates: "April 28–October 27, 2026",
    labels: ["Apr–May", "May–Jun", "Jun–Jul", "Jul–Aug", "Aug–Sep", "Sep–Oct"],
    purchases: [9650, 9100, 10800, 11200, 12480, 12480],
    previous: [7200, 7800, 7600, 8100, 8500, 8200],
    orders: [19, 18, 21, 20, 24, 22], eligibleOrders: [18, 17, 21, 20, 23, 21], previousOrders: 102,
    orderValues: [490, 480, 510, 530, 510, 545], statuses: [113, 4, 3, 4],
    productMultiplier: 5,
  },
  year: {
    label: "Last year", dates: "October 28, 2025–October 27, 2026",
    labels: ["Oct–Dec", "Dec–Feb", "Feb–Apr", "Apr–Jun", "Jun–Aug", "Aug–Oct"],
    purchases: [9200, 10400, 12000, 15000, 18000, 22000],
    previous: [8000, 9200, 10500, 12500, 15000, 18000],
    orders: [18, 20, 23, 29, 35, 42], eligibleOrders: [17, 20, 22, 29, 34, 41], previousOrders: 146,
    orderValues: [480, 495, 510, 520, 540, 550], statuses: [153, 6, 4, 4],
    productMultiplier: 8,
  },
}

export const products = [
  { sku: "500001", name: "Chicken breast", category: "Poultry", orders: 12, quantity: 24, unit: "cases", spend: 1920, lastOrdered: "Oct 26, 2026" },
  { sku: "500002", name: "Atlantic salmon", category: "Seafood", orders: 9, quantity: 18, unit: "cases", spend: 1620, lastOrdered: "Oct 25, 2026" },
  { sku: "500003", name: "Beef sirloin", category: "Beef", orders: 8, quantity: 16, unit: "cases", spend: 1440, lastOrdered: "Oct 24, 2026" },
  { sku: "500004", name: "Pork tenderloin", category: "Pork", orders: 7, quantity: 14, unit: "cases", spend: 980, lastOrdered: "Oct 23, 2026" },
  { sku: "500005", name: "Jumbo shrimp", category: "Seafood", orders: 6, quantity: 12, unit: "cases", spend: 960, lastOrdered: "Oct 22, 2026" },
  { sku: "500006", name: "Chicken wings", category: "Poultry", orders: 5, quantity: 10, unit: "cases", spend: 600, lastOrdered: "Oct 21, 2026" },
]

export const categories = [
  { name: "Poultry", share: 35, color: "var(--primary)" },
  { name: "Seafood", share: 30, color: "#10b981" },
  { name: "Beef", share: 20, color: "#8b5cf6" },
  { name: "Pork", share: 10, color: "#f59e0b" },
  { name: "Other", share: 5, color: "#38bdf8" },
]

export const orderStatuses = [
  { name: "Delivered", color: "#10b981" },
  { name: "Processing", color: "var(--primary)" },
  { name: "Pending", color: "#f59e0b" },
  { name: "Cancelled", color: "#94a3b8" },
]

export const invoices = [
  { number: "INV-10420", due: "Oct 20, 2026", balance: 650, overdueDays: 7 },
  { number: "INV-10385", due: "Sep 25, 2026", balance: 430, overdueDays: 32 },
  { number: "INV-10482", due: "Oct 30, 2026", balance: 1140, overdueDays: 0 },
  { number: "INV-10461", due: "Nov 3, 2026", balance: 720, overdueDays: 0 },
]

export const aging = [
  { name: "Not due", amount: 1860, color: "var(--primary)" },
  { name: "1–30 days", amount: 650, color: "#f59e0b" },
  { name: "31–60 days", amount: 430, color: "#f97316" },
  { name: "61–90 days", amount: 0, color: "#ef4444" },
  { name: "90+ days", amount: 0, color: "#e11d48" },
]

export const account = { invoiced: 88680, paid: 85740, asOf: "October 27, 2026" }
