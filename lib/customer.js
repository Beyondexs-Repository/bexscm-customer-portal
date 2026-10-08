export function normalizeCustomerNumber(value) {
  if (typeof value !== "string" && typeof value !== "number") return ""
  const customer = String(value).trim()
  return /^(undefined|null|nan)$/i.test(customer) ? "" : customer
}

export function getCustomerNumber() {
  return typeof window === "undefined"
    ? ""
    : normalizeCustomerNumber(window.localStorage.getItem("custnmbr"))
}

export function requireCustomerNumber(value) {
  const customer = normalizeCustomerNumber(value ?? getCustomerNumber())
  if (!customer) throw new Error("Please sign in to select a customer.")
  return customer
}
