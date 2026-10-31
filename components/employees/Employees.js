// "use client"

// import { useMemo, useState } from "react"
// import { employeeRoles, useEmployeeAccess } from "./employee-access"
// import { Network, Plus, Search, Table2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import EmpChart from "./EmpChart"
// import employeeData from "./employees.json"
// import EmployeeForm, { managerIds } from "./EmployeeForm"
// import { AlertDialog } from "radix-ui"
// import EmpTable from "./EmpTable"

// export default function Employees() {
//    const { allowedRoles, role } = useEmployeeAccess()
//   const [view, setView] = useState("table")
//   const [employees, setEmployees] = useState(() => employeeData.map((employee) => ({ ...employee, status: "Active" })))
//   const [form, setForm] = useState(null)
//   const [deleting, setDeleting] = useState(null)

// // Show only employees with the same role as the logged-in user
// const visibleEmployees = useMemo(
//   () => employees.filter((e) => e.role === role),
//   [employees, role]
// )
//     // Logged-in role sees its own level and everything below it
//   // const visibleEmployees = useMemo(() => {
//   //   const myIndex = employeeRoles.indexOf(role)
//   //   if (myIndex < 0) return []
//   //   return employees.filter((e) => employeeRoles.indexOf(e.role) >= myIndex)
//   // }, [employees, role])

//   function saveEmployee(employee) {
//     setEmployees((current) => current.some((item) => item.id === employee.id)
//       ? current.map((item) => item.id === employee.id ? employee : item)
//       : [...current, employee])
//     setForm(null)
//   }

//   function deleteEmployee() {
//     if (!deleting || !allowedRoles.includes(deleting.role)) return
//     setEmployees((current) => current.filter((item) => item.id !== deleting.id).map((item) => ({ ...item, managerIds: managerIds(item).filter((id) => id !== deleting.id), managerId: null })))
//     setDeleting(null)
//   }

//   return (
//     <main className="space-y-5 p-4">
//       <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:max-w-md">
//           <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//           <Input className="pl-9" placeholder="Search employees..." />
//         </div>
//         <div className="flex shrink-0 flex-wrap items-center gap-3">
//           {/* <span className="text-sm text-muted-foreground">View</span> */}
//           <div role="group" aria-label="Employee view" className="flex items-center rounded-lg border bg-muted/40 p-1">
//             <Button
//               variant={view === "chart" ? "secondary" : "ghost"}
//               size="icon-sm"
//               aria-label="Chart view"
//               title="Chart view"
//               aria-pressed={view === "chart"}
//               onClick={() => setView("chart")}
//               className={view === "chart" ? "shadow-sm" : "text-muted-foreground"}
//             >
//               <Network className="size-4" />
//             </Button>
//             <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
//             <Button
//               variant={view === "table" ? "secondary" : "ghost"}
//               size="icon-sm"
//               aria-label="Table view"
//               title="Table view"
//               aria-pressed={view === "table"}
//               onClick={() => setView("table")}
//               className={view === "table" ? "shadow-sm" : "text-muted-foreground"}
//             >
//               <Table2 className="size-4" />
//             </Button>
//           </div>
//           {allowedRoles.length > 0 && <Button onClick={() => setForm({ employee: null })}>
//             <Plus className="size-4" />
//             Add Employee
//           </Button>}
//         </div>
//       </section>
//       {/* {view === "chart" ? <EmpChart employees={employees} onEdit={(employee) => setForm({ employee })} onDelete={setDeleting} /> : <EmpTable employees={employees} onEdit={(employee) => setForm({ employee })} onDelete={setDeleting} />} */}
//       {view === "chart"
//   ? <EmpChart employees={visibleEmployees} onEdit={(employee) => setForm({ employee })} onDelete={setDeleting} />
//   : <EmpTable employees={visibleEmployees} onEdit={(employee) => setForm({ employee })} onDelete={setDeleting} />}

//       {form && allowedRoles.length > 0 && (!form.employee || allowedRoles.includes(form.employee.role)) && <EmployeeForm employee={form.employee} employees={employees} onClose={() => setForm(null)} onSave={saveEmployee} />}
//       <AlertDialog.Root open={!!deleting && allowedRoles.includes(deleting.role)} onOpenChange={(open) => !open && setDeleting(null)}>
//         <AlertDialog.Portal>
//           <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
//           <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg border bg-background p-6 shadow-lg">
//             <AlertDialog.Title className="text-lg font-semibold">Delete employee?</AlertDialog.Title>
//             <AlertDialog.Description className="text-sm text-muted-foreground">Delete {deleting?.name}? Their reporting links will be removed. Employees who report to them will be kept.</AlertDialog.Description>
//             <div className="flex justify-end gap-2">
//               <AlertDialog.Cancel asChild><Button variant="outline">Cancel</Button></AlertDialog.Cancel>
//               <AlertDialog.Action asChild><Button variant="destructive" onClick={deleteEmployee}>Confirm</Button></AlertDialog.Action>
//             </div>
//           </AlertDialog.Content>
//         </AlertDialog.Portal>
//       </AlertDialog.Root>
//     </main>
//   )
// }


//********************************* TO CONFIGURE THE ADMIN PORTAL USERS SCREEN DESIGN SECTION ***************************//
// "use client";

// // ─────────────────────────────────────────────────────────────
// // 1. IMPORTS
// // ─────────────────────────────────────────────────────────────
// import { useEffect, useId, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";
// import { Popover } from "radix-ui";
// import { getCountries, getCountryCallingCode } from "libphonenumber-js/min";
// import {
//   Crown,
//   MapPin,
//   Map,
//   Store,
//   Network,
//   Users,
//   Search,
//   Plus,
//   MoreVertical,
//   Pencil,
//   UserRoundCheck,
//   ChevronDown,
//   Loader2,
//   Camera,
//   Trash2,
// } from "lucide-react";

// import {
//   Getuserslist,
//   GetTerritorylist,
//   GetAreaList,
//   GetLocationList,
//   GetdeptList,
//   clearAreaList,
//   clearLocationList,
//   clearDepartmentList,
//   EdituserGet,
// } from "../../redux/slices/getSlice";
// import { Postusers, Updateusers, Deleteusers } from "../../redux/slices/postSlice";
// import { assignmentFields, assignmentValues } from "@/lib/user-assignments";
// import { can, canAct, getManageableRoles, getVisibleRoles } from "@/lib/permissions";
// import { PaginationCustomUsers } from "@/components/ui/pagination-custom";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuCheckboxItem,
//   DropdownMenuGroup,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";

// // ─────────────────────────────────────────────────────────────
// // 2. CONSTANTS
// // ─────────────────────────────────────────────────────────────

// // `code` is the value the API sends in the `roles` field
// const roles = [
//   { code: "O", name: "Owner", shortName: "Owner", icon: Crown, color: "text-blue-500" },
//   { code: "T", name: "Territory Manager", shortName: "Territory", icon: MapPin, color: "text-violet-500" },
//   { code: "A", name: "Area Manager", shortName: "Area", icon: Map, color: "text-cyan-500" },
//   { code: "S", name: "Store Manager", shortName: "Store", icon: Store, color: "text-emerald-500" },
//   { code: "D", name: "Department Manager", shortName: "Department", icon: Network, color: "text-orange-500" },
//   { code: "E", name: "Employees", shortName: "Employee", icon: Users, color: "text-slate-500" },
// ];

// const roleNameByCode = Object.fromEntries(roles.map((r) => [r.code, r.name]));
// const roleCodeByName = Object.fromEntries(roles.map((r) => [r.name, r.code]));

// // which ID arrays each role sends in the POST /users payload
// const payloadKeysByRole = {
//   O: [],
//   T: ["territoryIds"],
//   A: ["territoryIds", "areaIds"],
//   S: ["territoryIds", "areaIds", "locationIds"],
//   D: ["territoryIds", "areaIds", "locationIds", "departmentIds"],
//   E: ["territoryIds", "areaIds", "locationIds", "departmentIds"],
// };


// // label used in toast messages
// const roleLabelByCode = {
//   O: "Owner",
//   T: "Territory Manager",
//   A: "Area Manager",
//   S: "Store Manager",
//   D: "Department Manager",
//   E: "Employee",
// };
// // payload key -> label used in validation messages
// const payloadKeyLabel = {
//   territoryIds: "territory",
//   areaIds: "area",
//   locationIds: "store",
//   departmentIds: "department",
// };

// // TODO: replace with the logged-in user's id
// const CREATED_BY = 18;
// const MODIFIED_BY = 18;
// // fallback customer number when no existing user carries one
// const DEFAULT_CUSTNMBR = process.env.NEXT_PUBLIC_CUSTNMBR ?? "";

// const mobileCountries = getCountries().map((country) => ({
//   country,
//   code: `+${getCountryCallingCode(country)}`,
// }));
// const mobileCountryLabelLength = Math.max(
//   ...mobileCountries.map(({ country, code }) => `${country} ${code}`.length),
// );

// // calling code (e.g. "+91") -> ISO country (e.g. "IN")
// const preferredCountryByCode = { "+1": "US", "+44": "GB", "+7": "RU", "+61": "AU" };
// const countryByCallingCode = mobileCountries.reduce(
//   (map, { country, code }) => {
//     if (!map[code]) map[code] = country;
//     return map;
//   },
//   { ...preferredCountryByCode },
// );

// const fieldClass =
//   "h-9 w-full min-w-0 rounded-md border bg-background px-2 text-xs font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring";
// const avatarColors = [
//   "bg-blue-500/10 text-blue-600 dark:text-blue-400",
//   "bg-violet-500/10 text-violet-600 dark:text-violet-400",
//   "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
// ];

// // ─────────────────────────────────────────────────────────────
// // 3. HELPERS (pure functions, no React)
// // ─────────────────────────────────────────────────────────────

// // API user -> shape used by this screen


// function normalizeUser(u) {
//    const rawId = u.userId ?? u.userID ?? u.userid ?? u.id;
//   const code = u.roles ? String(u.roles).trim().toUpperCase() : null;
//   const callingCode = u.countryCode || "+1";
//   return {
//     // id: String(u.userId),
//     // userId: u.userId,
//     id: String(rawId),
//     userId: rawId,
//     name: u.fullName ?? "",
//     email: u.emailID ?? "",
//     mobile: u.mobileNumber ?? "",
//     mobileCountry: countryByCallingCode[callingCode] || "US",
//     mobileCountryCode: callingCode,
//     custnmbr: u.custnmbr ?? "",
//     roles: code,
//     role: roleNameByCode[code] ?? null, // null when roles is null or an unknown code
//     status: u.isActive ? "Active" : "Inactive",
//     reportsTo: "",
//     avatar: "",
//     territory: [],
//     area: [],
//     store: [],
//     department: [],
//   };
// }

// // label / id accessors for the API lists (adjust field names here if your API differs)
// const areaLabel = (a) => [a.city, a.state].filter(Boolean).join(", ");
// const locationLabel = (l) => l.locationName ?? l.storeName ?? l.locationCode ?? l.name ?? "";
// const deptLabel = (d) => d.departmentName ?? d.deptName ?? d.departmentCode ?? d.name ?? "";
// const locationId = (l) => l.locationID ?? l.locationId;
// const locationAreaId = (l) => l.areaID ?? l.areaId;
// const deptLocationId = (d) => d.locationID ?? d.locationId;
// const departmentId = (d) => d.departmentID ?? d.departmentId ?? d.deptID ?? d.deptId;

// // unique, non-empty labels of the active items
// function uniqueLabels(list, getLabel) {
//   const seen = new Set();
//   const out = [];
//   for (const item of list ?? []) {
//     if (item.isActive === false) continue;
//     const label = getLabel(item);
//     if (!label || seen.has(label)) continue;
//     seen.add(label);
//     out.push(label);
//   }
//   return out;
// }

// const uniq = (arr) => [...new Set(arr.filter((v) => v != null))];
// const initials = (name) =>
//   name
//     .split(" ")
//     .map((part) => part[0])
//     .slice(0, 2)
//     .join("");

// // ─────────────────────────────────────────────────────────────
// // 4. SMALL COMPONENTS
// // ─────────────────────────────────────────────────────────────

// // table cell: first two values + "+N" popover
// function AssignmentList({ value, label, icon: Icon }) {
//   const titleId = useId();
//   const values = [...new Set(assignmentValues(value))];
//   if (!values.length) return <span className="text-muted-foreground">—</span>;

//   return (
//     <div className="space-y-1 whitespace-nowrap text-xs text-muted-foreground">
//       <div>
//         {values[0]}
//         {values.length > 1 ? "," : ""}
//       </div>
//       {values.length > 1 && (
//         <div className="flex items-center gap-1.5">
//           <span>
//             {values[1]}
//             {values.length > 2 ? "," : ""}
//           </span>
//           {values.length > 2 && (
//             <Popover.Root>
//               <Popover.Trigger asChild>
//                 <button
//                   type="button"
//                   aria-label={`Show all ${values.length} assigned ${label.toLowerCase()}`}
//                   className="shrink-0 rounded-sm text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                 >
//                   +{values.length - 2}
//                 </button>
//               </Popover.Trigger>
//               <Popover.Portal>
//                 <Popover.Content
//                   align="start"
//                   sideOffset={8}
//                   collisionPadding={12}
//                   aria-labelledby={titleId}
//                   className="z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none"
//                 >
//                   <h3 id={titleId} className="mb-3 text-sm font-semibold">
//                     Assigned {label.toLowerCase()} ({values.length})
//                   </h3>
//                   <ul className="max-h-60 space-y-2 overflow-y-auto">
//                     {values.map((item) => (
//                       <li key={item} className="flex items-start gap-2 text-xs">
//                         <Icon className="size-4 shrink-0 text-muted-foreground" />
//                         <span className="break-words">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <Popover.Arrow className="fill-popover" />
//                 </Popover.Content>
//               </Popover.Portal>
//             </Popover.Root>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // sheet: multi-select dropdown for territory / area / store / department
// function AssignmentSelect({
//   fieldKey,
//   title,
//   options,
//   selected,
//   loading,
//   parentTitle, // set when the parent field is still empty (disables this dropdown)
//   onChange,
// }) {
//   const disabled = Boolean(parentTitle);

//   return (
//     <div className="min-w-0 space-y-1.5 text-sm">
//       <span id={`user-${fieldKey}-label`}>{title}</span>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             type="button"
//             variant="outline"
//             disabled={disabled}
//             aria-labelledby={`user-${fieldKey}-label user-${fieldKey}-value`}
//             className="h-9 w-full justify-between gap-2 px-2 text-xs font-normal"
//           >
//             <span
//               id={`user-${fieldKey}-value`}
//               className="min-w-0 truncate"
//               title={selected.join(", ")}
//             >
//               {selected.length
//                 ? selected.join(", ")
//                 : loading
//                   ? `Loading ${title.toLowerCase()}...`
//                   : disabled
//                     ? `Select ${parentTitle.toLowerCase()} first`
//                     : `Select ${title.toLowerCase()}`}
//             </span>
//             <span className="flex shrink-0 items-center gap-2">
//               {selected.length > 1 && (
//                 <span className="rounded bg-primary/10 px-1.5 text-primary">
//                   {selected.length}
//                 </span>
//               )}
//               <ChevronDown className="size-4" />
//             </span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           align="start"
//           className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)]"
//         >
//           {options.length === 0 && (
//             <DropdownMenuItem disabled className="text-xs">
//               {loading ? "Loading..." : "No options available"}
//             </DropdownMenuItem>
//           )}
//           {options.map((value) => (
//             <DropdownMenuCheckboxItem
//               key={value}
//               checked={selected.includes(value)}
//               onSelect={(event) => event.preventDefault()}
//               onCheckedChange={(checked) =>
//                 onChange(
//                   checked
//                     ? [...new Set([...selected, value])]
//                     : selected.filter((item) => item !== value),
//                 )
//               }
//               className="text-xs"
//             >
//               {value}
//             </DropdownMenuCheckboxItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// // sheet: "Reports to" dropdown grouped by higher roles
// function ReportsToSelect({ role, groups, selectedUser, onChange }) {
//   const hasUsers = groups.some((group) => group.users.length);

//   return (
//     <div className="min-w-0 space-y-1.5 text-sm">
//       <span id="user-reports-to-label">Reports to</span>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             type="button"
//             variant="outline"
//             disabled={!hasUsers}
//             aria-labelledby="user-reports-to-label user-reports-to-value"
//             className="h-9 w-full justify-between gap-2 px-2 text-xs font-normal"
//           >
//             <span id="user-reports-to-value" className="min-w-0 truncate">
//               {selectedUser
//                 ? selectedUser.name
//                 : role === "Owner"
//                   ? "No reporting manager for Owner"
//                   : hasUsers
//                     ? "Select reporting manager"
//                     : "No higher-level users available"}
//             </span>
//             <ChevronDown className="size-4 shrink-0" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           align="start"
//           className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)]"
//         >
//           <DropdownMenuRadioGroup value={selectedUser?.id || ""} onValueChange={onChange}>
//             <DropdownMenuRadioItem value="" className="text-xs">
//               No reporting manager
//             </DropdownMenuRadioItem>
//             {groups.map((group) => (
//               <DropdownMenuGroup key={group.name} aria-label={group.name}>
//                 <DropdownMenuLabel className="mt-2 mb-2 border-b border-border px-2 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
//                   {group.shortName}
//                 </DropdownMenuLabel>
//                 {group.users.length ? (
//                   group.users.map((user) => (
//                     <DropdownMenuRadioItem key={user.id} value={user.id} className="text-xs">
//                       {user.name}
//                     </DropdownMenuRadioItem>
//                   ))
//                 ) : (
//                   <DropdownMenuItem disabled className="text-xs">
//                     No users available
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuGroup>
//             ))}
//           </DropdownMenuRadioGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // 5. MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────
// export default function Employees() {
//   const dispatch = useDispatch();
//    const [role, setRole] = useState(null)
//   useEffect(() => {
//     setRole(localStorage.getItem("roles"))
//   }, [])
//   // ── 5.1 Redux data ──────────────────────────────────────────
//   const userslistData = useSelector((state) => state.getSlice.userslistData);
//   const userslistLoading = useSelector((state) => state.getSlice.userslistLoading);
//   const userslistStatus = useSelector((state) => state.getSlice.userslistStatus);
//   const userslistError = useSelector((state) => state.getSlice.userslistError);

//   const territoryData = useSelector((state) => state.getSlice.territoryData);
//   const territoryLoading = useSelector((state) => state.getSlice.territoryLoading);
//   const areaData = useSelector((state) => state.getSlice.areaData);
//   const areaLoading = useSelector((state) => state.getSlice.areaLoading);
//   const locationData = useSelector((state) => state.getSlice.locationData);
//   const locationLoading = useSelector((state) => state.getSlice.locationLoading);
//   const deptData = useSelector((state) => state.getSlice.deptData);
//   const deptLoading = useSelector((state) => state.getSlice.deptLoading);

//   // user by id (edit sheet)
//   const edituserData = useSelector((state) => state.getSlice.edituserData);
//   const edituserStatus = useSelector((state) => state.getSlice.edituserStatus);
//   const edituserError = useSelector((state) => state.getSlice.edituserError);

