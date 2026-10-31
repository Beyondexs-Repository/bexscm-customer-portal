// Sample assignments used by the roles page until its directory API is connected.
export const assignmentHierarchy = [
  { territory: "Seattle", area: "Seattle Central", store: "Seattle Store 1", departments: ["Management", "Sales", "Operations"] },
  { territory: "Seattle", area: "Seattle North", store: "Seattle Store 2", departments: ["Operations", "Warehouse"] },
  { territory: "Portland", area: "Portland Central", store: "Portland Store 1", departments: ["Management", "Sales"] },
  { territory: "Portland", area: "Portland East", store: "Portland Store 2", departments: ["Operations", "Warehouse"] },
  { territory: "San Francisco", area: "San Francisco Central", store: "San Francisco Store 1", departments: ["Management", "Sales", "Operations"] },
  { territory: "San Francisco", area: "San Francisco West", store: "San Francisco Store 2", departments: ["Sales", "Warehouse"] },
];

export const assignmentFields = [
  ["territory", "Territory"],
  ["area", "Area"],
  ["store", "Store"],
  ["department", "Department"],
];

export function assignmentValues(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export function assignmentOptions(key, selection = {}) {
  const level = assignmentFields.findIndex(([field]) => field === key);
  if (level < 0) return [];
  const parents = assignmentFields.slice(0, level).map(([field]) => field);
  const records = assignmentHierarchy.filter((record) =>
    parents.every((field) => assignmentValues(selection[field]).includes(record[field])),
  );
  return [...new Set(records.flatMap((record) =>
    key === "department" ? record.departments : [record[key]],
  ))];
}

// Prune invalid descendants in order while preserving assignments in other branches.
export function normalizeAssignments(selection) {
  const result = { ...selection };
  for (const [key] of assignmentFields) {
    const allowed = assignmentOptions(key, result);
    result[key] = [...new Set(assignmentValues(result[key]))].filter((value) =>
      allowed.includes(value),
    );
  }
  return result;
}
