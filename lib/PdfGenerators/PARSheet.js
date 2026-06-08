import { jsPDF } from "jspdf";

const DATE_COLUMN_COUNT = 8;
const CUSTOMER_LINES = [
	"Company Name",
	"123 Main Street",
	"Anytown, ST 12345",
];

function sanitizeFileName(value) {
	return value.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-");
}

async function getImageDataUrl(src) {
	try {
		const response = await fetch(src);
		const blob = await response.blob();

		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}

function drawText(doc, text, x, y, options = {}) {
	doc.text(String(text ?? ""), x, y, options);
}

function drawHeader(doc, logoDataUrl) {
	if (logoDataUrl) {
		doc.addImage(logoDataUrl, "PNG", 22, 12, 28, 28);
	}

	doc.setFont("poppins", "bold");
	doc.setFontSize(9);
	drawText(doc, "Customer:", 88, 14);

	doc.setFont("poppins", "normal");
	doc.setFontSize(8.5);

	CUSTOMER_LINES.forEach((line, index) => {
		drawText(doc, line, 88, 24 + index * 10);
	});

	drawText(doc, "Page 1 of 1", 532, 14, { align: "right" });
}

function drawTableHeader(doc, layout) {
	const { startX, startY, itemWidth, unitWidth, parWidth, dateWidth } = layout;
	const dateStartX = startX + itemWidth + unitWidth + parWidth;

	doc.setDrawColor(218, 222, 226);
	doc.setLineWidth(0.4);
	doc.setFont("poppins", "normal");
	doc.setFontSize(7);
	doc.setTextColor(145, 151, 161);

	for (let index = 0; index <= DATE_COLUMN_COUNT; index += 1) {
		const x = dateStartX + index * dateWidth;
		doc.line(x, startY, x, startY + 38);
	}

	for (let index = 0; index < DATE_COLUMN_COUNT; index += 1) {
		const columnX = dateStartX + index * dateWidth + dateWidth / 2;
		drawText(doc, "Date", columnX, startY + 10, { align: "center" });
	}

	doc.setFont("poppins", "bold");
	doc.setTextColor(48, 57, 65);

	drawText(doc, "Item", startX, startY + 34);
	drawText(doc, "Unit of Measure", startX + itemWidth + 6, startY + 34);
	drawText(doc, "PAR", startX + itemWidth + unitWidth + 6, startY + 34);

	for (let index = 0; index < DATE_COLUMN_COUNT; index += 1) {
		const columnX = dateStartX + index * dateWidth + dateWidth / 2;
		drawText(doc, "Qty", columnX, startY + 34, { align: "center" });
	}

	doc.line(startX, startY + 38, layout.endX, startY + 38);
}

function drawGroupRow(doc, groupName, y, layout) {
	doc.setFillColor(37, 45, 43);
	doc.rect(
		layout.startX,
		y,
		layout.endX - layout.startX,
		layout.groupHeight,
		"F",
	);

	doc.setTextColor(255, 255, 255);
	doc.setFont("poppins", "bold");
	doc.setFontSize(8);

	drawText(doc, groupName, layout.startX + 4, y + 9);
}

function drawProductRow(doc, product, y, layout) {
	const { startX, itemWidth, unitWidth, parWidth, dateWidth, rowHeight } =
		layout;

	const unitX = startX + itemWidth;
	const parX = unitX + unitWidth;
	const dateStartX = parX + parWidth;

	doc.setDrawColor(218, 222, 226);
	doc.setLineWidth(0.4);
	doc.line(startX, y + rowHeight, layout.endX, y + rowHeight);

	for (let index = 0; index <= DATE_COLUMN_COUNT; index += 1) {
		const x = dateStartX + index * dateWidth;
		doc.line(x, y, x, y + rowHeight);
	}

	doc.setTextColor(10, 16, 22);
	doc.setFont("poppins", "normal");
	doc.setFontSize(8);

	// Added more spacing between product name and SKU
	drawText(doc, product.name, startX, y + 9);
	drawText(doc, product.sku ?? product.id ?? "", startX, y + 23);

	drawText(doc, product.unit || "", unitX + 6, y + 12);
	drawText(doc, product.par ?? "", parX + 6, y + 12);
}

function flattenGroupRows(order) {
	return order.groups.flatMap((group) => [
		{ type: "group", id: group.id, name: group.name },
		...group.products.map((product) => ({
			type: "product",
			id: `${group.id}-${product.id}`,
			product,
		})),
	]);
}

export async function downloadPARSheet(order) {
	const doc = new jsPDF({
		orientation: "landscape",
		unit: "pt",
		format: "a4",
	});

	const logoDataUrl = await getImageDataUrl("/logo/logo.png");

	drawHeader(doc, logoDataUrl);

	const layout = {
		startX: 16,
		startY: 54,
		endX: 820,
		itemWidth: 240,
		unitWidth: 75,
		parWidth: 48,
		dateWidth: 55,

		// Increased row height for better spacing
		rowHeight: 36,

		groupHeight: 13,
	};

	drawTableHeader(doc, layout);

	let y = layout.startY + 38;

	flattenGroupRows(order).forEach((row) => {
		if (row.type === "group") {
			drawGroupRow(doc, row.name, y, layout);
			y += layout.groupHeight;
			return;
		}

		drawProductRow(doc, row.product, y, layout);
		y += layout.rowHeight;
	});

	doc.save(`${sanitizeFileName(order.name || "PAR-Sheet")}-PAR-Sheet.pdf`);
}