//   // ── 5.2 Local state ─────────────────────────────────────────
//   const [users, setUsers] = useState([]);

//   // table filters
//   const [roleName, setRoleName] = useState("Owner");


// // tabs allowed for the logged-in role (role = "O" | "T" | "S" | "D" | "E")
// const visibleRoles = useMemo(() => {
//   const allowed = getVisibleRoles(role);
//   return roles.filter((r) => allowed.includes(r.code));
// }, [role]);

// // narrow-screen split: first 3 as buttons, the rest inside "More"
// const mainRoles = visibleRoles.slice(0, 3);
// const moreRoles = visibleRoles.slice(3);

// // if the selected tab isn't allowed (default is "Owner"), jump to the first allowed one
// useEffect(() => {
//   if (visibleRoles.length && !visibleRoles.some((r) => r.name === roleName)) {
//     setRoleName(visibleRoles[0].name);
//   }
// }, [visibleRoles, roleName]);

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("All Statuses");
//   const [territory, setTerritory] = useState("All Territories");
//   const [area, setArea] = useState("All Areas");
//   const [store, setStore] = useState("All Stores");
//   const [department, setDepartment] = useState("All Departments");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   // add / edit sheet
//   const [editing, setEditing] = useState(null);
//   const [photoError, setPhotoError] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState("");
//   const [deleting, setDeleting] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [deleteError, setDeleteError] = useState("");
//   // IDs from GET /users/:id still waiting to be turned into labels
//   const [pendingAssign, setPendingAssign] = useState(null);

//   const isLoading = userslistStatus === "idle" || userslistLoading;

//   // ── 5.3 Dropdown options ────────────────────────────────────
//   const territoryOptions = useMemo(
//     () => uniqueLabels(territoryData, (t) => t.territoryName),
//     [territoryData],
//   );
//   const areaOptions = useMemo(() => uniqueLabels(areaData, areaLabel), [areaData]);
//   const storeOptions = useMemo(() => uniqueLabels(locationData, locationLabel), [locationData]);
//   const deptOptions = useMemo(() => uniqueLabels(deptData, deptLabel), [deptData]);

//   const optionLists = {
//     territory: territoryOptions,
//     area: areaOptions,
//     store: storeOptions,
//     department: deptOptions,
//   };
//   const loadingByKey = {
//     territory: territoryLoading,
//     area: areaLoading,
//     store: locationLoading,
//     department: deptLoading,
//   };

//   // ── 5.4 Label -> ID resolution (each level limited to its selected parent) ──
//   function resolveAssignmentIds(state) {
//     const territoryNames = assignmentValues(state.territory);
//     const territoryIds = uniq(
//       (territoryData ?? [])
//         .filter((t) => territoryNames.includes(t.territoryName))
//         .map((t) => t.territoryID),
//     );

//     const areaLabels = assignmentValues(state.area);
//     const areaIds = uniq(
//       (areaData ?? [])
//         .filter(
//           (a) => areaLabels.includes(areaLabel(a)) && territoryIds.includes(a.territoryID),
//         )
//         .map((a) => a.areaID),
//     );

//     const storeLabels = assignmentValues(state.store);
//     const locationIds = uniq(
//       (locationData ?? [])
//         .filter(
//           (l) =>
//             storeLabels.includes(locationLabel(l)) &&
//             (locationAreaId(l) == null || areaIds.includes(locationAreaId(l))),
//         )
//         .map(locationId),
//     );

//     const deptLabels = assignmentValues(state.department);
//     const departmentIds = uniq(
//       (deptData ?? [])
//         .filter(
//           (d) =>
//             deptLabels.includes(deptLabel(d)) &&
//             (deptLocationId(d) == null || locationIds.includes(deptLocationId(d))),
//         )
//         .map(departmentId),
//     );

//     return { territoryIds, areaIds, locationIds, departmentIds };
//   }

//   // keep only selections whose parent is still selected: territory > area > store > department
//   function pruneAssignments(state) {
//     const territoryIds = new Set(
//       (territoryData ?? [])
//         .filter((t) => assignmentValues(state.territory).includes(t.territoryName))
//         .map((t) => t.territoryID),
//     );
//     const areaValues = assignmentValues(state.area).filter((label) => {
//       const matches = (areaData ?? []).filter((a) => areaLabel(a) === label);
//       return !matches.length || matches.some((a) => territoryIds.has(a.territoryID));
//     });

//     const areaIds = new Set(
//       (areaData ?? [])
//         .filter((a) => areaValues.includes(areaLabel(a)))
//         .map((a) => a.areaID),
//     );
//     const storeValues = assignmentValues(state.store).filter((label) => {
//       const matches = (locationData ?? []).filter((l) => locationLabel(l) === label);
//       return (
//         !matches.length ||
//         matches.some((l) => locationAreaId(l) == null || areaIds.has(locationAreaId(l)))
//       );
//     });

//     const locationIds = new Set(
//       (locationData ?? [])
//         .filter((l) => storeValues.includes(locationLabel(l)))
//         .map(locationId),
//     );
//     const departmentValues = assignmentValues(state.department).filter((label) => {
//       const matches = (deptData ?? []).filter((d) => deptLabel(d) === label);
//       return (
//         !matches.length ||
//         matches.some((d) => deptLocationId(d) == null || locationIds.has(deptLocationId(d)))
//       );
//     });

//     return { ...state, area: areaValues, store: storeValues, department: departmentValues };
//   }

//   // ── 5.5 Effects ─────────────────────────────────────────────

//   // load users + territories on mount
//   useEffect(() => {
//     dispatch(Getuserslist());
//     dispatch(GetTerritorylist());
//   }, [dispatch]);

//   // copy the API list into local state (so edit / activate still work on screen)
//   useEffect(() => {
//     setUsers(
//       (userslistData ?? [])
//         .map(normalizeUser)
//         .filter((user) => user.role), // drop roles: null / unknown codes
//     );
//   }, [userslistData]);

//   // which selection drives the cascading fetches: the sheet while it is open,
//   // otherwise the table filters
//   const scope = editing ?? {
//     territory: territory === "All Territories" ? [] : [territory],
//     area: area === "All Areas" ? [] : [area],
//     store: store === "All Stores" ? [] : [store],
//     department: [],
//   };
//   const scopeIds = resolveAssignmentIds(scope);
//   const territoryIdsKey = scopeIds.territoryIds.join(",");
//   const areaIdsKey = scopeIds.areaIds.join(",");
//   const locationIdsKey = scopeIds.locationIds.join(",");

//   // territory -> areas (one request per territory ID)
//   useEffect(() => {
//     if (scopeIds.territoryIds.length) dispatch(GetAreaList(scopeIds.territoryIds));
//     else dispatch(clearAreaList());
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, territoryIdsKey]);

//   // areas -> stores (one request per area ID, only areas of the selected territories)
//   useEffect(() => {
//     if (scopeIds.areaIds.length) dispatch(GetLocationList(scopeIds.areaIds));
//     else dispatch(clearLocationList());
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, areaIdsKey]);

//   // stores -> departments (one request per store ID)
//   useEffect(() => {
//     if (scopeIds.locationIds.length) dispatch(GetdeptList(scopeIds.locationIds));
//     else dispatch(clearDepartmentList());
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, locationIdsKey]);

//   // EDIT A) API response -> fill the sheet's basic fields
//   useEffect(() => {
//     if (!editing?.id || editing.hydrated) return;

//     if (
//       edituserStatus === "succeeded" &&
//       String(edituserData?.user?.userId) === String(editing.userId)
//     ) {
//       const u = edituserData.user;
//       const callingCode = u.countryCode || "+1";
//       const code = String(u.roles ?? editing.roles ?? "").trim().toUpperCase();

//       setEditing((cur) =>
//         cur
//           ? {
//               ...cur,
//               name: u.fullName ?? cur.name,
//               email: u.emailID ?? cur.email,
//               mobile: u.mobileNumber ?? cur.mobile,
//               mobileCountry: countryByCallingCode[callingCode] || cur.mobileCountry,
//               mobileCountryCode: callingCode,
//               custnmbr: u.custnmbr ?? cur.custnmbr,
//               roles: code,
//               role: roleNameByCode[code] ?? cur.role,
//               status: u.isActive ? "Active" : "Inactive",
//               hydrated: true,
//             }
//           : cur,
//       );
//       setPendingAssign(edituserData.assignments);
//     } else if (edituserStatus === "failed") {
//       toast.error(
//         typeof edituserError === "string" ? edituserError : "Failed to load user details.",
//       );
//       setEditing((cur) => (cur ? { ...cur, hydrated: true } : cur)); // fall back to row data
//     }
//   }, [edituserStatus, edituserData, edituserError, editing]);

//   // EDIT B) assignment IDs -> labels, one level at a time
//   //    (territory -> area -> store -> department; each list loads after its parent is set)
//   useEffect(() => {
//     if (!pendingAssign || !editing?.hydrated) return;

//     const levels = [
//       ["territory", "territoryIds", territoryData, territoryLoading, (t) => t.territoryID, (t) => t.territoryName],
//       ["area", "areaIds", areaData, areaLoading, (a) => a.areaID, areaLabel],
//       ["store", "locationIds", locationData, locationLoading, locationId, locationLabel],
//       ["department", "departmentIds", deptData, deptLoading, departmentId, deptLabel],
//     ];

//     const patch = {};
//     const remaining = { ...pendingAssign };

//     for (const [field, idKey, list, loading, getId, getLabel] of levels) {
//       const ids = remaining[idKey];
//       if (ids === undefined) continue; // already applied
//       if (!ids.length) {
//         delete remaining[idKey];
//         continue;
//       }
//       if (loading) break; // wait for the list to finish loading
//       const idSet = new Set(ids.map(String));
//       const found = (list ?? []).filter((item) => idSet.has(String(getId(item))));
//       if (!found.length) break; // parent not applied / list not loaded yet
//       patch[field] = uniq(found.map(getLabel));
//       delete remaining[idKey];
//     }

//     const resolvedSomething =
//       Object.keys(remaining).length !== Object.keys(pendingAssign).length;
//     if (!resolvedSomething) return;

//     if (Object.keys(patch).length) {
//       setEditing((cur) => (cur ? { ...cur, ...patch } : cur));
//     }
//     setPendingAssign(Object.keys(remaining).length ? remaining : null);
//   }, [
//     pendingAssign,
//     editing?.hydrated,
//     territoryData,
//     territoryLoading,
//     areaData,
//     areaLoading,
//     locationData,
//     locationLoading,
//     deptData,
//     deptLoading,
//   ]);

//   // ── 5.6 Derived data ────────────────────────────────────────

//   // which table columns / filters apply to the selected role tab
//   const showTerritory = roleName !== "Owner";
//   const showArea = showTerritory && roleName !== "Territory Manager";
//   const showStore = showArea && roleName !== "Area Manager";
//   const showDepartment = roleName === "Department Manager" || roleName === "Employees";

//   // Assignment levels: Owner 0, Territory 1, Area 2, Store 3, Dept/Employee 4.
//   const sheetRoleCode = roleCodeByName[editing?.role] ?? "O";
//   const sheetAssignmentFields = assignmentFields.slice(
//     0,
//     (payloadKeysByRole[sheetRoleCode] ?? []).length,
//   );

//   // sheet: "Reports to" candidates (higher roles only)
//   const reportingGroups = roles
//     .slice(0, Math.max(0, roles.findIndex((role) => role.name === editing?.role)))
//     .map((role) => ({
//       ...role,
//       users: users.filter((user) => user.role === role.name && user.id !== editing?.id),
//     }));
//   const reportingUsers = reportingGroups.flatMap((group) => group.users);
//   const reportsTo = reportingUsers.find((user) => user.id === editing?.reportsTo);

//   // table filter definitions: [title, value, setter, options, disabled]
//   const filters = [
//     ...(showTerritory
//       ? [
//           [
//             "Territory",
//             territory,
//             (value) => {
//               setTerritory(value);
//               setArea("All Areas");
//               setStore("All Stores");
//               setDepartment("All Departments");
//             },
//             ["All Territories", ...territoryOptions],
//           ],
//         ]
//       : []),
//     ...(showArea
//       ? [
//           [
//             "Area",
//             area,
//             (value) => {
//               setArea(value);
//               setStore("All Stores");
//               setDepartment("All Departments");
//             },
//             ["All Areas", ...areaOptions],
//             territory === "All Territories",
//           ],
//         ]
//       : []),
//     ...(showStore
//       ? [
//           [
//             "Store",
//             store,
//             (value) => {
//               setStore(value);
//               setDepartment("All Departments");
//             },
//             ["All Stores", ...storeOptions],
//             area === "All Areas",
//           ],
//         ]
//       : []),
//     ...(showDepartment
//       ? [
//           [
//             "Department",
//             department,
//             setDepartment,
//             ["All Departments", ...deptOptions],
//             store === "All Stores",
//           ],
//         ]
//       : []),
//     ["Status", status, setStatus, ["All Statuses", "Active", "Inactive"]],
//   ];

//   const filteredUsers = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     return users.filter(
//       (user) =>
//         user.role === roleName &&
//         (status === "All Statuses" || user.status === status) &&
//         (!showTerritory ||
//           territory === "All Territories" ||
//           assignmentValues(user.territory).includes(territory)) &&
//         (!showArea || area === "All Areas" || assignmentValues(user.area).includes(area)) &&
//         (!showStore || store === "All Stores" || assignmentValues(user.store).includes(store)) &&
//         (!showDepartment ||
//           department === "All Departments" ||
//           assignmentValues(user.department).includes(department)) &&
//         `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(query),
//     );
//   }, [
//     users,
//     roleName,
//     search,
//     status,
//     territory,
//     area,
//     store,
//     department,
//     showTerritory,
//     showArea,
//     showStore,
//     showDepartment,
//   ]);

//   const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
//   const currentPage = Math.min(page, totalPages);
//   const rows = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   const columns = [
//     "Name",
//     "Contact No.",
//     ...(showTerritory ? ["Territory"] : []),
//     ...(showArea ? ["Area"] : []),
//     ...(showStore ? ["Store"] : []),
//     ...(showDepartment ? ["Department"] : []),
//     "Status",
//   ];

//   // ── 5.7 Handlers ────────────────────────────────────────────
//   function clearFilters() {
//     setSearch("");
//     setStatus("All Statuses");
//     setTerritory("All Territories");
//     setArea("All Areas");
//     setStore("All Stores");
//     setDepartment("All Departments");
//     setPage(1);
//   }

//   function selectRole(name) {
//     setRoleName(name);
//     clearFilters();
//   }

//   function openAddSheet() {
//     setSaveError("");
//     setPendingAssign(null);
//     setEditing({
//       role: roleName,
//       roles: roleCodeByName[roleName],
//       reportsTo: "",
//       territory: [],
//       area: [],
//       store: [],
//       department: [],
//       status: "Active",
//     });
//   }

//   // function openEditSheet(user) {
//   //   console.log("--calling openEditSheet--");
//   //   setSaveError("");
//   //   setPendingAssign(null);
//   //   setEditing({ ...user, hydrated: false }); // open sheet right away, show loader
//   //   dispatch(EdituserGet(user.userId));
//   // }
//   async function openEditSheet(user) {
//     console.log("--calling openEditSheet--");
//   setSaveError("");
//   setPendingAssign(null);
//   setEditing({ ...user, hydrated: false }); // open sheet, show loader

//   try {
//     const { user: u, assignments } = await dispatch(EdituserGet(user.userId)).unwrap();
//     console.log("EdituserGet response:", u, assignments);

//     const callingCode = u?.countryCode || user.mobileCountryCode || "+1";
//     const code = String(u?.roles ?? user.roles ?? "").trim().toUpperCase();

//     setEditing((cur) =>
//       cur && cur.id === user.id
//         ? {
//             ...cur,
//             name: u?.fullName ?? cur.name,
//             email: u?.emailID ?? cur.email,
//             mobile: u?.mobileNumber ?? cur.mobile,
//             mobileCountry: countryByCallingCode[callingCode] || cur.mobileCountry,
//             mobileCountryCode: callingCode,
//             custnmbr: u?.custnmbr ?? cur.custnmbr,
//             roles: code,
//             role: roleNameByCode[code] ?? cur.role,
//             status: u?.isActive ? "Active" : "Inactive",
//             hydrated: true,
//           }
//         : cur,
//     );
//     setPendingAssign(assignments); // effect B turns these IDs into labels
//   } catch (err) {
//     toast.error(typeof err === "string" ? err : err?.message || "Failed to load user details.");
//     setEditing((cur) => (cur && cur.id === user.id ? { ...cur, hydrated: true } : cur));
//   }
// }

//   function closeSheet() {
//     setEditing(null);
//     setPendingAssign(null);
//     setPhotoError("");
//     setSaveError("");
//   }
// function toggleUserStatus(user) {
//   const nextStatus = user.status === "Active" ? "Inactive" : "Active";
//   setUsers((current) =>
//     current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)),
//   );
//   toast.success(
//     `${user.name} ${nextStatus === "Active" ? "activated" : "deactivated"} successfully.`,
//   );
// }

// async function deleteUser() {
//   if (!deleting || isDeleting) return;
//   setIsDeleting(true);
//   setDeleteError("");
//   const target = deleting;
//   try {
//     const result = await dispatch(Deleteusers(target.userId)).unwrap();
//     setUsers((current) => current.filter((user) => user.id !== target.id));
//     setDeleting(null);
//     dispatch(Getuserslist()); // refresh the table
//     toast.success(result?.message || "User deleted successfully.");
//   } catch (error) {
//     const message =
//       typeof error === "string" ? error : error?.message || "Failed to delete user.";
//     setDeleteError(message); // keep the dialog open
//     toast.error(message);
//   } finally {
//     setIsDeleting(false);
//   }
// }

//   function uploadPhoto(event) {
//     const file = event.target.files?.[0];
//     event.target.value = "";
//     if (!file) return;
//     setPhotoError("");
//     if (
//       !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
//       file.size > 5 * 1024 * 1024
//     ) {
//       setPhotoError("Choose a JPG, PNG, or WebP image under 5 MB.");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onload = () =>
//       setEditing((current) => (current ? { ...current, avatar: reader.result } : current));
//     reader.onerror = () => setPhotoError("Unable to read this image. Please try another.");
//     reader.readAsDataURL(file);
//   }

// function buildUserPayload({ form, state, roleCode, isEdit = false }) {
//   const country = String(form.get("mobileCountry"));
//   const ids = resolveAssignmentIds(state);
//   const custnmbr =
//     state.custnmbr || users.find((u) => u.custnmbr)?.custnmbr || DEFAULT_CUSTNMBR;

//   const payload = {
//     countryCode: `+${getCountryCallingCode(country)}`,
//     mobileNumber: String(form.get("mobile")).trim(),
//     fullName: String(form.get("name")).trim(),
//     emailID: String(form.get("email")).trim(),
//     custnmbr,
//     roles: roleCode,
//     isVerified: true,
//     isActive: state.status !== "Inactive",
//   };

//   for (const key of payloadKeysByRole[roleCode] ?? []) {
//     payload[key] = ids[key];
//   }

//   if (isEdit) payload.modifiedBY = MODIFIED_BY;
//   else payload.createdBY = CREATED_BY;
//   return payload;
// }

