"use client";

import { useMemo, useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const EMPLOYEES = [
	{
		id: 1,
		name: "John Smith",
		email: "john.smith@alohaproduce.com",
		phone: "(808) 555-1001",
		role: "Manager",
		avatar: "JS",
	},
	{
		id: 2,
		name: "Emily Johnson",
		email: "emily.johnson@alohaproduce.com",
		phone: "(808) 555-1002",
		role: "Sales Executive",
		avatar: "EJ",
	},
	{
		id: 3,
		name: "Michael Brown",
		email: "michael.brown@alohaproduce.com",
		phone: "(808) 555-1003",
		role: "Warehouse Staff",
		avatar: "MB",
	},
	{
		id: 4,
		name: "Sarah Wilson",
		email: "sarah.wilson@alohaproduce.com",
		phone: "(808) 555-1004",
		role: "Accountant",
		avatar: "SW",
	},
	{
		id: 5,
		name: "David Lee",
		email: "david.lee@alohaproduce.com",
		phone: "(808) 555-1005",
		role: "Delivery Driver",
		avatar: "DL",
	},
	{
		id: 6,
		name: "Jessica Taylor",
		email: "jessica.taylor@alohaproduce.com",
		phone: "(808) 555-1006",
		role: "Customer Support",
		avatar: "JT",
	},
	{
		id: 7,
		name: "Chris Martin",
		email: "chris.martin@alohaproduce.com",
		phone: "(808) 555-1007",
		role: "Supervisor",
		avatar: "CM",
	},
	{
		id: 8,
		name: "Olivia Davis",
		email: "olivia.davis@alohaproduce.com",
		phone: "(808) 555-1008",
		role: "Purchase Executive",
		avatar: "OD",
	},
	{
		id: 9,
		name: "James Moore",
		email: "james.moore@alohaproduce.com",
		phone: "(808) 555-1009",
		role: "Inventory Staff",
		avatar: "JM",
	},
	{
		id: 10,
		name: "Sophia White",
		email: "sophia.white@alohaproduce.com",
		phone: "(808) 555-1010",
		role: "Sales Executive",
		avatar: "SW",
	},
	{
		id: 11,
		name: "Daniel Harris",
		email: "daniel.harris@alohaproduce.com",
		phone: "(808) 555-1011",
		role: "Delivery Driver",
		avatar: "DH",
	},
	{
		id: 12,
		name: "Emma Clark",
		email: "emma.clark@alohaproduce.com",
		phone: "(808) 555-1012",
		role: "Admin",
		avatar: "EC",
	},
];

const PAGE_SIZE = 6;

const Employees = () => {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const listTopRef = useRef(null);

	const filteredEmployees = useMemo(() => {
		const query = search.toLowerCase().trim();

		return EMPLOYEES.filter(
			(employee) =>
				employee.name.toLowerCase().includes(query) ||
				employee.email.toLowerCase().includes(query) ||
				employee.phone.toLowerCase().includes(query) ||
				employee.role.toLowerCase().includes(query)
		);
	}, [search]);

	const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);

	const paginatedEmployees = filteredEmployees.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	);

	const handlePageChange = (page) => {
		setCurrentPage(page);

		setTimeout(() => {
			listTopRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 0);
	};

	return (
		<div className="space-y-5 p-4">
			<div
				ref={listTopRef}
				className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-start"
			>
				<div className="relative w-full lg:max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

					<input
						type="text"
						placeholder="Search by name, email, phone or role..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
						className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2"
					/>
				</div>
			</div>

			<div className="hidden overflow-hidden rounded-xl border bg-card md:block">
				<table className="w-full">
					<thead>
						<tr className="border-b bg-muted/40">
							<th className="px-5 py-4 text-left text-sm font-semibold">
								Employee
							</th>
							<th className="px-5 py-4 text-left text-sm font-semibold">
								Role
							</th>
							<th className="px-5 py-4 text-left text-sm font-semibold">
								Email
							</th>
							<th className="px-5 py-4 text-left text-sm font-semibold">
								Phone
							</th>
						</tr>
					</thead>

					<tbody>
						{paginatedEmployees.map((employee) => (
							<tr key={employee.id} className="border-b last:border-0">
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
											{employee.avatar}
										</div>

										<div className="font-medium">
											{employee.name}
										</div>
									</div>
								</td>

								<td className="px-5 py-4">
									<span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
										{employee.role}
									</span>
								</td>

								<td className="px-5 py-4 text-sm">
									{employee.email}
								</td>

								<td className="px-5 py-4 text-sm">
									{employee.phone}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="space-y-3 md:hidden">
				{paginatedEmployees.map((employee) => (
					<div key={employee.id} className="rounded-xl border bg-card p-4">
						<div className="flex items-start gap-3">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
								{employee.avatar}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-2">
									<h3 className="font-semibold">{employee.name}</h3>

									<span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
										{employee.role}
									</span>
								</div>

								<p className="mt-2 truncate text-sm text-muted-foreground">
									{employee.email}
								</p>

								<p className="mt-1 text-sm text-muted-foreground">
									{employee.phone}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredEmployees.length === 0 && (
				<div className="rounded-xl border bg-card p-8 text-center">
					<p className="font-semibold">No employees found</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Try searching with another name, role, email, or phone number.
					</p>
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						className="flex h-9 w-9 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-50"
						disabled={currentPage === 1}
						onClick={() => handlePageChange(currentPage - 1)}
					>
						<ChevronLeft className="h-4 w-4" />
					</button>

					{Array.from({ length: totalPages }, (_, index) => (
						<button
							key={index}
							onClick={() => handlePageChange(index + 1)}
							className={`h-9 w-9 rounded-md border text-sm font-medium ${
								currentPage === index + 1
									? "bg-primary text-primary-foreground"
									: ""
							}`}
						>
							{index + 1}
						</button>
					))}

					<button
						className="flex h-9 w-9 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-50"
						disabled={currentPage === totalPages}
						onClick={() => handlePageChange(currentPage + 1)}
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			)}
		</div>
	);
};

export default Employees;