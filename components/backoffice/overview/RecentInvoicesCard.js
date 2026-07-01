import { ReceiptText } from "lucide-react";

import { money, recentInvoices } from "./dashboard-data";

export default function RecentInvoicesCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest unique invoice records.</p>
        </div>
        <ReceiptText className="size-5 text-primary" />
      </div>
      <div className="mt-4 overflow-hidden ">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Invoice</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Company</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentInvoices.map((invoice) => (
              <tr key={invoice.invoiceNumber}>
                <td className="px-3 py-2 font-medium">{invoice.invoiceNumber}</td>
                <td className="px-3 py-2 text-muted-foreground">{invoice.customerId}</td>
                <td className="px-3 py-2">{invoice.company}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {new Date(invoice.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-3 py-2 text-right">{money.format(invoice.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