// async function saveUser(event) {
//   event.preventDefault();
//   const form = new FormData(event.currentTarget);
//   const selectedRole = String(form.get("role"));
//   const roleCode = roleCodeByName[selectedRole];
//   const name = String(form.get("name")).trim();
//   if (!name) return;

//   const isEdit = Boolean(editing.id);

//   // build the role-specific payload and validate required assignments
//   const payload = buildUserPayload({ form, state: editing, roleCode, isEdit });
//   const missing = (payloadKeysByRole[roleCode] ?? []).find((key) => !payload[key]?.length);
//   if (missing) {
//     setSaveError(`Select at least one ${payloadKeyLabel[missing]}.`);
//     return;
//   }

//   setSaveError("");
//   setSaving(true);
//   try {
//     if (isEdit) {
//       console.log("--update user calling inside")
//       await dispatch(Updateusers({ id: editing.userId, data: payload })).unwrap();
//     } else {
//       await dispatch(Postusers({ data: payload })).unwrap();
//     }
//     dispatch(Getuserslist()); // refresh the table
//     selectRole(selectedRole);
//     closeSheet();
//      toast.success(
//       `${roleLabelByCode[roleCode]} ${isEdit ? "updated" : "created"} successfully.`,
//     );
//    } catch (err) {
//     const message =
//       typeof err === "string"
//         ? err
//         : err?.message || `Failed to ${isEdit ? "update" : "create"} user.`;
//     setSaveError(message);
//     toast.error(message);
//   } finally {
//     setSaving(false);
//   }
// }

//   // ── 5.8 Render ──────────────────────────────────────────────
//   return (
//     <section className="@container/roles min-w-0 space-y-3 p-3 sm:space-y-4 sm:p-4">
//       {/* ---------- Role tabs ---------- */}
//       <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
//         {/* wide screens */}
//         <div
//           className="hidden min-w-0 flex-nowrap gap-2 overflow-x-auto @[640px]/roles:flex"
//           role="group"
//           aria-label="Filter users by role"
//         >
//           {roles.map((item) => {
//             const Icon = item.icon;
//             const active = item.name === roleName;
//             return (
//               <button
//                 key={item.name}
//                 type="button"
//                 aria-label={item.name}
//                 aria-pressed={active}
//                 onClick={() => selectRole(item.name)}
//                 className={`relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${active ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-muted/30 text-foreground hover:bg-muted/60"}`}
//               >
//                 <Icon className={`size-4 shrink-0 ${item.color}`} />
//                 <span className="whitespace-nowrap @[1100px]/roles:hidden">{item.shortName}</span>
//                 <span className="hidden whitespace-nowrap @[1100px]/roles:inline">{item.name}</span>
//                 <span
//                   className={`hidden rounded-full px-2 py-0.5 text-xs tabular-nums @[1100px]/roles:inline ${active ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
//                 >
//                   {users.filter((user) => user.role === item.name).length}
//                 </span>
//                 {active && (
//                   <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-blue-500" />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* narrow screens */}
//         <div className="min-w-0 @[640px]/roles:hidden">
//           <div
//             className="grid w-full grid-cols-4 items-stretch gap-1.5 py-1"
//             role="group"
//             aria-label="Filter users by role"
//           >
//             {roles.filter((item) => ["T", "A", "S"].includes(item.code)).map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.name}
//                   type="button"
//                   aria-label={item.name}
//                   aria-pressed={roleName === item.name}
//                   onClick={() => selectRole(item.name)}
//                   className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-[10px] leading-tight font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${roleName === item.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
//                 >
//                   <Icon
//                     className={`size-3.5 shrink-0 ${roleName === item.name ? "text-primary-foreground" : item.color}`}
//                   />
//                   <span className="min-w-0 text-center">{item.shortName}</span>
//                 </button>
//               );
//             })}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   aria-label="More roles"
//                   className={`h-full min-h-10 w-full min-w-0 gap-1 rounded-md border-0 px-1 py-1 text-[10px] ${["Owner", "Department Manager", "Employees"].includes(roleName) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
//                 >
//                   More
//                   <ChevronDown className="size-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="min-w-60">
//                 <DropdownMenuRadioGroup value={roleName} onValueChange={selectRole}>
//                   {roles.filter((item) => ["O", "D", "E"].includes(item.code)).map((item) => {
//                     const Icon = item.icon;
//                     return (
//                       <DropdownMenuRadioItem
//                         key={item.name}
//                         value={item.name}
//                         className="gap-2 pr-12 whitespace-nowrap [&>[data-slot=dropdown-menu-radio-item-indicator]]:right-3"
//                       >
//                         <Icon className={`size-4 shrink-0 ${item.color}`} />
//                         <span className="mr-2">{item.shortName}</span>
//                       </DropdownMenuRadioItem>
//                     );
//                   })}
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
//             Selected: {roleName === "Employees" ? "Employee" : roleName}
//           </p>
//         </div>
//       </div>

//       {/* ---------- Search, filters, Add User ---------- */}
//       <div className="grid min-w-0 grid-cols-1 items-center gap-2 @[1200px]/roles:grid-cols-[18rem_minmax(0,1fr)]">
//         <label className="relative block w-full min-w-0">
//           <span className="sr-only">Search users</span>
//           <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//           <input
//             value={search}
//             onChange={(event) => {
//               setSearch(event.target.value);
//               setPage(1);
//             }}
//             placeholder="Search by name, email or employee ID..."
//             className={`${fieldClass} pl-9`}
//           />
//         </label>
//         <div
//           className="grid min-w-0 grid-cols-2 gap-2 @[720px]/roles:grid-cols-[repeat(var(--filter-count),minmax(0,1fr))] @[1200px]/roles:grid-cols-[repeat(var(--filter-count),minmax(0,9rem))] @[1200px]/roles:justify-end"
//           style={{ "--filter-count": filters.length + 1 }}
//         >
//           {filters.map(([title, value, setter, options, disabled], index) => (
//             <label
//               key={title}
//               className={`min-w-0 text-xs text-muted-foreground ${index === 0 && filters.length % 2 === 0 ? "col-span-2 @[720px]/roles:col-span-1" : ""}`}
//             >
//               <span className="sr-only">{title}</span>
//               <select
//                 value={value}
//                 disabled={disabled}
//                 onChange={(event) => {
//                   setter(event.target.value);
//                   setPage(1);
//                 }}
//                 className={`${fieldClass} text-foreground disabled:cursor-not-allowed disabled:opacity-50`}
//               >
//                 {options.map((option) => (
//                   <option key={option}>{option}</option>
//                 ))}
//               </select>
//             </label>
//           ))}
//           <Button
//             className="h-9 w-full min-w-0 gap-2 whitespace-nowrap px-3 text-xs"
//             onClick={openAddSheet}
//           >
//             <Plus className="size-4" />
//             Add User
//           </Button>
//         </div>
//       </div>

//       {/* ---------- Users load error ---------- */}
//       {userslistStatus === "failed" && (
//         <p role="alert" className="text-sm text-destructive">
//           {typeof userslistError === "string"
//             ? userslistError
//             : userslistError?.message || userslistError?.Msg || "Failed to load users."}
//         </p>
//       )}

//       {/* ---------- Users table ---------- */}
//       {isLoading ? (
//         <div
//           role="status"
//           aria-live="polite"
//           className="flex min-h-80 flex-col items-center justify-center gap-2 p-6 text-muted-foreground"
//         >
//           <Loader2 className="size-6 animate-spin text-primary" />
//           <p className="text-xs font-medium">Loading Users...</p>
//         </div>
//       ) : (
//         <div className="min-w-0 overflow-x-auto rounded-lg border">
//           <table
//             className={`w-full text-left text-sm ${showDepartment ? "min-w-[1120px]" : showStore ? "min-w-[960px]" : showTerritory ? "min-w-[680px]" : "min-w-[520px]"}`}
//           >
//             <caption className="sr-only">{roleName} users</caption>
//             <thead className="border-b admin-table-header text-xs text-muted-foreground">
//               <tr>
//                 {columns.map((title) => (
//                   <th key={title} scope="col" className="px-4 py-3 font-medium">
//                     {title}
//                   </th>
//                 ))}
//                 <th scope="col" className="px-4 py-3 text-right font-medium">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {rows.map((user, index) => (
//                 <tr key={user.id} className="transition-colors hover:bg-muted/30">
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       <Avatar className="size-8">
//                         <AvatarImage src={user.avatar || undefined} alt="" />
//                         <AvatarFallback
//                           className={`text-xs font-semibold ${avatarColors[index % avatarColors.length]}`}
//                         >
//                           {initials(user.name)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="min-w-0">
//                         <p className="whitespace-nowrap font-medium">{user.name}</p>
//                         <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
//                     {user.mobile ? `${user.mobileCountryCode || "+1"} ${user.mobile}` : "—"}
//                   </td>
//                   {showTerritory && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.territory} label="Territories" icon={MapPin} />
//                     </td>
//                   )}
//                   {showArea && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.area} label="Areas" icon={MapPin} />
//                     </td>
//                   )}
//                   {showStore && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.store} label="Stores" icon={Store} />
//                     </td>
//                   )}
//                   {showDepartment && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.department} label="Departments" icon={Network} />
//                     </td>
//                   )}
//                   <td className="px-4 py-3">
//                     <Badge
//                       variant="secondary"
//                       className={`rounded-full px-3 ${user.status === "Active" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/15 text-rose-700 dark:text-rose-400"}`}
//                     >
//                       {user.status}
//                     </Badge>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon-sm"
//                           aria-label={`Actions for ${user.name}`}
//                         >
//                           <MoreVertical className="size-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="w-auto min-w-32">
//                         <DropdownMenuItem
//                           className="whitespace-nowrap"
//                           onSelect={() => openEditSheet(user)}
//                         >
//                           <Pencil />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           className="whitespace-nowrap"
//                           onSelect={() => toggleUserStatus(user)}
//                         >
//                           <UserRoundCheck />
//                           {user.status === "Active" ? "Deactivate" : "Activate"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           variant="destructive"
//                           className="whitespace-nowrap"
//                           onSelect={() => {
//                             setDeleteError("");
//                             setDeleting(user);
//                           }}
//                         >
//                           <Trash2 />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </td>
//                 </tr>
//               ))}
//               {rows.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={columns.length + 1}
//                     className="px-4 py-12 text-center text-muted-foreground"
//                   >
//                     No users match your search or filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ---------- Pagination ---------- */}
//       {!isLoading && (
//         <PaginationCustomUsers
//           currentPage={currentPage}
//           totalPages={totalPages}
//           pageSize={pageSize}
//           totalItems={filteredUsers.length}
//           onPageChange={setPage}
//           onPageSizeChange={(size) => {
//             setPageSize(size);
//             setPage(1);
//           }}
//           itemLabel="users"
//           className="bg-transparent pt-0 pb-4"
//         />
//       )}

//       {/* ---------- Add / Edit sheet ---------- */}
//       <Dialog
//         open={Boolean(deleting)}
//         onOpenChange={(open) => {
//           if (!open && !isDeleting) setDeleting(null);
//         }}
//       >
//         <DialogContent showCloseButton={!isDeleting}>
//           <DialogHeader>
//             <DialogTitle>Delete user?</DialogTitle>
//             <DialogDescription>
//               Remove {deleting?.name}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
//           <DialogFooter>
//             <Button variant="outline" disabled={isDeleting} onClick={() => setDeleting(null)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" disabled={isDeleting} onClick={deleteUser}>
//               {isDeleting ? "Deleting..." : "Delete"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Sheet
//         open={Boolean(editing)}
//         onOpenChange={(open) => {
//           if (!open) closeSheet();
//         }}
//       >
//         <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
//           <SheetHeader className="gap-0 border-b">
//             <div className="flex items-center justify-between gap-3 pr-8">
//               <SheetTitle>{editing?.id ? "Edit User" : "Add User"}</SheetTitle>
//               <label
//                 className={`flex shrink-0 items-center gap-2 text-xs ${editing?.status === "Inactive" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
//               >
//                 <span>Status</span>
//                 <Switch
//                   aria-label="User active status"
//                   className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600 dark:data-[state=unchecked]:bg-red-600"
//                   checked={editing?.status !== "Inactive"}
//                   onCheckedChange={(checked) =>
//                     setEditing((current) =>
//                       current ? { ...current, status: checked ? "Active" : "Inactive" } : current,
//                     )
//                   }
//                 />
//               </label>
//             </div>
//             <SheetDescription className="text-xs leading-snug">
//               Enter contact details and assign a role.
//             </SheetDescription>
//           </SheetHeader>

//           {/* loader while GET /users/:id is in flight (edit only) */}
//           {editing?.id && !editing.hydrated && (
//             <div
//               role="status"
//               aria-live="polite"
//               className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-muted-foreground"
//             >
//               <Loader2 className="size-6 animate-spin text-primary" />
//               <p className="text-xs font-medium">Loading user...</p>
//             </div>
//           )}

//           {/* form: always for Add, for Edit only after the user is loaded */}
//           {editing && (!editing.id || editing.hydrated) && (
//             <form
//               key={editing.id || "new"}
//               onSubmit={saveUser}
//               className="flex min-h-0 flex-1 flex-col"
//             >
//               <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
//                 {/* photo + name + email */}
//                 <div className="grid min-w-0 grid-cols-[8rem_minmax(0,1fr)] items-center gap-4">
//                   <label className="relative size-30 cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png,image/webp"
//                       aria-label="Upload user photo"
//                       onChange={uploadPhoto}
//                       className="sr-only"
//                     />
//                     <Avatar className="size-30">
//                       <AvatarImage src={editing.avatar || undefined} alt="User photo preview" />
//                       <AvatarFallback className="bg-muted text-muted-foreground">
//                         <UserRoundCheck className="size-9" />
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="absolute right-2 bottom-2 z-10 grid size-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
//                       <Camera className="size-3" />
//                     </span>
//                   </label>
//                   <div className="flex h-32 min-w-0 flex-col justify-between gap-2">
//                     <label className="grid min-w-0 gap-1 text-sm">
//                       <span>Name</span>
//                       <input
//                         name="name"
//                         required
//                         maxLength={100}
//                         defaultValue={editing.name || ""}
//                         className={fieldClass}
//                       />
//                     </label>
//                     <label className="grid min-w-0 gap-1 text-sm">
//                       <span>Email</span>
//                       <input
//                         name="email"
//                         type="email"
//                         required
//                         defaultValue={editing.email || ""}
//                         className={fieldClass}
//                       />
//                     </label>
//                   </div>
//                 </div>
//                 {photoError && (
//                   <p role="alert" className="text-xs text-destructive">
//                     {photoError}
//                   </p>
//                 )}

//                 {/* contact number */}
//                 <fieldset className="min-w-0 space-y-1.5 text-sm">
//                   <legend>Contact No.</legend>
//                   <div
//                     className="grid min-w-0 items-center gap-2 text-xs"
//                     style={{
//                       gridTemplateColumns: `calc(${mobileCountryLabelLength}ch + 2rem) minmax(0, 1fr)`,
//                     }}
//                   >
//                     <select
//                       name="mobileCountry"
//                       aria-label="Contact country code"
//                       defaultValue={editing.mobileCountry || "US"}
//                       className={fieldClass}
//                       style={{ height: "2rem" }}
//                     >
//                       {mobileCountries.map(({ country, code }) => (
//                         <option key={country} value={country}>
//                           {country} {code}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       name="mobile"
//                       aria-label="Contact No."
//                       type="tel"
//                       autoComplete="tel-national"
//                       defaultValue={editing.mobile || ""}
//                       className={fieldClass}
//                     />
//                   </div>
//                 </fieldset>

//                 {/* role */}
//                 <label className="block space-y-1.5 text-sm">
//                   <span>Role</span>
//                   <select
//                     name="role"
//                     value={editing.role}
//                     onChange={(event) => {
//                       setSaveError("");
//                       setEditing((current) => ({
//                         ...current,
//                         role: event.target.value,
//                         roles: roleCodeByName[event.target.value],
//                         reportsTo: "",
//                       }));
//                     }}
//                     className={fieldClass}
//                   >
//                     {roles.map((item) => (
//                       <option key={item.name}>{item.name}</option>
//                     ))}
//                   </select>
//                 </label>

//                 {/* reports to */}
//                 <ReportsToSelect
//                   role={editing.role}
//                   groups={reportingGroups}
//                   selectedUser={reportsTo}
//                   onChange={(value) =>
//                     setEditing((current) => ({ ...current, reportsTo: value }))
//                   }
//                 />

//                 {/* territory > area > store > department */}
//                 {sheetAssignmentFields.map(([key, title], index) => {
//                   const parent = sheetAssignmentFields[index - 1];
//                   const parentEmpty = parent && !assignmentValues(editing[parent[0]]).length;
//                   return (
//                     <AssignmentSelect
//                       key={key}
//                       fieldKey={key}
//                       title={title}
//                       options={optionLists[key] ?? []}
//                       selected={assignmentValues(editing[key])}
//                       loading={Boolean(loadingByKey[key])}
//                       parentTitle={parentEmpty ? parent[1] : null}
//                       onChange={(next) =>
//                         setEditing((current) =>
//                           current ? pruneAssignments({ ...current, [key]: next }) : current,
//                         )
//                       }
//                     />
//                   );
//                 })}
//               </div>

//               {saveError && (
//                 <p role="alert" className="px-4 pb-2 text-xs text-destructive">
//                   {saveError}
//                 </p>
//               )}
//               <SheetFooter className="grid grid-cols-2 border-t">
//                 <SheetClose asChild>
//                   <Button type="button" variant="outline" className="w-full" disabled={saving}>
//                     Cancel
//                   </Button>
//                 </SheetClose>
//                 <Button type="submit" className="w-full" disabled={saving}>
//                   {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
//                 </Button>
//               </SheetFooter>
//             </form>
//           )}
//         </SheetContent>
//       </Sheet>
//     </section>
//   );
// }


//********************************* TO CONFIGURE THE ADMIN PORTAL USERS SCREEN DESIGN SECTION ***************************//
// "use client";

// // ─────────────────────────────────────────────────────────────
// // 1. IMPORTS
// // ─────────────────────────────────────────────────────────────
// import { useEffect, useId, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";
// import { Popover } from "radix-ui";
// import { getCountries, getCountryCallingCode } from "libphonenumber-js/min";
// import {
//   Crown,
//   MapPin,
//   Map,
//   Store,
//   Network,
//   Users,
//   Search,
//   Plus,
//   MoreVertical,
//   Pencil,
//   UserRoundCheck,
//   ChevronDown,
//   Loader2,
//   Camera,
//   Trash2,
// } from "lucide-react";

// import {
//   Getuserslist,
//   GetTerritorylist,
//   GetAreaList,
//   GetLocationList,
//   GetdeptList,
//   clearAreaList,
//   clearLocationList,
//   clearDepartmentList,
//   EdituserGet,
// } from "../../redux/slices/getSlice";
// import { Postusers, Updateusers, Deleteusers } from "../../redux/slices/postSlice";
// import { assignmentFields, assignmentValues } from "@/lib/user-assignments";
// import { can, canAct, getManageableRoles, getVisibleRoles } from "@/lib/permissions";
// import { PaginationCustomUsers } from "@/components/ui/pagination-custom";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuCheckboxItem,
//   DropdownMenuGroup,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";

