import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MetricPanel({ title, description, action, children, className = "", table = false }) {
  return (
    <Card className={`min-w-0 gap-0 py-0 ${className}`}>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 rounded-none border-b px-4 py-3 [.border-b]:pb-3 sm:px-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardHeader>
      <CardContent className={table ? "p-0" : "flex flex-1 flex-col p-4 sm:px-5"}>{children}</CardContent>
    </Card>
  )
}
