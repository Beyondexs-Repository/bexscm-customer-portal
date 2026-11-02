// Source: Role-Based Visual & Data Filter Spec, sections 2-6 (12 Oct 2026).
// UI checks do not replace API authorization or server-side record filtering.
// Price masking fields remain pending business confirmation.

export const roles = {
  "O": {
    "name": "Owner",
    "rank": 1,
    "scope": "SELECTED_STORES",
    "manageableRoles": [
      "T",
      "S",
      "D",
      "E"
    ]
  },
  "T": {
    "name": "Territory Manager",
    "rank": 2,
    "scope": "TERRITORY_STORES",
    "manageableRoles": [
      "S",
      "D",
      "E"
    ]
  },
  "A": {
    "name": "Area Manager",
    "rank": 3,
    "scope": "AREA",
    "manageableRoles": [
      "D",
      "E"
    ]
  },
  "S": {
    "name": "Store Manager",
    "rank": 4,
    "scope": "STORE",
    "manageableRoles": [
      "D",
      "E"
    ]
  },
  "D": {
    "name": "Department Manager",
    "rank": 5,
    "scope": "DEPARTMENT",
    "manageableRoles": [
      "E"
    ]
  },
  "E": {
    "name": "Store Employee",
    "rank": 6,
    "scope": "DEPARTMENT",
    "manageableRoles": []
  }
}

export const permissions = {
  "dashboard.view": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "PARTIAL",
      "scope": "DEPARTMENT",
      "visibleSections": [
        "promotions"
      ]
    }
  },
  "dashboard.customize": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "VIEW_ONLY",
      "scope": "AREA"
    },
    "S": {
      "ui": "VIEW_ONLY",
      "scope": "STORE"
    },
    "D": {
      "ui": "VIEW_ONLY",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "promo.view": {
    "O": {
      "ui": "HIDDEN",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "VIEW_ONLY",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "VIEW_ONLY",
      "scope": "AREA"
    },
    "S": {
      "ui": "VIEW_ONLY",
      "scope": "STORE"
    },
    "D": {
      "ui": "VIEW_ONLY",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "VIEW_ONLY",
      "scope": "DEPARTMENT"
    }
  },
  "dashboard.recentInvoices": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "orderGuide.quick": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "OWN"
    }
  },
  "orderGuide.view": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "OWN"
    }
  },
  "orderGuide.create": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "OWN"
    }
  },
  "orderGuide.edit": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "OWN"
    }
  },
  "orderGuide.delete": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "orderGuide.groups": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "orderGuide.products": {
    "O": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "T": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "A": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "S": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "D": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "orderGuide.bulkAdd": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "orderGuide.parSheet": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "OWN"
    }
  },
  "orderGuide.groupMove": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "orderGuide.toQuick": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "OWN"
    }
  },
  "catalog.list": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    }
  },
  "catalog.details": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    }
  },
  "order.place": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES",
      "canPlaceOnBehalfOfEmployees": true
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    }
  },
  "order.history": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "MASKED",
      "scope": "DEPARTMENT",
      "maskPolicyStatus": "PENDING_CONFIRMATION"
    }
  },
  "order.details": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "MASKED",
      "scope": "DEPARTMENT",
      "maskPolicyStatus": "PENDING_CONFIRMATION"
    }
  },
  "order.reorder": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    }
  },
  "order.cancel": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "invoice.list": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "invoice.details": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "invoice.pdf": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "invoice.share": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "payment.view": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "chat.use": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES"
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA"
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE"
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    },
    "E": {
      "ui": "FULL",
      "scope": "DEPARTMENT"
    }
  },
  "employee.view": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES",
      "visibleRoles": [
        "O",
        "T",
        "A",
        "S",
        "D",
        "E"
      ]
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES",
      "visibleRoles": [
        "T",
        "A",
        "S",
        "D",
        "E"
      ]
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA",
      "visibleRoles": [
        "A",
        "S",
        "D",
        "E"
      ]
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE",
      "visibleRoles": [
        "S",
        "D",
        "E"
      ]
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT",
       "visibleRoles": [
        "O",
        "T",
        "A",
        "S",
        "D",
        "E"
      ]
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "employee.create": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES",
      "manageableRoles": ["T","A","S","D","E"]
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES",
      "manageableRoles": ["A","S","D","E"]
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA",
       "manageableRoles": ["D","E"]
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE",
       "manageableRoles": ["D","E"]
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT",
      "manageableRoles": ["E"]
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "employee.edit": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES",
      "manageableRoles": ["T","S","D","E"]
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES",
      "manageableRoles": ["S","D","E"]
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA",
      "manageableRoles": ["D","E"]
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE",
      "manageableRoles": ["D","E"]
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT",
      "manageableRoles": ["E"]
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "employee.deactivate": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES",
      "manageableRoles": ["T","S","D","E"]
    },
    "T": {
      "ui": "FULL",
      "scope": "TERRITORY_STORES",
      "manageableRoles": ["S","D","E"]
    },
    "A": {
      "ui": "FULL",
      "scope": "AREA",
      "manageableRoles": ["D","E"]
    },
    "S": {
      "ui": "FULL",
      "scope": "STORE",
      "manageableRoles": ["D","E"]
    },
    "D": {
      "ui": "FULL",
      "scope": "DEPARTMENT",
      "manageableRoles": ["E"]
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "admin.territories": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "A": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "S": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "D": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  },
  "admin.access": {
    "O": {
      "ui": "FULL",
      "scope": "SELECTED_STORES"
    },
    "T": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "A": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "S": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "D": {
      "ui": "HIDDEN",
      "scope": "NONE"
    },
    "E": {
      "ui": "HIDDEN",
      "scope": "NONE"
    }
  }
}