// // ─────────────────────────────────────────────────────────────
// // 2. CONSTANTS
// // ─────────────────────────────────────────────────────────────

// // `code` is the value the API sends in the `roles` field
// const roles = [
//   { code: "O", name: "Owner", shortName: "Owner", icon: Crown, color: "text-blue-500" },
//   { code: "T", name: "Territory Manager", shortName: "Territory", icon: MapPin, color: "text-violet-500" },
//   { code: "A", name: "Area Manager", shortName: "Area", icon: Map, color: "text-cyan-500" },
//   { code: "S", name: "Store Manager", shortName: "Store", icon: Store, color: "text-emerald-500" },
//   { code: "D", name: "Department Manager", shortName: "Department", icon: Network, color: "text-orange-500" },
//   { code: "E", name: "Employees", shortName: "Employee", icon: Users, color: "text-slate-500" },
// ];

// const roleNameByCode = Object.fromEntries(roles.map((r) => [r.code, r.name]));
// const roleCodeByName = Object.fromEntries(roles.map((r) => [r.name, r.code]));

// // which ID arrays each role sends in the POST /users payload
// const payloadKeysByRole = {
//   O: [],
//   T: ["territoryIds"],
//   A: ["territoryIds", "areaIds"],
//   S: ["territoryIds", "areaIds", "locationIds"],
//   D: ["territoryIds", "areaIds", "locationIds", "departmentIds"],
//   E: ["territoryIds", "areaIds", "locationIds", "departmentIds"],
// };

// // label used in toast messages
// const roleLabelByCode = {
//   O: "Owner",
//   T: "Territory Manager",
//   A: "Area Manager",
//   S: "Store Manager",
//   D: "Department Manager",
//   E: "Employee",
// };
// // payload key -> label used in validation messages
// const payloadKeyLabel = {
//   territoryIds: "territory",
//   areaIds: "area",
//   locationIds: "store",
//   departmentIds: "department",
// };

// // TODO: replace with the logged-in user's id
// const CREATED_BY = 18;
// const MODIFIED_BY = 18;
// // fallback customer number when no existing user carries one
// const DEFAULT_CUSTNMBR = process.env.NEXT_PUBLIC_CUSTNMBR ?? "";

// const mobileCountries = getCountries().map((country) => ({
//   country,
//   code: `+${getCountryCallingCode(country)}`,
// }));
// const mobileCountryLabelLength = Math.max(
//   ...mobileCountries.map(({ country, code }) => `${country} ${code}`.length),
// );

// // calling code (e.g. "+91") -> ISO country (e.g. "IN")
// const preferredCountryByCode = { "+1": "US", "+44": "GB", "+7": "RU", "+61": "AU" };
// const countryByCallingCode = mobileCountries.reduce(
//   (map, { country, code }) => {
//     if (!map[code]) map[code] = country;
//     return map;
//   },
//   { ...preferredCountryByCode },
// );

// const fieldClass =
//   "h-9 w-full min-w-0 rounded-md border bg-background px-2 text-xs font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring";
// const avatarColors = [
//   "bg-blue-500/10 text-blue-600 dark:text-blue-400",
//   "bg-violet-500/10 text-violet-600 dark:text-violet-400",
//   "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
// ];

// // ─────────────────────────────────────────────────────────────
// // 3. HELPERS (pure functions, no React)
// // ─────────────────────────────────────────────────────────────

// // API user -> shape used by this screen
// function normalizeUser(u) {
//   const rawId = u.userId ?? u.userID ?? u.userid ?? u.id;
//   const code = u.roles ? String(u.roles).trim().toUpperCase() : null;
//   const callingCode = u.countryCode || "+1";
//   return {
//     id: String(rawId),
//     userId: rawId,
//     name: u.fullName ?? "",
//     email: u.emailID ?? "",
//     mobile: u.mobileNumber ?? "",
//     mobileCountry: countryByCallingCode[callingCode] || "US",
//     mobileCountryCode: callingCode,
//     custnmbr: u.custnmbr ?? "",
//     roles: code,
//     role: roleNameByCode[code] ?? null, // null when roles is null or an unknown code
//     status: u.isActive ? "Active" : "Inactive",
//     reportsTo: "",
//     avatar: "",
//     territory: [],
//     area: [],
//     store: [],
//     department: [],
//   };
// }

// // label / id accessors for the API lists (adjust field names here if your API differs)
// const areaLabel = (a) => [a.city, a.state].filter(Boolean).join(", ");
// const locationLabel = (l) => l.locationName ?? l.storeName ?? l.locationCode ?? l.name ?? "";
// const deptLabel = (d) => d.departmentName ?? d.deptName ?? d.departmentCode ?? d.name ?? "";
// const locationId = (l) => l.locationID ?? l.locationId;
// const locationAreaId = (l) => l.areaID ?? l.areaId;
// const deptLocationId = (d) => d.locationID ?? d.locationId;
// const departmentId = (d) => d.departmentID ?? d.departmentId ?? d.deptID ?? d.deptId;

// // unique, non-empty labels of the active items
// function uniqueLabels(list, getLabel) {
//   const seen = new Set();
//   const out = [];
//   for (const item of list ?? []) {
//     if (item.isActive === false) continue;
//     const label = getLabel(item);
//     if (!label || seen.has(label)) continue;
//     seen.add(label);
//     out.push(label);
//   }
//   return out;
// }

// const uniq = (arr) => [...new Set(arr.filter((v) => v != null))];
// const initials = (name) =>
//   name
//     .split(" ")
//     .map((part) => part[0])
//     .slice(0, 2)
//     .join("");

// // ─────────────────────────────────────────────────────────────
// // 4. SMALL COMPONENTS
// // ─────────────────────────────────────────────────────────────

// // table cell: first two values + "+N" popover
// function AssignmentList({ value, label, icon: Icon }) {
//   const titleId = useId();
//   const values = [...new Set(assignmentValues(value))];
//   if (!values.length) return <span className="text-muted-foreground">—</span>;

//   return (
//     <div className="space-y-1 whitespace-nowrap text-xs text-muted-foreground">
//       <div>
//         {values[0]}
//         {values.length > 1 ? "," : ""}
//       </div>
//       {values.length > 1 && (
//         <div className="flex items-center gap-1.5">
//           <span>
//             {values[1]}
//             {values.length > 2 ? "," : ""}
//           </span>
//           {values.length > 2 && (
//             <Popover.Root>
//               <Popover.Trigger asChild>
//                 <button
//                   type="button"
//                   aria-label={`Show all ${values.length} assigned ${label.toLowerCase()}`}
//                   className="shrink-0 rounded-sm text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                 >
//                   +{values.length - 2}
//                 </button>
//               </Popover.Trigger>
//               <Popover.Portal>
//                 <Popover.Content
//                   align="start"
//                   sideOffset={8}
//                   collisionPadding={12}
//                   aria-labelledby={titleId}
//                   className="z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none"
//                 >
//                   <h3 id={titleId} className="mb-3 text-sm font-semibold">
//                     Assigned {label.toLowerCase()} ({values.length})
//                   </h3>
//                   <ul className="max-h-60 space-y-2 overflow-y-auto">
//                     {values.map((item) => (
//                       <li key={item} className="flex items-start gap-2 text-xs">
//                         <Icon className="size-4 shrink-0 text-muted-foreground" />
//                         <span className="break-words">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <Popover.Arrow className="fill-popover" />
//                 </Popover.Content>
//               </Popover.Portal>
//             </Popover.Root>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // sheet: multi-select dropdown for territory / area / store / department
// function AssignmentSelect({
//   fieldKey,
//   title,
//   options,
//   selected,
//   loading,
//   parentTitle, // set when the parent field is still empty (disables this dropdown)
//   onChange,
// }) {
//   const disabled = Boolean(parentTitle);

//   return (
//     <div className="min-w-0 space-y-1.5 text-sm">
//       <span id={`user-${fieldKey}-label`}>{title}</span>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             type="button"
//             variant="outline"
//             disabled={disabled}
//             aria-labelledby={`user-${fieldKey}-label user-${fieldKey}-value`}
//             className="h-9 w-full justify-between gap-2 px-2 text-xs font-normal"
//           >
//             <span
//               id={`user-${fieldKey}-value`}
//               className="min-w-0 truncate"
//               title={selected.join(", ")}
//             >
//               {selected.length
//                 ? selected.join(", ")
//                 : loading
//                   ? `Loading ${title.toLowerCase()}...`
//                   : disabled
//                     ? `Select ${parentTitle.toLowerCase()} first`
//                     : `Select ${title.toLowerCase()}`}
//             </span>
//             <span className="flex shrink-0 items-center gap-2">
//               {selected.length > 1 && (
//                 <span className="rounded bg-primary/10 px-1.5 text-primary">
//                   {selected.length}
//                 </span>
//               )}
//               <ChevronDown className="size-4" />
//             </span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           align="start"
//           className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)]"
//         >
//           {options.length === 0 && (
//             <DropdownMenuItem disabled className="text-xs">
//               {loading ? "Loading..." : "No options available"}
//             </DropdownMenuItem>
//           )}
//           {options.map((value) => (
//             <DropdownMenuCheckboxItem
//               key={value}
//               checked={selected.includes(value)}
//               onSelect={(event) => event.preventDefault()}
//               onCheckedChange={(checked) =>
//                 onChange(
//                   checked
//                     ? [...new Set([...selected, value])]
//                     : selected.filter((item) => item !== value),
//                 )
//               }
//               className="text-xs"
//             >
//               {value}
//             </DropdownMenuCheckboxItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// // sheet: "Reports to" dropdown grouped by higher roles
// function ReportsToSelect({ role, groups, selectedUser, onChange }) {
//   const hasUsers = groups.some((group) => group.users.length);

//   return (
//     <div className="min-w-0 space-y-1.5 text-sm">
//       <span id="user-reports-to-label">Reports to</span>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             type="button"
//             variant="outline"
//             disabled={!hasUsers}
//             aria-labelledby="user-reports-to-label user-reports-to-value"
//             className="h-9 w-full justify-between gap-2 px-2 text-xs font-normal"
//           >
//             <span id="user-reports-to-value" className="min-w-0 truncate">
//               {selectedUser
//                 ? selectedUser.name
//                 : role === "Owner"
//                   ? "No reporting manager for Owner"
//                   : hasUsers
//                     ? "Select reporting manager"
//                     : "No higher-level users available"}
//             </span>
//             <ChevronDown className="size-4 shrink-0" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           align="start"
//           className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)]"
//         >
//           <DropdownMenuRadioGroup value={selectedUser?.id || ""} onValueChange={onChange}>
//             <DropdownMenuRadioItem value="" className="text-xs">
//               No reporting manager
//             </DropdownMenuRadioItem>
//             {groups.map((group) => (
//               <DropdownMenuGroup key={group.name} aria-label={group.name}>
//                 <DropdownMenuLabel className="mt-2 mb-2 border-b border-border px-2 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
//                   {group.shortName}
//                 </DropdownMenuLabel>
//                 {group.users.length ? (
//                   group.users.map((user) => (
//                     <DropdownMenuRadioItem key={user.id} value={user.id} className="text-xs">
//                       {user.name}
//                     </DropdownMenuRadioItem>
//                   ))
//                 ) : (
//                   <DropdownMenuItem disabled className="text-xs">
//                     No users available
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuGroup>
//             ))}
//           </DropdownMenuRadioGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // 5. MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────
// export default function Employees() {
//   const dispatch = useDispatch();

//   // logged-in user's role CODE ("O" | "T" | "S" | "D" | "E"), read on the client
//   const [role, setRole] = useState(null);
//   useEffect(() => {
//     setRole(localStorage.getItem("roles"));
//   }, []);

//   // ── 5.1 Redux data ──────────────────────────────────────────
//   const userslistData = useSelector((state) => state.getSlice.userslistData);
//   const userslistLoading = useSelector((state) => state.getSlice.userslistLoading);
//   const userslistStatus = useSelector((state) => state.getSlice.userslistStatus);
//   const userslistError = useSelector((state) => state.getSlice.userslistError);

//   const territoryData = useSelector((state) => state.getSlice.territoryData);
//   const territoryLoading = useSelector((state) => state.getSlice.territoryLoading);
//   const areaData = useSelector((state) => state.getSlice.areaData);
//   const areaLoading = useSelector((state) => state.getSlice.areaLoading);
//   const locationData = useSelector((state) => state.getSlice.locationData);
//   const locationLoading = useSelector((state) => state.getSlice.locationLoading);
//   const deptData = useSelector((state) => state.getSlice.deptData);
//   const deptLoading = useSelector((state) => state.getSlice.deptLoading);

//   // user by id (edit sheet)
//   const edituserData = useSelector((state) => state.getSlice.edituserData);
//   const edituserStatus = useSelector((state) => state.getSlice.edituserStatus);
//   const edituserError = useSelector((state) => state.getSlice.edituserError);

//   // ── 5.2 Local state ─────────────────────────────────────────
//   const [users, setUsers] = useState([]);

//   // table filters
//   const [roleName, setRoleName] = useState("Owner");
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("All Statuses");
//   const [territory, setTerritory] = useState("All Territories");
//   const [area, setArea] = useState("All Areas");
//   const [store, setStore] = useState("All Stores");
//   const [department, setDepartment] = useState("All Departments");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   // add / edit sheet
//   const [editing, setEditing] = useState(null);
//   const [photoError, setPhotoError] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState("");
//   const [deleting, setDeleting] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [deleteError, setDeleteError] = useState("");
//   // IDs from GET /users/:id still waiting to be turned into labels
//   const [pendingAssign, setPendingAssign] = useState(null);

//   const isLoading = userslistStatus === "idle" || userslistLoading;

//   // ── 5.2b Permission-based tabs (employee.view -> visibleRoles) ──
//   // Tabs the logged-in role may see, in the order defined in `roles`
//   const visibleRoles = useMemo(() => {
//     const allowed = getVisibleRoles(role);
//     return roles.filter((r) => allowed.includes(r.code));
//   }, [role]);

//   // Narrow screens: first 3 as buttons, the rest inside the "More" menu
//   const mainRoles = visibleRoles.slice(0, 3);
//   const moreRoles = visibleRoles.slice(3);

//   // Roles the logged-in user may create / assign in the sheet
//   const manageableCodes = useMemo(() => getManageableRoles(role), [role]);
//   const canCreate = canAct(role, "employee.create");
//   const canEdit = canAct(role, "employee.edit");
//   const canDeactivate = canAct(role, "employee.deactivate");

//   // If the selected tab isn't allowed (default is "Owner"), jump to the first allowed one
//   useEffect(() => {
//     if (visibleRoles.length && !visibleRoles.some((r) => r.name === roleName)) {
//       setRoleName(visibleRoles[0].name);
//     }
//   }, [visibleRoles, roleName]);

//   // ── 5.3 Dropdown options ────────────────────────────────────
//   const territoryOptions = useMemo(
//     () => uniqueLabels(territoryData, (t) => t.territoryName),
//     [territoryData],
//   );
//   const areaOptions = useMemo(() => uniqueLabels(areaData, areaLabel), [areaData]);
//   const storeOptions = useMemo(() => uniqueLabels(locationData, locationLabel), [locationData]);
//   const deptOptions = useMemo(() => uniqueLabels(deptData, deptLabel), [deptData]);

//   const optionLists = {
//     territory: territoryOptions,
//     area: areaOptions,
//     store: storeOptions,
//     department: deptOptions,
//   };
//   const loadingByKey = {
//     territory: territoryLoading,
//     area: areaLoading,
//     store: locationLoading,
//     department: deptLoading,
//   };

//   // ── 5.4 Label -> ID resolution (each level limited to its selected parent) ──
//   function resolveAssignmentIds(state) {
//     const territoryNames = assignmentValues(state.territory);
//     const territoryIds = uniq(
//       (territoryData ?? [])
//         .filter((t) => territoryNames.includes(t.territoryName))
//         .map((t) => t.territoryID),
//     );

//     const areaLabels = assignmentValues(state.area);
//     const areaIds = uniq(
//       (areaData ?? [])
//         .filter(
//           (a) => areaLabels.includes(areaLabel(a)) && territoryIds.includes(a.territoryID),
//         )
//         .map((a) => a.areaID),
//     );

//     const storeLabels = assignmentValues(state.store);
//     const locationIds = uniq(
//       (locationData ?? [])
//         .filter(
//           (l) =>
//             storeLabels.includes(locationLabel(l)) &&
//             (locationAreaId(l) == null || areaIds.includes(locationAreaId(l))),
//         )
//         .map(locationId),
//     );

//     const deptLabels = assignmentValues(state.department);
//     const departmentIds = uniq(
//       (deptData ?? [])
//         .filter(
//           (d) =>
//             deptLabels.includes(deptLabel(d)) &&
//             (deptLocationId(d) == null || locationIds.includes(deptLocationId(d))),
//         )
//         .map(departmentId),
//     );

//     return { territoryIds, areaIds, locationIds, departmentIds };
//   }

//   // keep only selections whose parent is still selected: territory > area > store > department
//   function pruneAssignments(state) {
//     const territoryIds = new Set(
//       (territoryData ?? [])
//         .filter((t) => assignmentValues(state.territory).includes(t.territoryName))
//         .map((t) => t.territoryID),
//     );
//     const areaValues = assignmentValues(state.area).filter((label) => {
//       const matches = (areaData ?? []).filter((a) => areaLabel(a) === label);
//       return !matches.length || matches.some((a) => territoryIds.has(a.territoryID));
//     });

//     const areaIds = new Set(
//       (areaData ?? [])
//         .filter((a) => areaValues.includes(areaLabel(a)))
//         .map((a) => a.areaID),
//     );
//     const storeValues = assignmentValues(state.store).filter((label) => {
//       const matches = (locationData ?? []).filter((l) => locationLabel(l) === label);
//       return (
//         !matches.length ||
//         matches.some((l) => locationAreaId(l) == null || areaIds.has(locationAreaId(l)))
//       );
//     });

//     const locationIds = new Set(
//       (locationData ?? [])
//         .filter((l) => storeValues.includes(locationLabel(l)))
//         .map(locationId),
//     );
//     const departmentValues = assignmentValues(state.department).filter((label) => {
//       const matches = (deptData ?? []).filter((d) => deptLabel(d) === label);
//       return (
//         !matches.length ||
//         matches.some((d) => deptLocationId(d) == null || locationIds.has(deptLocationId(d)))
//       );
//     });

//     return { ...state, area: areaValues, store: storeValues, department: departmentValues };
//   }

//   // ── 5.5 Effects ─────────────────────────────────────────────

//   // load users + territories on mount
//   useEffect(() => {
//     dispatch(Getuserslist());
//     dispatch(GetTerritorylist());
//   }, [dispatch]);

//   // copy the API list into local state (so edit / activate still work on screen)
//   useEffect(() => {
//     setUsers(
//       (userslistData ?? [])
//         .map(normalizeUser)
//         .filter((user) => user.role), // drop roles: null / unknown codes
//     );
//   }, [userslistData]);

