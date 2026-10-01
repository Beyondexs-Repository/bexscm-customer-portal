// Fixed demo reference date keeps the static preview reproducible.
export const periods = {
  today: { label: "Today", dates: "October 1, 2026", labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"], amounts: [0, 320, 0, 540, 0, 0], orders: [0, 1, 0, 1, 0, 0], unpaid: 1, balance: 540, shares: [45, 20, 20, 10, 5] },
  week: { label: "Last week", dates: "September 21 – 27, 2026", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], amounts: [420, 560, 0, 740, 620, 380, 0], orders: [1, 1, 0, 2, 1, 1, 0], unpaid: 2, balance: 800, shares: [35, 30, 20, 10, 5] },
  month: { label: "Last month", dates: "September 1 – 30, 2026", labels: ["Sep 1–7", "Sep 8–14", "Sep 15–21", "Sep 22–28", "Sep 29–30"], amounts: [2600, 3120, 2860, 2900, 1000], orders: [5, 6, 5, 6, 2], unpaid: 3, balance: 1860, shares: [40, 25, 20, 10, 5] },
  sixMonths: { label: "Last 6 months", dates: "April 1 – September 30, 2026", labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], amounts: [8200, 9650, 9100, 10800, 11200, 12480], orders: [16, 19, 18, 21, 20, 24], unpaid: 5, balance: 2940, shares: [38, 27, 18, 12, 5] },
}

export const categoryDefinitions = [
  { name: "Vegetables", color: "var(--primary)" },
  { name: "Fruits", color: "#10b981" },
  { name: "Meat & seafood", color: "#8b5cf6" },
  { name: "Dairy & eggs", color: "#f59e0b" },
  { name: "Pantry essentials", color: "#38bdf8" },
]

export function getPeriodMetrics(key) {
  const period = periods[key]
  const spend = period.amounts.reduce((sum, value) => sum + value, 0)
  const orderCount = period.orders.reduce((sum, value) => sum + value, 0)
  const categories = categoryDefinitions.map((category, index) => ({ ...category, share: period.shares[index], amount: spend * period.shares[index] / 100 }))
  const products = [
    { name: "Roma tomatoes", category: "Vegetables", frequency: 0.5, price: 30 },
    { name: "Romaine lettuce", category: "Vegetables", frequency: 0.42, price: 30 },
    { name: "Hass avocados", category: "Fruits", frequency: 0.33, price: 50 },
    { name: "Chicken breast", category: "Meat & seafood", frequency: 0.29, price: 80 },
    { name: "Large eggs", category: "Dairy & eggs", frequency: 0.25, price: 30 },
  ].map((product) => {
    const orders = Math.max(1, Math.round(orderCount * product.frequency))
    const cases = orders * 2
    return { ...product, orders, quantity: `${cases} cases`, spend: cases * product.price }
  })
  return { ...period, spend, orderCount, categories, products }
}