const denied = Object.freeze({ ui: "HIDDEN", scope: "NONE" })

// Accept response.data, the full login response, or a role string such as "O".
// The API's `roles` field is authoritative; fullName does not determine access.
export function getRoleCode(userOrRole) {
  if (userOrRole?.success === false) return null

  const roleCode = typeof userOrRole === "string"
    ? userOrRole
    : userOrRole?.roles ?? userOrRole?.data?.roles

  return typeof roleCode === "string" && Object.hasOwn(roles, roleCode)
    ? roleCode
    : null
}

// Unknown roles and permission keys are denied by default.
// Scope tokens describe the policy; login currently supplies no scope IDs.
export function getPermission(userOrRole, key) {
  const roleCode = getRoleCode(userOrRole)
  if (!roleCode || !Object.hasOwn(permissions, key)) {
    return denied
  }
  return permissions[key][roleCode]
}

// Visibility only: VIEW_ONLY, PARTIAL and MASKED require their own UI handling.
export function can(userOrRole, key) {
  return getPermission(userOrRole, key).ui !== "HIDDEN"
}

// Use for editing/action controls, rather than treating visibility as write access.
export function canAct(userOrRole, key) {
  return getPermission(userOrRole, key).ui === "FULL"
}

// Role dropdown options only. Record scope and self-edit/deactivation rules
// still need to be checked against the actual actor and target on the server.
export function getManageableRoles(userOrRole) {
  const roleCode = getRoleCode(userOrRole)
  return roleCode ? [...roles[roleCode].manageableRoles] : []
}


// Role codes shown as tabs on the Employees/Users screen (from employee.view.visibleRoles)
export function getVisibleRoles(userOrRole, key = "employee.view") {
  const permission = getPermission(userOrRole, key)
  if (permission.ui === "HIDDEN") return []
  return [...(permission.visibleRoles ?? [])]
}
// add at the bottom of the file
// Target role codes this actor may act on for a key (create / edit / deactivate)
export function getActionableRoles(userOrRole, key) {
  const permission = getPermission(userOrRole, key)
  if (permission.ui !== "FULL") return []
  return [...(permission.manageableRoles ?? [])]
}

// Can the actor perform `key` on a record whose role code is `targetRole`?
export function canActOnRole(userOrRole, key, targetRole) {
  return getActionableRoles(userOrRole, key).includes(targetRole)
}
