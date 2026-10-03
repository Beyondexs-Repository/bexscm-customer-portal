export function getCustomerNumber() {
  return typeof window === "undefined" ? "" : window.localStorage.getItem("custnmbr")?.trim() ?? ""
}

export function requireCustomerNumber(value) {
  const customer = String(value || getCustomerNumber()).trim()
  if (!customer) throw new Error("Please sign in to select a customer.")
  return customer
}
