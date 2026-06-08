import { jsPDF } from "jspdf"

function sanitizeFileName(value) {
	return String(value || "Invoice")
		.replace(/[^a-z0-9-]+/gi, "-")
		.replace(/-+/g, "-")
}

async function getImageDataUrl(src) {
	try {
		const response = await fetch(src)
		const blob = await response.blob()

		return await new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result)
			reader.onerror = reject
			reader.readAsDataURL(blob)
		})
	} catch {
		return null
	}
}

function drawText(doc, text, x, y, options = {}) {
	doc.text(String(text ?? ""), x, y, options)
}

function drawInfoTable(doc, x, y, order) {
	const boxWidth = 130
	const boxHeight = 24
	const valueY = y + boxHeight

	doc.setFont("poppins", "bold")
	doc.setFontSize(10)

	doc.setFillColor(49, 52, 60)
	doc.rect(x, y, boxWidth, boxHeight, "F")
	doc.rect(x + boxWidth, y, boxWidth, boxHeight, "F")

	doc.setTextColor(255, 255, 255)
	drawText(doc, "Invoice", x + 6, y + 16)
	drawText(doc, "Date", x + boxWidth + 6, y + 16)

	doc.setDrawColor(90, 90, 90)
	doc.rect(x, valueY, boxWidth, boxHeight)
	doc.rect(x + boxWidth, valueY, boxWidth, boxHeight)

	doc.setFont("poppins", "normal")
	doc.setTextColor(0, 0, 0)
	drawText(doc, order.invoiceNumber || order.orderNumber || "-", x + 6, valueY + 16)
	drawText(doc, order.placedOn || "-", x + boxWidth + 6, valueY + 16)

	const dueY = valueY + boxHeight + 8

	doc.setFont("poppins", "bold")
	doc.setFillColor(49, 52, 60)
	doc.rect(x, dueY, boxWidth, boxHeight, "F")

	doc.setTextColor(255, 255, 255)
	drawText(doc, "Payment due by", x + 6, dueY + 16)

	doc.setDrawColor(90, 90, 90)
	doc.rect(x + boxWidth, dueY, boxWidth, boxHeight)

	doc.setFont("poppins", "normal")
	doc.setTextColor(0, 0, 0)
	drawText(doc, order.deliveryDate || order.placedOn || "-", x + boxWidth + 6, dueY + 16)
}

function drawAddressBlock(doc, title, name, address, x, y) {
	const maxWidth = 190

	doc.setFont("poppins", "bold")
	doc.setFontSize(10)
	doc.setTextColor(0, 0, 0)
	drawText(doc, title, x, y)

	doc.setFont("poppins", "normal")
	doc.setFontSize(10)

	const nameLines = doc.splitTextToSize(name || "-", maxWidth)
	doc.text(nameLines, x, y + 18)

	const addressY = y + 18 + nameLines.length * 13
	drawText(doc, address || "-", x, addressY)
}

export async function DownloadInvoice(order) {
	const doc = new jsPDF({
		orientation: "landscape",
		unit: "pt",
		format: "a4",
	})

	const pageWidth = doc.internal.pageSize.getWidth()
	const startX = 40
	const logoDataUrl = await getImageDataUrl("/logo/logo.png")

	if (logoDataUrl) {
		doc.addImage(logoDataUrl, "PNG", 90, 45, 85, 75)
	}

	doc.setFont("poppins", "normal")
	doc.setFontSize(10)
	doc.setTextColor(0, 0, 0)

	drawText(doc, "Aloha Produce", 240, 72)
	drawText(doc, "16111 SE 98th Ave", 240, 88)
	drawText(doc, "Clackamas, Oregon 97015", 240, 104)

	drawInfoTable(doc, pageWidth - 320, 40, order)

	const customerName =
		order.customerName ||
		order.customer?.name ||
		"Happy Sappy Cust Do Not Delete-Happy Sappy"

	const customerAddress =
		order.address || order.customer?.address || "N/A, Washington"

	drawAddressBlock(doc, "Sold to", customerName, customerAddress, startX, 155)
	drawAddressBlock(doc, "Ship to", customerName, customerAddress, 265, 155)

	const tableY = 250
	const tableWidth = pageWidth - 80

	doc.setFillColor(222, 222, 222)
	doc.rect(startX, tableY, tableWidth, 28, "F")

	doc.setFont("poppins", "bold")
	doc.setFontSize(9)
	doc.setTextColor(0, 0, 0)

	drawText(doc, "Order qty.", 45, tableY + 18)
	drawText(doc, "Unit", 130, tableY + 18)
	drawText(doc, "Item code", 170, tableY + 18)
	drawText(doc, "Item name", 255, tableY + 18)
	drawText(doc, "Ship qty.", 555, tableY + 18)
	drawText(doc, "Unit", 635, tableY + 18)
	drawText(doc, "Price", 680, tableY + 18)
	drawText(doc, "Line total", 740, tableY + 18)

	let y = tableY + 28
	let total = 0

	doc.setFont("poppins", "normal")
	doc.setFontSize(9)

	order.items.forEach((item) => {
		const quantity = Number(item.quantity || 0)
		const price = Number(item.price || 0)
		const lineTotal = quantity * price
		total += lineTotal

		doc.setDrawColor(220, 220, 220)
		doc.rect(startX, y, tableWidth, 26)

		drawText(doc, quantity, 45, y + 17)
		drawText(doc, item.unit || "LB", 130, y + 17)
		drawText(doc, item.sku || item.itemCode || "-", 170, y + 17)
		drawText(doc, item.name || "-", 255, y + 17, { maxWidth: 285 })
		drawText(doc, quantity, 555, y + 17)
		drawText(doc, item.unit || "LB", 635, y + 17)
		drawText(doc, `$${price.toFixed(2)}`, 680, y + 17)
		drawText(doc, `$${lineTotal.toFixed(2)}`, 740, y + 17)

		y += 26
	})

	doc.setFont("poppins", "bold")
	doc.rect(600, y, 85, 26)
	doc.rect(685, y, 120, 26)

	drawText(doc, "Total", 645, y + 17)
	drawText(doc, `$${Number(order.total || total).toFixed(2)}`, 740, y + 17)

	doc.save(`${sanitizeFileName(order.orderNumber || "invoice")}-Invoice.pdf`)
}