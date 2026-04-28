export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="h-10 w-32 bg-muted border-2 border-border animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-2 border-border bg-background p-5 shadow-shadow space-y-3">
            <div className="h-48 bg-muted border-2 border-border animate-pulse" />
            <div className="h-5 w-3/4 bg-muted animate-pulse" />
            <div className="h-4 w-full bg-muted animate-pulse" />
            <div className="h-4 w-2/3 bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