//   // which selection drives the cascading fetches: the sheet while it is open,
//   // otherwise the table filters
//   const scope = editing ?? {
//     territory: territory === "All Territories" ? [] : [territory],
//     area: area === "All Areas" ? [] : [area],
//     store: store === "All Stores" ? [] : [store],
//     department: [],
//   };
//   const scopeIds = resolveAssignmentIds(scope);
//   const territoryIdsKey = scopeIds.territoryIds.join(",");
//   const areaIdsKey = scopeIds.areaIds.join(",");
//   const locationIdsKey = scopeIds.locationIds.join(",");

//   // territory -> areas (one request per territory ID)
//   useEffect(() => {
//     if (scopeIds.territoryIds.length) dispatch(GetAreaList(scopeIds.territoryIds));
//     else dispatch(clearAreaList());
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, territoryIdsKey]);

//   // areas -> stores (one request per area ID, only areas of the selected territories)
//   useEffect(() => {
//     if (scopeIds.areaIds.length) dispatch(GetLocationList(scopeIds.areaIds));
//     else dispatch(clearLocationList());
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, areaIdsKey]);

//   // stores -> departments (one request per store ID)
//   useEffect(() => {
//     if (scopeIds.locationIds.length) dispatch(GetdeptList(scopeIds.locationIds));
//     else dispatch(clearDepartmentList());
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, locationIdsKey]);

//   // EDIT A) API response -> fill the sheet's basic fields
//   useEffect(() => {
//     if (!editing?.id || editing.hydrated) return;

//     if (
//       edituserStatus === "succeeded" &&
//       String(edituserData?.user?.userId) === String(editing.userId)
//     ) {
//       const u = edituserData.user;
//       const callingCode = u.countryCode || "+1";
//       const code = String(u.roles ?? editing.roles ?? "").trim().toUpperCase();

//       setEditing((cur) =>
//         cur
//           ? {
//               ...cur,
//               name: u.fullName ?? cur.name,
//               email: u.emailID ?? cur.email,
//               mobile: u.mobileNumber ?? cur.mobile,
//               mobileCountry: countryByCallingCode[callingCode] || cur.mobileCountry,
//               mobileCountryCode: callingCode,
//               custnmbr: u.custnmbr ?? cur.custnmbr,
//               roles: code,
//               role: roleNameByCode[code] ?? cur.role,
//               status: u.isActive ? "Active" : "Inactive",
//               hydrated: true,
//             }
//           : cur,
//       );
//       setPendingAssign(edituserData.assignments);
//     } else if (edituserStatus === "failed") {
//       toast.error(
//         typeof edituserError === "string" ? edituserError : "Failed to load user details.",
//       );
//       setEditing((cur) => (cur ? { ...cur, hydrated: true } : cur)); // fall back to row data
//     }
//   }, [edituserStatus, edituserData, edituserError, editing]);

//   // EDIT B) assignment IDs -> labels, one level at a time
//   //    (territory -> area -> store -> department; each list loads after its parent is set)
//   useEffect(() => {
//     if (!pendingAssign || !editing?.hydrated) return;

//     const levels = [
//       ["territory", "territoryIds", territoryData, territoryLoading, (t) => t.territoryID, (t) => t.territoryName],
//       ["area", "areaIds", areaData, areaLoading, (a) => a.areaID, areaLabel],
//       ["store", "locationIds", locationData, locationLoading, locationId, locationLabel],
//       ["department", "departmentIds", deptData, deptLoading, departmentId, deptLabel],
//     ];

//     const patch = {};
//     const remaining = { ...pendingAssign };

//     for (const [field, idKey, list, loading, getId, getLabel] of levels) {
//       const ids = remaining[idKey];
//       if (ids === undefined) continue; // already applied
//       if (!ids.length) {
//         delete remaining[idKey];
//         continue;
//       }
//       if (loading) break; // wait for the list to finish loading
//       const idSet = new Set(ids.map(String));
//       const found = (list ?? []).filter((item) => idSet.has(String(getId(item))));
//       if (!found.length) break; // parent not applied / list not loaded yet
//       patch[field] = uniq(found.map(getLabel));
//       delete remaining[idKey];
//     }

//     const resolvedSomething =
//       Object.keys(remaining).length !== Object.keys(pendingAssign).length;
//     if (!resolvedSomething) return;

//     if (Object.keys(patch).length) {
//       setEditing((cur) => (cur ? { ...cur, ...patch } : cur));
//     }
//     setPendingAssign(Object.keys(remaining).length ? remaining : null);
//   }, [
//     pendingAssign,
//     editing?.hydrated,
//     territoryData,
//     territoryLoading,
//     areaData,
//     areaLoading,
//     locationData,
//     locationLoading,
//     deptData,
//     deptLoading,
//   ]);

//   // ── 5.6 Derived data ────────────────────────────────────────

//   // which table columns / filters apply to the selected role tab
//   const showTerritory = roleName !== "Owner";
//   const showArea = showTerritory && roleName !== "Territory Manager";
//   const showStore = showArea && roleName !== "Area Manager";
//   const showDepartment = roleName === "Department Manager" || roleName === "Employees";

//   // Assignment levels: Owner 0, Territory 1, Area 2, Store 3, Dept/Employee 4.
//   const sheetRoleCode = roleCodeByName[editing?.role] ?? "O";
//   const sheetAssignmentFields = assignmentFields.slice(
//     0,
//     (payloadKeysByRole[sheetRoleCode] ?? []).length,
//   );

//   // sheet: Role dropdown options = roles the user may manage (+ the role already on the record)
//   const sheetRoleOptions = roles.filter(
//     (r) => manageableCodes.includes(r.code) || r.name === editing?.role,
//   );

//   // sheet: "Reports to" candidates (higher roles only)
//   const reportingGroups = roles
//     .slice(0, Math.max(0, roles.findIndex((r) => r.name === editing?.role)))
//     .map((r) => ({
//       ...r,
//       users: users.filter((user) => user.role === r.name && user.id !== editing?.id),
//     }));
//   const reportingUsers = reportingGroups.flatMap((group) => group.users);
//   const reportsTo = reportingUsers.find((user) => user.id === editing?.reportsTo);

//   // table filter definitions: [title, value, setter, options, disabled]
//   const filters = [
//     ...(showTerritory
//       ? [
//           [
//             "Territory",
//             territory,
//             (value) => {
//               setTerritory(value);
//               setArea("All Areas");
//               setStore("All Stores");
//               setDepartment("All Departments");
//             },
//             ["All Territories", ...territoryOptions],
//           ],
//         ]
//       : []),
//     ...(showArea
//       ? [
//           [
//             "Area",
//             area,
//             (value) => {
//               setArea(value);
//               setStore("All Stores");
//               setDepartment("All Departments");
//             },
//             ["All Areas", ...areaOptions],
//             territory === "All Territories",
//           ],
//         ]
//       : []),
//     ...(showStore
//       ? [
//           [
//             "Store",
//             store,
//             (value) => {
//               setStore(value);
//               setDepartment("All Departments");
//             },
//             ["All Stores", ...storeOptions],
//             area === "All Areas",
//           ],
//         ]
//       : []),
//     ...(showDepartment
//       ? [
//           [
//             "Department",
//             department,
//             setDepartment,
//             ["All Departments", ...deptOptions],
//             store === "All Stores",
//           ],
//         ]
//       : []),
//     ["Status", status, setStatus, ["All Statuses", "Active", "Inactive"]],
//   ];

//   const filteredUsers = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     return users.filter(
//       (user) =>
//         user.role === roleName &&
//         (status === "All Statuses" || user.status === status) &&
//         (!showTerritory ||
//           territory === "All Territories" ||
//           assignmentValues(user.territory).includes(territory)) &&
//         (!showArea || area === "All Areas" || assignmentValues(user.area).includes(area)) &&
//         (!showStore || store === "All Stores" || assignmentValues(user.store).includes(store)) &&
//         (!showDepartment ||
//           department === "All Departments" ||
//           assignmentValues(user.department).includes(department)) &&
//         `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(query),
//     );
//   }, [
//     users,
//     roleName,
//     search,
//     status,
//     territory,
//     area,
//     store,
//     department,
//     showTerritory,
//     showArea,
//     showStore,
//     showDepartment,
//   ]);

//   const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
//   const currentPage = Math.min(page, totalPages);
//   const rows = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   const columns = [
//     "Name",
//     "Contact No.",
//     ...(showTerritory ? ["Territory"] : []),
//     ...(showArea ? ["Area"] : []),
//     ...(showStore ? ["Store"] : []),
//     ...(showDepartment ? ["Department"] : []),
//     "Status",
//   ];

//   // ── 5.7 Handlers ────────────────────────────────────────────
//   function clearFilters() {
//     setSearch("");
//     setStatus("All Statuses");
//     setTerritory("All Territories");
//     setArea("All Areas");
//     setStore("All Stores");
//     setDepartment("All Departments");
//     setPage(1);
//   }

//   function selectRole(name) {
//     setRoleName(name);
//     clearFilters();
//   }

//   function openAddSheet() {
//     setSaveError("");
//     setPendingAssign(null);

//     // default to the selected tab's role if the user may create it, else the first allowed role
//     const tabCode = roleCodeByName[roleName];
//     const defaultRole = manageableCodes.includes(tabCode)
//       ? roleName
//       : roleNameByCode[manageableCodes[0]] ?? roleName;

//     setEditing({
//       role: defaultRole,
//       roles: roleCodeByName[defaultRole],
//       reportsTo: "",
//       territory: [],
//       area: [],
//       store: [],
//       department: [],
//       status: "Active",
//     });
//   }

//   async function openEditSheet(user) {
//     setSaveError("");
//     setPendingAssign(null);
//     setEditing({ ...user, hydrated: false }); // open sheet, show loader

//     try {
//       const { user: u, assignments } = await dispatch(EdituserGet(user.userId)).unwrap();

//       const callingCode = u?.countryCode || user.mobileCountryCode || "+1";
//       const code = String(u?.roles ?? user.roles ?? "").trim().toUpperCase();

//       setEditing((cur) =>
//         cur && cur.id === user.id
//           ? {
//               ...cur,
//               name: u?.fullName ?? cur.name,
//               email: u?.emailID ?? cur.email,
//               mobile: u?.mobileNumber ?? cur.mobile,
//               mobileCountry: countryByCallingCode[callingCode] || cur.mobileCountry,
//               mobileCountryCode: callingCode,
//               custnmbr: u?.custnmbr ?? cur.custnmbr,
//               roles: code,
//               role: roleNameByCode[code] ?? cur.role,
//               status: u?.isActive ? "Active" : "Inactive",
//               hydrated: true,
//             }
//           : cur,
//       );
//       setPendingAssign(assignments); // effect B turns these IDs into labels
//     } catch (err) {
//       toast.error(typeof err === "string" ? err : err?.message || "Failed to load user details.");
//       setEditing((cur) => (cur && cur.id === user.id ? { ...cur, hydrated: true } : cur));
//     }
//   }

//   function closeSheet() {
//     setEditing(null);
//     setPendingAssign(null);
//     setPhotoError("");
//     setSaveError("");
//   }

//   function toggleUserStatus(user) {
//     const nextStatus = user.status === "Active" ? "Inactive" : "Active";
//     setUsers((current) =>
//       current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)),
//     );
//     toast.success(
//       `${user.name} ${nextStatus === "Active" ? "activated" : "deactivated"} successfully.`,
//     );
//   }

//   async function deleteUser() {
//     if (!deleting || isDeleting) return;
//     setIsDeleting(true);
//     setDeleteError("");
//     const target = deleting;
//     try {
//       const result = await dispatch(Deleteusers(target.userId)).unwrap();
//       setUsers((current) => current.filter((user) => user.id !== target.id));
//       setDeleting(null);
//       dispatch(Getuserslist()); // refresh the table
//       toast.success(result?.message || "User deleted successfully.");
//     } catch (error) {
//       const message =
//         typeof error === "string" ? error : error?.message || "Failed to delete user.";
//       setDeleteError(message); // keep the dialog open
//       toast.error(message);
//     } finally {
//       setIsDeleting(false);
//     }
//   }

//   function uploadPhoto(event) {
//     const file = event.target.files?.[0];
//     event.target.value = "";
//     if (!file) return;
//     setPhotoError("");
//     if (
//       !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
//       file.size > 5 * 1024 * 1024
//     ) {
//       setPhotoError("Choose a JPG, PNG, or WebP image under 5 MB.");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onload = () =>
//       setEditing((current) => (current ? { ...current, avatar: reader.result } : current));
//     reader.onerror = () => setPhotoError("Unable to read this image. Please try another.");
//     reader.readAsDataURL(file);
//   }

//   function buildUserPayload({ form, state, roleCode, isEdit = false }) {
//     const country = String(form.get("mobileCountry"));
//     const ids = resolveAssignmentIds(state);
//     const custnmbr =
//       state.custnmbr || users.find((u) => u.custnmbr)?.custnmbr || DEFAULT_CUSTNMBR;

//     const payload = {
//       countryCode: `+${getCountryCallingCode(country)}`,
//       mobileNumber: String(form.get("mobile")).trim(),
//       fullName: String(form.get("name")).trim(),
//       emailID: String(form.get("email")).trim(),
//       custnmbr,
//       roles: roleCode,
//       isVerified: true,
//       isActive: state.status !== "Inactive",
//     };

//     for (const key of payloadKeysByRole[roleCode] ?? []) {
//       payload[key] = ids[key];
//     }

//     if (isEdit) payload.modifiedBY = MODIFIED_BY;
//     else payload.createdBY = CREATED_BY;
//     return payload;
//   }

//   async function saveUser(event) {
//     event.preventDefault();
//     const form = new FormData(event.currentTarget);
//     const selectedRole = String(form.get("role"));
//     const roleCode = roleCodeByName[selectedRole];
//     const name = String(form.get("name")).trim();
//     if (!name) return;

//     const isEdit = Boolean(editing.id);

//     // build the role-specific payload and validate required assignments
//     const payload = buildUserPayload({ form, state: editing, roleCode, isEdit });
//     const missing = (payloadKeysByRole[roleCode] ?? []).find((key) => !payload[key]?.length);
//     if (missing) {
//       setSaveError(`Select at least one ${payloadKeyLabel[missing]}.`);
//       return;
//     }

//     setSaveError("");
//     setSaving(true);
//     try {
//       if (isEdit) {
//         await dispatch(Updateusers({ id: editing.userId, data: payload })).unwrap();
//       } else {
//         await dispatch(Postusers({ data: payload })).unwrap();
//       }
//       dispatch(Getuserslist()); // refresh the table
//       // only switch tab if the saved role's tab is visible to this user
//       if (visibleRoles.some((r) => r.name === selectedRole)) selectRole(selectedRole);
//       closeSheet();
//       toast.success(
//         `${roleLabelByCode[roleCode]} ${isEdit ? "updated" : "created"} successfully.`,
//       );
//     } catch (err) {
//       const message =
//         typeof err === "string"
//           ? err
//           : err?.message || `Failed to ${isEdit ? "update" : "create"} user.`;
//       setSaveError(message);
//       toast.error(message);
//     } finally {
//       setSaving(false);
//     }
//   }

//   // ── 5.7b Access guards (must stay AFTER all hooks) ──────────
//   if (role === null) return null; // role not read from localStorage yet
//   if (!can(role, "employee.view") || !visibleRoles.length) {
//     return (
//       <p className="p-4 text-sm text-muted-foreground">
//         You don&apos;t have access to this page.
//       </p>
//     );
//   }

//   // ── 5.8 Render ──────────────────────────────────────────────
//   return (
//     <section className="@container/roles min-w-0 space-y-3 p-3 sm:space-y-4 sm:p-4">
//       {/* ---------- Role tabs (driven by employee.view -> visibleRoles) ---------- */}
//       <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
//         {/* wide screens */}
//         <div
//           className="hidden min-w-0 flex-nowrap gap-2 overflow-x-auto @[640px]/roles:flex"
//           role="group"
//           aria-label="Filter users by role"
//         >
//           {visibleRoles.map((item) => {
//             const Icon = item.icon;
//             const active = item.name === roleName;
//             return (
//               <button
//                 key={item.name}
//                 type="button"
//                 aria-label={item.name}
//                 aria-pressed={active}
//                 onClick={() => selectRole(item.name)}
//                 className={`relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${active ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-muted/30 text-foreground hover:bg-muted/60"}`}
//               >
//                 <Icon className={`size-4 shrink-0 ${item.color}`} />
//                 <span className="whitespace-nowrap @[1100px]/roles:hidden">{item.shortName}</span>
//                 <span className="hidden whitespace-nowrap @[1100px]/roles:inline">{item.name}</span>
//                 <span
//                   className={`hidden rounded-full px-2 py-0.5 text-xs tabular-nums @[1100px]/roles:inline ${active ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
//                 >
//                   {users.filter((user) => user.role === item.name).length}
//                 </span>
//                 {active && (
//                   <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-blue-500" />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* narrow screens */}
//         <div className="min-w-0 @[640px]/roles:hidden">
//           <div
//             className="grid w-full items-stretch gap-1.5 py-1"
//             style={{
//               gridTemplateColumns: `repeat(${mainRoles.length + (moreRoles.length ? 1 : 0)}, minmax(0, 1fr))`,
//             }}
//             role="group"
//             aria-label="Filter users by role"
//           >
//             {mainRoles.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.name}
//                   type="button"
//                   aria-label={item.name}
//                   aria-pressed={roleName === item.name}
//                   onClick={() => selectRole(item.name)}
//                   className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-[10px] leading-tight font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${roleName === item.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
//                 >
//                   <Icon
//                     className={`size-3.5 shrink-0 ${roleName === item.name ? "text-primary-foreground" : item.color}`}
//                   />
//                   <span className="min-w-0 text-center">{item.shortName}</span>
//                 </button>
//               );
//             })}

//             {moreRoles.length > 0 && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     aria-label="More roles"
//                     className={`h-full min-h-10 w-full min-w-0 gap-1 rounded-md border-0 px-1 py-1 text-[10px] ${moreRoles.some((r) => r.name === roleName) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
//                   >
//                     More
//                     <ChevronDown className="size-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="min-w-60">
//                   <DropdownMenuRadioGroup value={roleName} onValueChange={selectRole}>
//                     {moreRoles.map((item) => {
//                       const Icon = item.icon;
//                       return (
//                         <DropdownMenuRadioItem
//                           key={item.name}
//                           value={item.name}
//                           className="gap-2 pr-12 whitespace-nowrap [&>[data-slot=dropdown-menu-radio-item-indicator]]:right-3"
//                         >
//                           <Icon className={`size-4 shrink-0 ${item.color}`} />
//                           <span className="mr-2">{item.shortName}</span>
//                         </DropdownMenuRadioItem>
//                       );
//                     })}
//                   </DropdownMenuRadioGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//           <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
//             Selected: {roleName === "Employees" ? "Employee" : roleName}
//           </p>
//         </div>
//       </div>

