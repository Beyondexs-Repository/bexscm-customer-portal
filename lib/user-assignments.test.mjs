import assert from "node:assert/strict";
import { test } from "node:test";
import { assignmentOptions, normalizeAssignments } from "./user-assignments.js";

test("child options stay unavailable until their parents are selected", () => {
  assert.deepEqual(assignmentOptions("area"), []);
  assert.deepEqual(assignmentOptions("store", { territory: ["Seattle"] }), []);
  assert.deepEqual(assignmentOptions("department", {
    territory: ["Seattle"], area: ["Seattle Central"],
  }), []);
});

test("each step offers only descendants of the selected branch", () => {
  const selection = {
    territory: ["Seattle"], area: ["Seattle North"], store: ["Seattle Store 2"],
  };
  assert.deepEqual(assignmentOptions("area", selection), ["Seattle Central", "Seattle North"]);
  assert.deepEqual(assignmentOptions("store", selection), ["Seattle Store 2"]);
  assert.deepEqual(assignmentOptions("department", selection), ["Operations", "Warehouse"]);
});

test("removing all territories clears every descendant", () => {
  const result = normalizeAssignments({
    territory: [], area: ["Seattle Central"], store: ["Seattle Store 1"], department: ["Sales"],
  });
  assert.deepEqual(result, { territory: [], area: [], store: [], department: [] });
});

test("removing one territory preserves assignments in the remaining branch", () => {
  const result = normalizeAssignments({
    name: "Example User",
    territory: ["Portland"],
    area: ["Seattle North", "Portland Central"],
    store: ["Seattle Store 2", "Portland Store 1"],
    department: ["Warehouse", "Sales"],
  });
  assert.deepEqual(result, {
    name: "Example User", territory: ["Portland"], area: ["Portland Central"],
    store: ["Portland Store 1"], department: ["Sales"],
  });
});

test("switching area clears the previous store and its departments", () => {
  const result = normalizeAssignments({
    territory: ["Seattle"], area: ["Seattle North"],
    store: ["Seattle Store 1"], department: ["Sales"],
  });
  assert.deepEqual(result.store, []);
  assert.deepEqual(result.department, []);
});

test("multiple selected branches combine options without duplicates", () => {
  const selection = {
    territory: ["Seattle", "Portland"],
    area: ["Seattle Central", "Portland Central"],
    store: ["Seattle Store 1", "Portland Store 1"],
  };
  assert.deepEqual(assignmentOptions("store", selection), ["Seattle Store 1", "Portland Store 1"]);
  assert.deepEqual(assignmentOptions("department", selection), ["Management", "Sales", "Operations"]);
});
