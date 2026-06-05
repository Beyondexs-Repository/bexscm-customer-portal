export function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This section is ready for content.
        </p>
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