//       {/* ---------- Search, filters, Add User ---------- */}
//       <div className="grid min-w-0 grid-cols-1 items-center gap-2 @[1200px]/roles:grid-cols-[18rem_minmax(0,1fr)]">
//         <label className="relative block w-full min-w-0">
//           <span className="sr-only">Search users</span>
//           <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//           <input
//             value={search}
//             onChange={(event) => {
//               setSearch(event.target.value);
//               setPage(1);
//             }}
//             placeholder="Search by name, email or employee ID..."
//             className={`${fieldClass} pl-9`}
//           />
//         </label>
//         <div
//           className="grid min-w-0 grid-cols-2 gap-2 @[720px]/roles:grid-cols-[repeat(var(--filter-count),minmax(0,1fr))] @[1200px]/roles:grid-cols-[repeat(var(--filter-count),minmax(0,9rem))] @[1200px]/roles:justify-end"
//           style={{ "--filter-count": filters.length + (canCreate ? 1 : 0) }}
//         >
//           {filters.map(([title, value, setter, options, disabled], index) => (
//             <label
//               key={title}
//               className={`min-w-0 text-xs text-muted-foreground ${index === 0 && filters.length % 2 === 0 ? "col-span-2 @[720px]/roles:col-span-1" : ""}`}
//             >
//               <span className="sr-only">{title}</span>
//               <select
//                 value={value}
//                 disabled={disabled}
//                 onChange={(event) => {
//                   setter(event.target.value);
//                   setPage(1);
//                 }}
//                 className={`${fieldClass} text-foreground disabled:cursor-not-allowed disabled:opacity-50`}
//               >
//                 {options.map((option) => (
//                   <option key={option}>{option}</option>
//                 ))}
//               </select>
//             </label>
//           ))}
//           {canCreate && (
//             <Button
//               className="h-9 w-full min-w-0 gap-2 whitespace-nowrap px-3 text-xs"
//               onClick={openAddSheet}
//             >
//               <Plus className="size-4" />
//               Add User
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* ---------- Users load error ---------- */}
//       {userslistStatus === "failed" && (
//         <p role="alert" className="text-sm text-destructive">
//           {typeof userslistError === "string"
//             ? userslistError
//             : userslistError?.message || userslistError?.Msg || "Failed to load users."}
//         </p>
//       )}

//       {/* ---------- Users table ---------- */}
//       {isLoading ? (
//         <div
//           role="status"
//           aria-live="polite"
//           className="flex min-h-80 flex-col items-center justify-center gap-2 p-6 text-muted-foreground"
//         >
//           <Loader2 className="size-6 animate-spin text-primary" />
//           <p className="text-xs font-medium">Loading Users...</p>
//         </div>
//       ) : (
//         <div className="min-w-0 overflow-x-auto rounded-lg border">
//           <table
//             className={`w-full text-left text-sm ${showDepartment ? "min-w-[1120px]" : showStore ? "min-w-[960px]" : showTerritory ? "min-w-[680px]" : "min-w-[520px]"}`}
//           >
//             <caption className="sr-only">{roleName} users</caption>
//             <thead className="border-b admin-table-header text-xs text-muted-foreground">
//               <tr>
//                 {columns.map((title) => (
//                   <th key={title} scope="col" className="px-4 py-3 font-medium">
//                     {title}
//                   </th>
//                 ))}
//                 <th scope="col" className="px-4 py-3 text-right font-medium">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {rows.map((user, index) => (
//                 <tr key={user.id} className="transition-colors hover:bg-muted/30">
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       <Avatar className="size-8">
//                         <AvatarImage src={user.avatar || undefined} alt="" />
//                         <AvatarFallback
//                           className={`text-xs font-semibold ${avatarColors[index % avatarColors.length]}`}
//                         >
//                           {initials(user.name)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="min-w-0">
//                         <p className="whitespace-nowrap font-medium">{user.name}</p>
//                         <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
//                     {user.mobile ? `${user.mobileCountryCode || "+1"} ${user.mobile}` : "—"}
//                   </td>
//                   {showTerritory && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.territory} label="Territories" icon={MapPin} />
//                     </td>
//                   )}
//                   {showArea && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.area} label="Areas" icon={MapPin} />
//                     </td>
//                   )}
//                   {showStore && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.store} label="Stores" icon={Store} />
//                     </td>
//                   )}
//                   {showDepartment && (
//                     <td className="px-4 py-3">
//                       <AssignmentList value={user.department} label="Departments" icon={Network} />
//                     </td>
//                   )}
//                   <td className="px-4 py-3">
//                     <Badge
//                       variant="secondary"
//                       className={`rounded-full px-3 ${user.status === "Active" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/15 text-rose-700 dark:text-rose-400"}`}
//                     >
//                       {user.status}
//                     </Badge>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     {(canEdit || canDeactivate) && (
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon-sm"
//                             aria-label={`Actions for ${user.name}`}
//                           >
//                             <MoreVertical className="size-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-auto min-w-32">
//                           {canEdit && (
//                             <DropdownMenuItem
//                               className="whitespace-nowrap"
//                               onSelect={() => openEditSheet(user)}
//                             >
//                               <Pencil />
//                               Edit
//                             </DropdownMenuItem>
//                           )}
//                           {canDeactivate && (
//                             <DropdownMenuItem
//                               className="whitespace-nowrap"
//                               onSelect={() => toggleUserStatus(user)}
//                             >
//                               <UserRoundCheck />
//                               {user.status === "Active" ? "Deactivate" : "Activate"}
//                             </DropdownMenuItem>
//                           )}
//                           {canDeactivate && (
//                             <DropdownMenuItem
//                               variant="destructive"
//                               className="whitespace-nowrap"
//                               onSelect={() => {
//                                 setDeleteError("");
//                                 setDeleting(user);
//                               }}
//                             >
//                               <Trash2 />
//                               Delete
//                             </DropdownMenuItem>
//                           )}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               {rows.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={columns.length + 1}
//                     className="px-4 py-12 text-center text-muted-foreground"
//                   >
//                     No users match your search or filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ---------- Pagination ---------- */}
//       {!isLoading && (
//         <PaginationCustomUsers
//           currentPage={currentPage}
//           totalPages={totalPages}
//           pageSize={pageSize}
//           totalItems={filteredUsers.length}
//           onPageChange={setPage}
//           onPageSizeChange={(size) => {
//             setPageSize(size);
//             setPage(1);
//           }}
//           itemLabel="users"
//           className="bg-transparent pt-0 pb-4"
//         />
//       )}

//       {/* ---------- Delete dialog ---------- */}
//       <Dialog
//         open={Boolean(deleting)}
//         onOpenChange={(open) => {
//           if (!open && !isDeleting) setDeleting(null);
//         }}
//       >
//         <DialogContent showCloseButton={!isDeleting}>
//           <DialogHeader>
//             <DialogTitle>Delete user?</DialogTitle>
//             <DialogDescription>
//               Remove {deleting?.name}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
//           <DialogFooter>
//             <Button variant="outline" disabled={isDeleting} onClick={() => setDeleting(null)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" disabled={isDeleting} onClick={deleteUser}>
//               {isDeleting ? "Deleting..." : "Delete"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ---------- Add / Edit sheet ---------- */}
//       <Sheet
//         open={Boolean(editing)}
//         onOpenChange={(open) => {
//           if (!open) closeSheet();
//         }}
//       >
//         <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
//           <SheetHeader className="gap-0 border-b">
//             <div className="flex items-center justify-between gap-3 pr-8">
//               <SheetTitle>{editing?.id ? "Edit User" : "Add User"}</SheetTitle>
//               <label
//                 className={`flex shrink-0 items-center gap-2 text-xs ${editing?.status === "Inactive" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
//               >
//                 <span>Status</span>
//                 <Switch
//                   aria-label="User active status"
//                   className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600 dark:data-[state=unchecked]:bg-red-600"
//                   checked={editing?.status !== "Inactive"}
//                   onCheckedChange={(checked) =>
//                     setEditing((current) =>
//                       current ? { ...current, status: checked ? "Active" : "Inactive" } : current,
//                     )
//                   }
//                 />
//               </label>
//             </div>
//             <SheetDescription className="text-xs leading-snug">
//               Enter contact details and assign a role.
//             </SheetDescription>
//           </SheetHeader>

//           {/* loader while GET /users/:id is in flight (edit only) */}
//           {editing?.id && !editing.hydrated && (
//             <div
//               role="status"
//               aria-live="polite"
//               className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-muted-foreground"
//             >
//               <Loader2 className="size-6 animate-spin text-primary" />
//               <p className="text-xs font-medium">Loading user...</p>
//             </div>
//           )}

//           {/* form: always for Add, for Edit only after the user is loaded */}
//           {editing && (!editing.id || editing.hydrated) && (
//             <form
//               key={editing.id || "new"}
//               onSubmit={saveUser}
//               className="flex min-h-0 flex-1 flex-col"
//             >
//               <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
//                 {/* photo + name + email */}
//                 <div className="grid min-w-0 grid-cols-[8rem_minmax(0,1fr)] items-center gap-4">
//                   <label className="relative size-30 cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png,image/webp"
//                       aria-label="Upload user photo"
//                       onChange={uploadPhoto}
//                       className="sr-only"
//                     />
//                     <Avatar className="size-30">
//                       <AvatarImage src={editing.avatar || undefined} alt="User photo preview" />
//                       <AvatarFallback className="bg-muted text-muted-foreground">
//                         <UserRoundCheck className="size-9" />
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="absolute right-2 bottom-2 z-10 grid size-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
//                       <Camera className="size-3" />
//                     </span>
//                   </label>
//                   <div className="flex h-32 min-w-0 flex-col justify-between gap-2">
//                     <label className="grid min-w-0 gap-1 text-sm">
//                       <span>Name</span>
//                       <input
//                         name="name"
//                         required
//                         maxLength={100}
//                         defaultValue={editing.name || ""}
//                         className={fieldClass}
//                       />
//                     </label>
//                     <label className="grid min-w-0 gap-1 text-sm">
//                       <span>Email</span>
//                       <input
//                         name="email"
//                         type="email"
//                         required
//                         defaultValue={editing.email || ""}
//                         className={fieldClass}
//                       />
//                     </label>
//                   </div>
//                 </div>
//                 {photoError && (
//                   <p role="alert" className="text-xs text-destructive">
//                     {photoError}
//                   </p>
//                 )}

//                 {/* contact number */}
//                 <fieldset className="min-w-0 space-y-1.5 text-sm">
//                   <legend>Contact No.</legend>
//                   <div
//                     className="grid min-w-0 items-center gap-2 text-xs"
//                     style={{
//                       gridTemplateColumns: `calc(${mobileCountryLabelLength}ch + 2rem) minmax(0, 1fr)`,
//                     }}
//                   >
//                     <select
//                       name="mobileCountry"
//                       aria-label="Contact country code"
//                       defaultValue={editing.mobileCountry || "US"}
//                       className={fieldClass}
//                       style={{ height: "2rem" }}
//                     >
//                       {mobileCountries.map(({ country, code }) => (
//                         <option key={country} value={country}>
//                           {country} {code}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       name="mobile"
//                       aria-label="Contact No."
//                       type="tel"
//                       autoComplete="tel-national"
//                       defaultValue={editing.mobile || ""}
//                       className={fieldClass}
//                     />
//                   </div>
//                 </fieldset>

//                 {/* role (limited to roles the logged-in user may manage) */}
//                 <label className="block space-y-1.5 text-sm">
//                   <span>Role</span>
//                   <select
//                     name="role"
//                     value={editing.role}
//                     onChange={(event) => {
//                       setSaveError("");
//                       setEditing((current) => ({
//                         ...current,
//                         role: event.target.value,
//                         roles: roleCodeByName[event.target.value],
//                         reportsTo: "",
//                       }));
//                     }}
//                     className={fieldClass}
//                   >
//                     {sheetRoleOptions.map((item) => (
//                       <option key={item.name}>{item.name}</option>
//                     ))}
//                   </select>
//                 </label>

//                 {/* reports to */}
//                 <ReportsToSelect
//                   role={editing.role}
//                   groups={reportingGroups}
//                   selectedUser={reportsTo}
//                   onChange={(value) =>
//                     setEditing((current) => ({ ...current, reportsTo: value }))
//                   }
//                 />

//                 {/* territory > area > store > department */}
//                 {sheetAssignmentFields.map(([key, title], index) => {
//                   const parent = sheetAssignmentFields[index - 1];
//                   const parentEmpty = parent && !assignmentValues(editing[parent[0]]).length;
//                   return (
//                     <AssignmentSelect
//                       key={key}
//                       fieldKey={key}
//                       title={title}
//                       options={optionLists[key] ?? []}
//                       selected={assignmentValues(editing[key])}
//                       loading={Boolean(loadingByKey[key])}
//                       parentTitle={parentEmpty ? parent[1] : null}
//                       onChange={(next) =>
//                         setEditing((current) =>
//                           current ? pruneAssignments({ ...current, [key]: next }) : current,
//                         )
//                       }
//                     />
//                   );
//                 })}
//               </div>

//               {saveError && (
//                 <p role="alert" className="px-4 pb-2 text-xs text-destructive">
//                   {saveError}
//                 </p>
//               )}
//               <SheetFooter className="grid grid-cols-2 border-t">
//                 <SheetClose asChild>
//                   <Button type="button" variant="outline" className="w-full" disabled={saving}>
//                     Cancel
//                   </Button>
//                 </SheetClose>
//                 <Button type="submit" className="w-full" disabled={saving}>
//                   {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
//                 </Button>
//               </SheetFooter>
//             </form>
//           )}
//         </SheetContent>
//       </Sheet>
//     </section>
//   );
// }


//********************************* TO CONFIGURE THE ADMIN PORTAL USERS SCREEN DESIGN SECTION ***************************//
"use client";

// ─────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────
import { useEffect, useId, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Popover } from "radix-ui";
import { getCountries, getCountryCallingCode } from "libphonenumber-js/min";
import {
  Crown,
  MapPin,
  Map,
  Store,
  Network,
  Users,
  Search,
  Plus,
  MoreVertical,
  Pencil,
  UserRoundCheck,
  ChevronDown,
  Loader2,
  Camera,
  Trash2,
} from "lucide-react";

import {
  Getuserslist,
  GetTerritorylist,
  GetAreaList,
  GetLocationList,
  GetdeptList,
  clearAreaList,
  clearLocationList,
  clearDepartmentList,
  EdituserGet,
} from "../../redux/slices/getSlice";
import { Postusers, Updateusers, Deleteusers } from "../../redux/slices/postSlice";
import { assignmentFields, assignmentValues } from "@/lib/user-assignments";
import {
  can,
  getVisibleRoles,
  getActionableRoles,
  canActOnRole,
} from "@/lib/permissions";

import { PaginationCustomUsers } from "@/components/ui/pagination-custom";
import { AssignmentAutocomplete } from "@/lib/AssignmentAutocomplete";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ─────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────

// `code` is the value the API sends in the `roles` field
const roles = [
  { code: "O", name: "Owner", shortName: "Owner", icon: Crown, color: "text-blue-500" },
  { code: "T", name: "Territory Manager", shortName: "Territory", icon: MapPin, color: "text-violet-500" },
  { code: "A", name: "Area Manager", shortName: "Area", icon: Map, color: "text-cyan-500" },
  { code: "S", name: "Store Manager", shortName: "Store", icon: Store, color: "text-emerald-500" },
  { code: "D", name: "Department Manager", shortName: "Department", icon: Network, color: "text-orange-500" },
  { code: "E", name: "Employees", shortName: "Employee", icon: Users, color: "text-slate-500" },
];

const roleNameByCode = Object.fromEntries(roles.map((r) => [r.code, r.name]));
const roleCodeByName = Object.fromEntries(roles.map((r) => [r.name, r.code]));

// which ID arrays each role sends in the POST /users payload
const payloadKeysByRole = {
  O: [],
  T: ["territoryIds"],
  A: ["territoryIds", "areaIds"],
  S: ["territoryIds", "areaIds", "locationIds"],
  D: ["territoryIds", "areaIds", "locationIds", "departmentIds"],
  E: ["territoryIds", "areaIds", "locationIds", "departmentIds"],
};

// label used in toast messages
const roleLabelByCode = {
  O: "Owner",
  T: "Territory Manager",
  A: "Area Manager",
  S: "Store Manager",
  D: "Department Manager",
  E: "Employee",
};
// payload key -> label used in validation messages
const payloadKeyLabel = {
  territoryIds: "territory",
  areaIds: "area",
  locationIds: "store",
  departmentIds: "department",
};

// Which assignment field is MULTI-select for each role being created / edited.
// Every other field is single-select. Store is always single-select (null for S).
const multiFieldByRole = {
  T: "territory",
  A: "area",
  S: null,
  D: "department",
  E: "department",
};
const isMultiField = (roleCode, key) => multiFieldByRole[roleCode] === key;

// TODO: replace with the logged-in user's id
const CREATED_BY = 18;
const MODIFIED_BY = 18;
// fallback customer number when no existing user carries one
const DEFAULT_CUSTNMBR = process.env.NEXT_PUBLIC_CUSTNMBR ?? "";

const mobileCountries = getCountries().map((country) => ({
  country,
  code: `+${getCountryCallingCode(country)}`,
}));
const mobileCountryLabelLength = Math.max(
  ...mobileCountries.map(({ country, code }) => `${country} ${code}`.length),
);

// calling code (e.g. "+91") -> ISO country (e.g. "IN")
const preferredCountryByCode = { "+1": "US", "+44": "GB", "+7": "RU", "+61": "AU" };
const countryByCallingCode = mobileCountries.reduce(
  (map, { country, code }) => {
    if (!map[code]) map[code] = country;
    return map;
  },
  { ...preferredCountryByCode },
);

const fieldClass =
  "h-9 w-full min-w-0 rounded-md border bg-background px-2 text-xs font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring";
const avatarColors = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
];

// ─────────────────────────────────────────────────────────────
// 3. HELPERS (pure functions, no React)
// ─────────────────────────────────────────────────────────────

// API user -> shape used by this screen
function normalizeUser(u) {
  const rawId = u.userId ?? u.userID ?? u.userid ?? u.id;
  const code = u.roles ? String(u.roles).trim().toUpperCase() : null;
  const callingCode = u.countryCode || "+1";
  return {
    id: String(rawId),
    userId: rawId,
    name: u.fullName ?? "",
    email: u.emailID ?? "",
    mobile: u.mobileNumber ?? "",
    mobileCountry: countryByCallingCode[callingCode] || "US",
    mobileCountryCode: callingCode,
    custnmbr: u.custnmbr ?? "",
    roles: code,
    role: roleNameByCode[code] ?? null, // null when roles is null or an unknown code
    status: u.isActive ? "Active" : "Inactive",
    reportsTo: "",
    avatar: "",
    territory: [],
    area: [],
    store: [],
    department: [],
  };
}

// label / id accessors for the API lists (adjust field names here if your API differs)
const areaLabel = (a) => [a.city, a.state].filter(Boolean).join(", ");
const locationLabel = (l) => l.locationName ?? l.storeName ?? l.locationCode ?? l.name ?? "";
const deptLabel = (d) => d.departmentName ?? d.deptName ?? d.departmentCode ?? d.name ?? "";
const locationId = (l) => l.locationID ?? l.locationId;
const locationAreaId = (l) => l.areaID ?? l.areaId;
const deptLocationId = (d) => d.locationID ?? d.locationId;
const departmentId = (d) => d.departmentID ?? d.departmentId ?? d.deptID ?? d.deptId;

// unique, non-empty labels of the active items
function uniqueLabels(list, getLabel) {
  const seen = new Set();
  const out = [];
  for (const item of list ?? []) {
    if (item.isActive === false) continue;
    const label = getLabel(item);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    out.push(label);
  }
  return out;
}

const uniq = (arr) => [...new Set(arr.filter((v) => v != null))];
const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

// ─────────────────────────────────────────────────────────────
// 4. SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────

// table cell: first two values + "+N" popover
function AssignmentList({ value, label, icon: Icon }) {
  const titleId = useId();
  const values = [...new Set(assignmentValues(value))];
  if (!values.length) return <span className="text-muted-foreground">—</span>;

  return (
    <div className="space-y-1 whitespace-nowrap text-xs text-muted-foreground">
      <div>
        {values[0]}
        {values.length > 1 ? "," : ""}
      </div>
      {values.length > 1 && (
        <div className="flex items-center gap-1.5">
          <span>
            {values[1]}
            {values.length > 2 ? "," : ""}
          </span>
          {values.length > 2 && (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  aria-label={`Show all ${values.length} assigned ${label.toLowerCase()}`}
                  className="shrink-0 rounded-sm text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  +{values.length - 2}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="start"
                  sideOffset={8}
                  collisionPadding={12}
                  aria-labelledby={titleId}
                  className="z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none"
                >
                  <h3 id={titleId} className="mb-3 text-sm font-semibold">
                    Assigned {label.toLowerCase()} ({values.length})
                  </h3>
                  <ul className="max-h-60 space-y-2 overflow-y-auto">
                    {values.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs">
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Popover.Arrow className="fill-popover" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>
      )}
    </div>
  );
}

// sheet: "Reports to" dropdown grouped by higher roles
function ReportsToSelect({ role, groups, selectedUser, onChange }) {
  const hasUsers = groups.some((group) => group.users.length);

  return (
    <div className="min-w-0 space-y-1.5 text-sm">
      <span id="user-reports-to-label">Reports to</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={!hasUsers}
            aria-labelledby="user-reports-to-label user-reports-to-value"
            className="h-9 w-full justify-between gap-2 px-2 text-xs font-normal"
          >
            <span id="user-reports-to-value" className="min-w-0 truncate">
              {selectedUser
                ? selectedUser.name
                : role === "Owner"
                  ? "No reporting manager for Owner"
                  : hasUsers
                    ? "Select reporting manager"
                    : "No higher-level users available"}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          <DropdownMenuRadioGroup value={selectedUser?.id || ""} onValueChange={onChange}>
            <DropdownMenuRadioItem value="" className="text-xs">
              No reporting manager
            </DropdownMenuRadioItem>
            {groups.map((group) => (
              <DropdownMenuGroup key={group.name} aria-label={group.name}>
                <DropdownMenuLabel className="mt-2 mb-2 border-b border-border px-2 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.shortName}
                </DropdownMenuLabel>
                {group.users.length ? (
                  group.users.map((user) => (
                    <DropdownMenuRadioItem key={user.id} value={user.id} className="text-xs">
                      {user.name}
                    </DropdownMenuRadioItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-xs">
                    No users available
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Employees() {
  const dispatch = useDispatch();

  // logged-in user's role CODE ("O" | "T" | "S" | "D" | "E"), read on the client
  const [role, setRole] = useState(null);
  useEffect(() => {
    setRole(localStorage.getItem("roles"));
  }, []);

  // ── 5.1 Redux data ──────────────────────────────────────────
  const userslistData = useSelector((state) => state.getSlice.userslistData);
  const userslistLoading = useSelector((state) => state.getSlice.userslistLoading);
  const userslistStatus = useSelector((state) => state.getSlice.userslistStatus);
  const userslistError = useSelector((state) => state.getSlice.userslistError);

  const territoryData = useSelector((state) => state.getSlice.territoryData);
  const territoryLoading = useSelector((state) => state.getSlice.territoryLoading);
  const areaData = useSelector((state) => state.getSlice.areaData);
  const areaLoading = useSelector((state) => state.getSlice.areaLoading);
  const locationData = useSelector((state) => state.getSlice.locationData);
  const locationLoading = useSelector((state) => state.getSlice.locationLoading);
  const deptData = useSelector((state) => state.getSlice.deptData);
  const deptLoading = useSelector((state) => state.getSlice.deptLoading);

  // user by id (edit sheet)
  const edituserData = useSelector((state) => state.getSlice.edituserData);
  const edituserStatus = useSelector((state) => state.getSlice.edituserStatus);
  const edituserError = useSelector((state) => state.getSlice.edituserError);

  // ── 5.2 Local state ─────────────────────────────────────────
  const [users, setUsers] = useState([]);

  // table filters
  const [roleName, setRoleName] = useState("Owner");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [territory, setTerritory] = useState("All Territories");
  const [area, setArea] = useState("All Areas");
  const [store, setStore] = useState("All Stores");
  const [department, setDepartment] = useState("All Departments");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // add / edit sheet
  const [editing, setEditing] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  // IDs from GET /users/:id still waiting to be turned into labels
  const [pendingAssign, setPendingAssign] = useState(null);

  const isLoading = userslistStatus === "idle" || userslistLoading;

  // ── 5.2b Permission-based tabs + actions ────────────────────
  // View: tabs the logged-in role may see (employee.view -> visibleRoles)
  const visibleRoles = useMemo(() => {
    const allowed = getVisibleRoles(role);
    return roles.filter((r) => allowed.includes(r.code));
  }, [role]);

  // Narrow screens: first 3 as buttons, the rest inside the "More" menu
  const mainRoles = visibleRoles.slice(0, 3);
  const moreRoles = visibleRoles.slice(3);

  // Create / Edit: target role codes the logged-in role may act on
  const createRoleCodes = useMemo(() => getActionableRoles(role, "employee.create"), [role]);
  const editRoleCodes = useMemo(() => getActionableRoles(role, "employee.edit"), [role]);
  const canCreate = createRoleCodes.length > 0;

  // per-row checks (target = the row's role code)
  const canEditUser = (u) => canActOnRole(role, "employee.edit", u.roles);
  const canDeactivateUser = (u) => canActOnRole(role, "employee.deactivate", u.roles);

  // does the selected tab have any row actions at all?
  const activeTabCode = roleCodeByName[roleName];
  const showActions =
    canActOnRole(role, "employee.edit", activeTabCode) ||
    canActOnRole(role, "employee.deactivate", activeTabCode);

  // If the selected tab isn't allowed (default is "Owner"), jump to the first allowed one
  useEffect(() => {
    if (visibleRoles.length && !visibleRoles.some((r) => r.name === roleName)) {
      setRoleName(visibleRoles[0].name);
    }
  }, [visibleRoles, roleName]);

  // ── 5.3 Dropdown options ────────────────────────────────────
  const territoryOptions = useMemo(
    () => uniqueLabels(territoryData, (t) => t.territoryName),
    [territoryData],
  );
  const areaOptions = useMemo(() => uniqueLabels(areaData, areaLabel), [areaData]);
  const storeOptions = useMemo(() => uniqueLabels(locationData, locationLabel), [locationData]);
  const deptOptions = useMemo(() => uniqueLabels(deptData, deptLabel), [deptData]);

  const optionLists = {
    territory: territoryOptions,
    area: areaOptions,
    store: storeOptions,
    department: deptOptions,
  };
  const loadingByKey = {
    territory: territoryLoading,
    area: areaLoading,
    store: locationLoading,
    department: deptLoading,
  };

  // ── 5.4 Label -> ID resolution (each level limited to its selected parent) ──
  function resolveAssignmentIds(state) {
    const territoryNames = assignmentValues(state.territory);
    const territoryIds = uniq(
      (territoryData ?? [])
        .filter((t) => territoryNames.includes(t.territoryName))
        .map((t) => t.territoryID),
    );

    const areaLabels = assignmentValues(state.area);
    const areaIds = uniq(
      (areaData ?? [])
        .filter(
          (a) => areaLabels.includes(areaLabel(a)) && territoryIds.includes(a.territoryID),
        )
        .map((a) => a.areaID),
    );

    const storeLabels = assignmentValues(state.store);
    const locationIds = uniq(
      (locationData ?? [])
        .filter(
          (l) =>
            storeLabels.includes(locationLabel(l)) &&
            (locationAreaId(l) == null || areaIds.includes(locationAreaId(l))),
        )
        .map(locationId),
    );

    const deptLabels = assignmentValues(state.department);
    const departmentIds = uniq(
      (deptData ?? [])
        .filter(
          (d) =>
            deptLabels.includes(deptLabel(d)) &&
            (deptLocationId(d) == null || locationIds.includes(deptLocationId(d))),
        )
        .map(departmentId),
    );

    return { territoryIds, areaIds, locationIds, departmentIds };
  }

  // keep only selections whose parent is still selected: territory > area > store > department
  function pruneAssignments(state) {
    const territoryIds = new Set(
      (territoryData ?? [])
        .filter((t) => assignmentValues(state.territory).includes(t.territoryName))
        .map((t) => t.territoryID),
    );
    const areaValues = assignmentValues(state.area).filter((label) => {
      const matches = (areaData ?? []).filter((a) => areaLabel(a) === label);
      return !matches.length || matches.some((a) => territoryIds.has(a.territoryID));
    });

    const areaIds = new Set(
      (areaData ?? [])
        .filter((a) => areaValues.includes(areaLabel(a)))
        .map((a) => a.areaID),
    );
    const storeValues = assignmentValues(state.store).filter((label) => {
      const matches = (locationData ?? []).filter((l) => locationLabel(l) === label);
      return (
        !matches.length ||
        matches.some((l) => locationAreaId(l) == null || areaIds.has(locationAreaId(l)))
      );
    });

    const locationIds = new Set(
      (locationData ?? [])
        .filter((l) => storeValues.includes(locationLabel(l)))
        .map(locationId),
    );
    const departmentValues = assignmentValues(state.department).filter((label) => {
      const matches = (deptData ?? []).filter((d) => deptLabel(d) === label);
      return (
        !matches.length ||
        matches.some((d) => deptLocationId(d) == null || locationIds.has(deptLocationId(d)))
      );
    });

    return { ...state, area: areaValues, store: storeValues, department: departmentValues };
  }

  // ── 5.5 Effects ─────────────────────────────────────────────

  // load users + territories on mount
  useEffect(() => {
    dispatch(Getuserslist());
    dispatch(GetTerritorylist());
  }, [dispatch]);

  // copy the API list into local state (so edit / activate still work on screen)
  useEffect(() => {
    setUsers(
      (userslistData ?? [])
        .map(normalizeUser)
        .filter((user) => user.role), // drop roles: null / unknown codes
    );
  }, [userslistData]);

  // which selection drives the cascading fetches: the sheet while it is open,
  // otherwise the table filters
  const scope = editing ?? {
    territory: territory === "All Territories" ? [] : [territory],
    area: area === "All Areas" ? [] : [area],
    store: store === "All Stores" ? [] : [store],
    department: [],
  };
  const scopeIds = resolveAssignmentIds(scope);
  const territoryIdsKey = scopeIds.territoryIds.join(",");
  const areaIdsKey = scopeIds.areaIds.join(",");
  const locationIdsKey = scopeIds.locationIds.join(",");

  // territory -> areas (one request per territory ID)
  useEffect(() => {
    if (scopeIds.territoryIds.length) dispatch(GetAreaList(scopeIds.territoryIds));
    else dispatch(clearAreaList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, territoryIdsKey]);

  // areas -> stores (one request per area ID, only areas of the selected territories)
  useEffect(() => {
    if (scopeIds.areaIds.length) dispatch(GetLocationList(scopeIds.areaIds));
    else dispatch(clearLocationList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, areaIdsKey]);

  // stores -> departments (one request per store ID)
  useEffect(() => {
    if (scopeIds.locationIds.length) dispatch(GetdeptList(scopeIds.locationIds));
    else dispatch(clearDepartmentList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, locationIdsKey]);

  // EDIT A) API response -> fill the sheet's basic fields
  useEffect(() => {
    if (!editing?.id || editing.hydrated) return;

    if (
      edituserStatus === "succeeded" &&
      String(edituserData?.user?.userId) === String(editing.userId)
    ) {
      const u = edituserData.user;
      const callingCode = u.countryCode || "+1";
      const code = String(u.roles ?? editing.roles ?? "").trim().toUpperCase();

      setEditing((cur) =>
        cur
          ? {
              ...cur,
              name: u.fullName ?? cur.name,
              email: u.emailID ?? cur.email,
              mobile: u.mobileNumber ?? cur.mobile,
              mobileCountry: countryByCallingCode[callingCode] || cur.mobileCountry,
              mobileCountryCode: callingCode,
              custnmbr: u.custnmbr ?? cur.custnmbr,
              roles: code,
              role: roleNameByCode[code] ?? cur.role,
              status: u.isActive ? "Active" : "Inactive",
              hydrated: true,
            }
          : cur,
      );
      setPendingAssign(edituserData.assignments);
    } else if (edituserStatus === "failed") {
      toast.error(
        typeof edituserError === "string" ? edituserError : "Failed to load user details.",
      );
      setEditing((cur) => (cur ? { ...cur, hydrated: true } : cur)); // fall back to row data
    }
  }, [edituserStatus, edituserData, edituserError, editing]);

  // EDIT B) assignment IDs -> labels, one level at a time
  //    (territory -> area -> store -> department; each list loads after its parent is set)
  useEffect(() => {
    if (!pendingAssign || !editing?.hydrated) return;

    const levels = [
      ["territory", "territoryIds", territoryData, territoryLoading, (t) => t.territoryID, (t) => t.territoryName],
      ["area", "areaIds", areaData, areaLoading, (a) => a.areaID, areaLabel],
      ["store", "locationIds", locationData, locationLoading, locationId, locationLabel],
      ["department", "departmentIds", deptData, deptLoading, departmentId, deptLabel],
    ];

    const patch = {};
    const remaining = { ...pendingAssign };

    for (const [field, idKey, list, loading, getId, getLabel] of levels) {
      const ids = remaining[idKey];
      if (ids === undefined) continue; // already applied
      if (!ids.length) {
        delete remaining[idKey];
        continue;
      }
      if (loading) break; // wait for the list to finish loading
      const idSet = new Set(ids.map(String));
      const found = (list ?? []).filter((item) => idSet.has(String(getId(item))));
      if (!found.length) break; // parent not applied / list not loaded yet
      const labels = uniq(found.map(getLabel));
      patch[field] = isMultiField(editing.roles, field) ? labels : labels.slice(0, 1);
      delete remaining[idKey];
    }

    const resolvedSomething =
      Object.keys(remaining).length !== Object.keys(pendingAssign).length;
    if (!resolvedSomething) return;

    if (Object.keys(patch).length) {
      setEditing((cur) => (cur ? { ...cur, ...patch } : cur));
    }
    setPendingAssign(Object.keys(remaining).length ? remaining : null);
  }, [
    pendingAssign,
    editing?.hydrated,
    editing?.roles,
    territoryData,
    territoryLoading,
    areaData,
    areaLoading,
    locationData,
    locationLoading,
    deptData,
    deptLoading,
  ]);

  // ── 5.6 Derived data ────────────────────────────────────────

  // which table columns / filters apply to the selected role tab
  const showTerritory = roleName !== "Owner";
  const showArea = showTerritory && roleName !== "Territory Manager";
  const showStore = showArea && roleName !== "Area Manager";
  const showDepartment = roleName === "Department Manager" || roleName === "Employees";

  // Assignment levels: Owner 0, Territory 1, Area 2, Store 3, Dept/Employee 4.
  const sheetRoleCode = roleCodeByName[editing?.role] ?? "O";
  const sheetAssignmentFields = assignmentFields.slice(
    0,
    (payloadKeysByRole[sheetRoleCode] ?? []).length,
  );

  // sheet: Role dropdown options = roles allowed for create (Add) or edit (Edit),
  // plus the role already on the record
  const sheetAllowedCodes = editing?.id ? editRoleCodes : createRoleCodes;
  const sheetRoleOptions = roles.filter(
    (r) => sheetAllowedCodes.includes(r.code) || r.name === editing?.role,
  );

  // sheet: "Reports to" candidates (higher roles only)
  const reportingGroups = roles
    .slice(0, Math.max(0, roles.findIndex((r) => r.name === editing?.role)))
    .map((r) => ({
      ...r,
      users: users.filter((user) => user.role === r.name && user.id !== editing?.id),
    }));
  const reportingUsers = reportingGroups.flatMap((group) => group.users);
  const reportsTo = reportingUsers.find((user) => user.id === editing?.reportsTo);

  // table filter definitions: [title, value, setter, options, disabled]
  const filters = [
    ...(showTerritory
      ? [
          [
            "Territory",
            territory,
            (value) => {
              setTerritory(value);
              setArea("All Areas");
              setStore("All Stores");
              setDepartment("All Departments");
            },
            ["All Territories", ...territoryOptions],
          ],
        ]
      : []),
    ...(showArea
      ? [
          [
            "Area",
            area,
            (value) => {
              setArea(value);
              setStore("All Stores");
              setDepartment("All Departments");
            },
            ["All Areas", ...areaOptions],
            territory === "All Territories",
          ],
        ]
      : []),
    ...(showStore
      ? [
          [
            "Store",
            store,
            (value) => {
              setStore(value);
              setDepartment("All Departments");
            },
            ["All Stores", ...storeOptions],
            area === "All Areas",
          ],
        ]
      : []),
    ...(showDepartment
      ? [
          [
            "Department",
            department,
            setDepartment,
            ["All Departments", ...deptOptions],
            store === "All Stores",
          ],
        ]
      : []),
    ["Status", status, setStatus, ["All Statuses", "Active", "Inactive"]],
  ];

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter(
      (user) =>
        user.role === roleName &&
        (status === "All Statuses" || user.status === status) &&
        (!showTerritory ||
          territory === "All Territories" ||
          assignmentValues(user.territory).includes(territory)) &&
        (!showArea || area === "All Areas" || assignmentValues(user.area).includes(area)) &&
        (!showStore || store === "All Stores" || assignmentValues(user.store).includes(store)) &&
        (!showDepartment ||
          department === "All Departments" ||
          assignmentValues(user.department).includes(department)) &&
        `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(query),
    );
  }, [
    users,
    roleName,
    search,
    status,
    territory,
    area,
    store,
    department,
    showTerritory,
    showArea,
    showStore,
    showDepartment,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    "Name",
    "Contact No.",
    ...(showTerritory ? ["Territory"] : []),
    ...(showArea ? ["Area"] : []),
    ...(showStore ? ["Store"] : []),
    ...(showDepartment ? ["Department"] : []),
    "Status",
  ];

  // ── 5.7 Handlers ────────────────────────────────────────────
  function clearFilters() {
    setSearch("");
    setStatus("All Statuses");
    setTerritory("All Territories");
    setArea("All Areas");
    setStore("All Stores");
    setDepartment("All Departments");
    setPage(1);
  }

  function selectRole(name) {
    setRoleName(name);
    clearFilters();
  }

  function openAddSheet() {
    if (!canCreate) return;
    setSaveError("");
    setPendingAssign(null);

    // default to the selected tab's role if the user may create it, else the first allowed role
    const tabCode = roleCodeByName[roleName];
    const defaultRole = createRoleCodes.includes(tabCode)
      ? roleName
      : roleNameByCode[createRoleCodes[0]] ?? roleName;

    setEditing({
      role: defaultRole,
      roles: roleCodeByName[defaultRole],
      reportsTo: "",
      territory: [],
      area: [],
      store: [],
      department: [],
      status: "Active",
    });
  }

  async function openEditSheet(user) {
    if (!canEditUser(user)) return;
    setSaveError("");
    setPendingAssign(null);
    setEditing({ ...user, hydrated: false }); // open sheet, show loader

    try {
      const { user: u, assignments } = await dispatch(EdituserGet(user.userId)).unwrap();

      const callingCode = u?.countryCode || user.mobileCountryCode || "+1";
      const code = String(u?.roles ?? user.roles ?? "").trim().toUpperCase();

      setEditing((cur) =>
        cur && cur.id === user.id
          ? {
              ...cur,
              name: u?.fullName ?? cur.name,
              email: u?.emailID ?? cur.email,
              mobile: u?.mobileNumber ?? cur.mobile,
              mobileCountry: countryByCallingCode[callingCode] || cur.mobileCountry,
              mobileCountryCode: callingCode,
              custnmbr: u?.custnmbr ?? cur.custnmbr,
              roles: code,
              role: roleNameByCode[code] ?? cur.role,
              status: u?.isActive ? "Active" : "Inactive",
              hydrated: true,
            }
          : cur,
      );
      setPendingAssign(assignments); // effect B turns these IDs into labels
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Failed to load user details.");
      setEditing((cur) => (cur && cur.id === user.id ? { ...cur, hydrated: true } : cur));
    }
  }

  function closeSheet() {
    setEditing(null);
    setPendingAssign(null);
    setPhotoError("");
    setSaveError("");
  }

  function toggleUserStatus(user) {
    if (!canDeactivateUser(user)) return;
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((current) =>
      current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)),
    );
    toast.success(
      `${user.name} ${nextStatus === "Active" ? "activated" : "deactivated"} successfully.`,
    );
  }

  async function deleteUser() {
    if (!deleting || isDeleting) return;
    if (!canDeactivateUser(deleting)) return;
    setIsDeleting(true);
    setDeleteError("");
    const target = deleting;
    try {
      const result = await dispatch(Deleteusers(target.userId)).unwrap();
      setUsers((current) => current.filter((user) => user.id !== target.id));
      setDeleting(null);
      dispatch(Getuserslist()); // refresh the table
      toast.success(result?.message || "User deleted successfully.");
    } catch (error) {
      const message =
        typeof error === "string" ? error : error?.message || "Failed to delete user.";
      setDeleteError(message); // keep the dialog open
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  function uploadPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoError("");
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setPhotoError("Choose a JPG, PNG, or WebP image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setEditing((current) => (current ? { ...current, avatar: reader.result } : current));
    reader.onerror = () => setPhotoError("Unable to read this image. Please try another.");
    reader.readAsDataURL(file);
  }

  function buildUserPayload({ form, state, roleCode, isEdit = false }) {
    const country = String(form.get("mobileCountry"));
    const ids = resolveAssignmentIds(state);
    const custnmbr =
      state.custnmbr || users.find((u) => u.custnmbr)?.custnmbr || DEFAULT_CUSTNMBR;

    const payload = {
      countryCode: `+${getCountryCallingCode(country)}`,
      mobileNumber: String(form.get("mobile")).trim(),
      fullName: String(form.get("name")).trim(),
      emailID: String(form.get("email")).trim(),
      custnmbr,
      roles: roleCode,
      isVerified: true,
      isActive: state.status !== "Inactive",
    };

    for (const key of payloadKeysByRole[roleCode] ?? []) {
      payload[key] = ids[key];
    }

    if (isEdit) payload.modifiedBY = MODIFIED_BY;
    else payload.createdBY = CREATED_BY;
    return payload;
  }

  async function saveUser(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedRole = String(form.get("role"));
    const roleCode = roleCodeByName[selectedRole];
    const name = String(form.get("name")).trim();
    if (!name) return;

    const isEdit = Boolean(editing.id);

    // the logged-in role must be allowed to create / edit the chosen target role
    const permissionKey = isEdit ? "employee.edit" : "employee.create";
    if (!canActOnRole(role, permissionKey, roleCode)) {
      setSaveError(
        `You are not allowed to ${isEdit ? "edit" : "create"} ${roleLabelByCode[roleCode] ?? "this role"}.`,
      );
      return;
    }

    // build the role-specific payload and validate required assignments
    const payload = buildUserPayload({ form, state: editing, roleCode, isEdit });
    const missing = (payloadKeysByRole[roleCode] ?? []).find((key) => !payload[key]?.length);
    if (missing) {
      setSaveError(`Select at least one ${payloadKeyLabel[missing]}.`);
      return;
    }

    setSaveError("");
    setSaving(true);
    try {
      if (isEdit) {
        await dispatch(Updateusers({ id: editing.userId, data: payload })).unwrap();
      } else {
        await dispatch(Postusers({ data: payload })).unwrap();
      }
      dispatch(Getuserslist()); // refresh the table
      // only switch tab if the saved role's tab is visible to this user
      if (visibleRoles.some((r) => r.name === selectedRole)) selectRole(selectedRole);
      closeSheet();
      toast.success(
        `${roleLabelByCode[roleCode]} ${isEdit ? "updated" : "created"} successfully.`,
      );
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || `Failed to ${isEdit ? "update" : "create"} user.`;
      setSaveError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  // ── 5.7b Access guards (must stay AFTER all hooks) ──────────
  if (role === null) return null; // role not read from localStorage yet
  if (!can(role, "employee.view") || !visibleRoles.length) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        You don&apos;t have access to this page.
      </p>
    );
  }

  // ── 5.8 Render ──────────────────────────────────────────────
  return (
    <section className="@container/roles min-w-0 space-y-3 p-3 sm:space-y-4 sm:p-4">
      {/* ---------- Role tabs (driven by employee.view -> visibleRoles) ---------- */}
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        {/* wide screens */}
        <div
          className="hidden min-w-0 flex-nowrap gap-2 overflow-x-auto @[640px]/roles:flex"
          role="group"
          aria-label="Filter users by role"
        >
          {visibleRoles.map((item) => {
            const Icon = item.icon;
            const active = item.name === roleName;
            return (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                aria-pressed={active}
                onClick={() => selectRole(item.name)}
                className={`relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${active ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-muted/30 text-foreground hover:bg-muted/60"}`}
              >
                <Icon className={`size-4 shrink-0 ${item.color}`} />
                <span className="whitespace-nowrap @[1100px]/roles:hidden">{item.shortName}</span>
                <span className="hidden whitespace-nowrap @[1100px]/roles:inline">{item.name}</span>
                <span
                  className={`hidden rounded-full px-2 py-0.5 text-xs tabular-nums @[1100px]/roles:inline ${active ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {users.filter((user) => user.role === item.name).length}
                </span>
                {active && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* narrow screens */}
        <div className="min-w-0 @[640px]/roles:hidden">
          <div
            className="grid w-full items-stretch gap-1.5 py-1"
            style={{
              gridTemplateColumns: `repeat(${mainRoles.length + (moreRoles.length ? 1 : 0)}, minmax(0, 1fr))`,
            }}
            role="group"
            aria-label="Filter users by role"
          >
            {mainRoles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  aria-label={item.name}
                  aria-pressed={roleName === item.name}
                  onClick={() => selectRole(item.name)}
                  className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-[10px] leading-tight font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${roleName === item.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  <Icon
                    className={`size-3.5 shrink-0 ${roleName === item.name ? "text-primary-foreground" : item.color}`}
                  />
                  <span className="min-w-0 text-center">{item.shortName}</span>
                </button>
              );
            })}

            {moreRoles.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    aria-label="More roles"
                    className={`h-full min-h-10 w-full min-w-0 gap-1 rounded-md border-0 px-1 py-1 text-[10px] ${moreRoles.some((r) => r.name === roleName) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    More
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-60">
                  <DropdownMenuRadioGroup value={roleName} onValueChange={selectRole}>
                    {moreRoles.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuRadioItem
                          key={item.name}
                          value={item.name}
                          className="gap-2 pr-12 whitespace-nowrap [&>[data-slot=dropdown-menu-radio-item-indicator]]:right-3"
                        >
                          <Icon className={`size-4 shrink-0 ${item.color}`} />
                          <span className="mr-2">{item.shortName}</span>
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
            Selected: {roleName === "Employees" ? "Employee" : roleName}
          </p>
        </div>
      </div>

      {/* ---------- Search, filters, Add User ---------- */}
      <div className="grid min-w-0 grid-cols-1 items-center gap-2 @[1200px]/roles:grid-cols-[18rem_minmax(0,1fr)]">
        <label className="relative block w-full min-w-0">
          <span className="sr-only">Search users</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email or employee ID..."
            className={`${fieldClass} pl-9`}
          />
        </label>
        <div
          className="grid min-w-0 grid-cols-2 gap-2 @[720px]/roles:grid-cols-[repeat(var(--filter-count),minmax(0,1fr))] @[1200px]/roles:grid-cols-[repeat(var(--filter-count),minmax(0,9rem))] @[1200px]/roles:justify-end"
          style={{ "--filter-count": filters.length + (canCreate ? 1 : 0) }}
        >
          {filters.map(([title, value, setter, options, disabled], index) => (
            <label
              key={title}
              className={`min-w-0 text-xs text-muted-foreground ${index === 0 && filters.length % 2 === 0 ? "col-span-2 @[720px]/roles:col-span-1" : ""}`}
            >
              <span className="sr-only">{title}</span>
              <select
                value={value}
                disabled={disabled}
                onChange={(event) => {
                  setter(event.target.value);
                  setPage(1);
                }}
                className={`${fieldClass} text-foreground disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
          {canCreate && (
            <Button
              className="h-9 w-full min-w-0 gap-2 whitespace-nowrap px-3 text-xs"
              onClick={openAddSheet}
            >
              <Plus className="size-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* ---------- Users load error ---------- */}
      {userslistStatus === "failed" && (
        <p role="alert" className="text-sm text-destructive">
          {typeof userslistError === "string"
            ? userslistError
            : userslistError?.message || userslistError?.Msg || "Failed to load users."}
        </p>
      )}

      {/* ---------- Users table ---------- */}
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-80 flex-col items-center justify-center gap-2 p-6 text-muted-foreground"
        >
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs font-medium">Loading Users...</p>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border">
          <table
            className={`w-full text-left text-sm ${showDepartment ? "min-w-[1120px]" : showStore ? "min-w-[960px]" : showTerritory ? "min-w-[680px]" : "min-w-[520px]"}`}
          >
            <caption className="sr-only">{roleName} users</caption>
            <thead className="border-b admin-table-header text-xs text-muted-foreground">
              <tr>
                {columns.map((title) => (
                  <th key={title} scope="col" className="px-4 py-3 font-medium">
                    {title}
                  </th>
                ))}
                {showActions && (
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((user, index) => (
                <tr key={user.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={user.avatar || undefined} alt="" />
                        <AvatarFallback
                          className={`text-xs font-semibold ${avatarColors[index % avatarColors.length]}`}
                        >
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="whitespace-nowrap font-medium">{user.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {user.mobile ? `${user.mobileCountryCode || "+1"} ${user.mobile}` : "—"}
                  </td>
                  {showTerritory && (
                    <td className="px-4 py-3">
                      <AssignmentList value={user.territory} label="Territories" icon={MapPin} />
                    </td>
                  )}
                  {showArea && (
                    <td className="px-4 py-3">
                      <AssignmentList value={user.area} label="Areas" icon={MapPin} />
                    </td>
                  )}
                  {showStore && (
                    <td className="px-4 py-3">
                      <AssignmentList value={user.store} label="Stores" icon={Store} />
                    </td>
                  )}
                  {showDepartment && (
                    <td className="px-4 py-3">
                      <AssignmentList value={user.department} label="Departments" icon={Network} />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={`rounded-full px-3 ${user.status === "Active" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/15 text-rose-700 dark:text-rose-400"}`}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  {showActions && (
                    <td className="px-4 py-3 text-right">
                      {(canEditUser(user) || canDeactivateUser(user)) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${user.name}`}
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-auto min-w-32">
                            {canEditUser(user) && (
                              <DropdownMenuItem
                                className="whitespace-nowrap"
                                onSelect={() => openEditSheet(user)}
                              >
                                <Pencil />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDeactivateUser(user) && (
                              <>
                                <DropdownMenuItem
                                  className="whitespace-nowrap"
                                  onSelect={() => toggleUserStatus(user)}
                                >
                                  <UserRoundCheck />
                                  {user.status === "Active" ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="whitespace-nowrap"
                                  onSelect={() => {
                                    setDeleteError("");
                                    setDeleting(user);
                                  }}
                                >
                                  <Trash2 />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No users match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Pagination ---------- */}
      {!isLoading && (
        <PaginationCustomUsers
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          itemLabel="users"
          className="bg-transparent pt-0 pb-4"
        />
      )}

      {/* ---------- Delete dialog ---------- */}
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleting(null);
        }}
      >
        <DialogContent showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              Remove {deleting?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={isDeleting} onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={deleteUser}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------- Add / Edit sheet ---------- */}
      <Sheet
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) closeSheet();
        }}
      >
        <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
          <SheetHeader className="gap-0 border-b">
            <div className="flex items-center justify-between gap-3 pr-8">
              <SheetTitle>{editing?.id ? "Edit User" : "Add User"}</SheetTitle>
              <label
                className={`flex shrink-0 items-center gap-2 text-xs ${editing?.status === "Inactive" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
              >
                <span>Status</span>
                <Switch
                  aria-label="User active status"
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600 dark:data-[state=unchecked]:bg-red-600"
                  checked={editing?.status !== "Inactive"}
                  onCheckedChange={(checked) =>
                    setEditing((current) =>
                      current ? { ...current, status: checked ? "Active" : "Inactive" } : current,
                    )
                  }
                />
              </label>
            </div>
            <SheetDescription className="text-xs leading-snug">
              Enter contact details and assign a role.
            </SheetDescription>
          </SheetHeader>

          {/* loader while GET /users/:id is in flight (edit only) */}
          {editing?.id && !editing.hydrated && (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-muted-foreground"
            >
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading user...</p>
            </div>
          )}

          {/* form: always for Add, for Edit only after the user is loaded */}
          {editing && (!editing.id || editing.hydrated) && (
            <form
              key={editing.id || "new"}
              onSubmit={saveUser}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
                {/* photo + name + email */}
                <div className="grid min-w-0 grid-cols-[8rem_minmax(0,1fr)] items-center gap-4">
                  <label className="relative size-30 cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label="Upload user photo"
                      onChange={uploadPhoto}
                      className="sr-only"
                    />
                    <Avatar className="size-30">
                      <AvatarImage src={editing.avatar || undefined} alt="User photo preview" />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <UserRoundCheck className="size-9" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute right-2 bottom-2 z-10 grid size-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                      <Camera className="size-3" />
                    </span>
                  </label>
                  <div className="flex h-32 min-w-0 flex-col justify-between gap-2">
                    <label className="grid min-w-0 gap-1 text-sm">
                      <span>Name</span>
                      <input
                        name="name"
                        required
                        maxLength={100}
                        defaultValue={editing.name || ""}
                        className={fieldClass}
                      />
                    </label>
                    <label className="grid min-w-0 gap-1 text-sm">
                      <span>Email</span>
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={editing.email || ""}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                </div>
                {photoError && (
                  <p role="alert" className="text-xs text-destructive">
                    {photoError}
                  </p>
                )}

                {/* contact number */}
                <fieldset className="min-w-0 space-y-1.5 text-sm">
                  <legend>Contact No.</legend>
                  <div
                    className="grid min-w-0 items-center gap-2 text-xs"
                    style={{
                      gridTemplateColumns: `calc(${mobileCountryLabelLength}ch + 2rem) minmax(0, 1fr)`,
                    }}
                  >
                    <select
                      name="mobileCountry"
                      aria-label="Contact country code"
                      defaultValue={editing.mobileCountry || "US"}
                      className={fieldClass}
                      style={{ height: "2rem" }}
                    >
                      {mobileCountries.map(({ country, code }) => (
                        <option key={country} value={country}>
                          {country} {code}
                        </option>
                      ))}
                    </select>
                    <input
                      name="mobile"
                      aria-label="Contact No."
                      type="tel"
                      autoComplete="tel-national"
                      defaultValue={editing.mobile || ""}
                      className={fieldClass}
                    />
                  </div>
                </fieldset>

                {/* role (limited to roles the logged-in user may create / edit) */}
                <label className="block space-y-1.5 text-sm">
                  <span>Role</span>
                  <select
                    name="role"
                    value={editing.role}
                    onChange={(event) => {
                      setSaveError("");
                      const nextRole = event.target.value;
                      setEditing((current) => {
                        const next = {
                          ...current,
                          role: nextRole,
                          roles: roleCodeByName[nextRole],
                          reportsTo: "",
                        };
                        // fields that are single-select for the new role keep only the first value
                        for (const f of ["territory", "area", "store", "department"]) {
                          if (!isMultiField(roleCodeByName[nextRole], f)) {
                            next[f] = assignmentValues(current[f]).slice(0, 1);
                          }
                        }
                        return next;
                      });
                    }}
                    className={fieldClass}
                  >
                    {sheetRoleOptions.map((item) => (
                      <option key={item.name}>{item.name}</option>
                    ))}
                  </select>
                </label>

                {/* reports to */}
                <ReportsToSelect
                  role={editing.role}
                  groups={reportingGroups}
                  selectedUser={reportsTo}
                  onChange={(value) =>
                    setEditing((current) => ({ ...current, reportsTo: value }))
                  }
                />

                {/* territory > area > store > department */}
                {sheetAssignmentFields.map(([key, title], index) => {
                  const parent = sheetAssignmentFields[index - 1];
                  const parentEmpty = parent && !assignmentValues(editing[parent[0]]).length;
                  return (
                    <AssignmentAutocomplete
                      key={key}
                      multiple={isMultiField(sheetRoleCode, key)}
                      fieldKey={key}
                      title={title}
                      options={optionLists[key] ?? []}
                      selected={assignmentValues(editing[key])}
                      loading={Boolean(loadingByKey[key])}
                      parentTitle={parentEmpty ? parent[1] : null}
                      onChange={(next) =>
                        setEditing((current) =>
                          current ? pruneAssignments({ ...current, [key]: next }) : current,
                        )
                      }
                    />
                  );
                })}
              </div>

              {saveError && (
                <p role="alert" className="px-4 pb-2 text-xs text-destructive">
                  {saveError}
                </p>
              )}
              <SheetFooter className="grid grid-cols-2 border-t">
                <SheetClose asChild>
                  <Button type="button" variant="outline" className="w-full" disabled={saving}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}