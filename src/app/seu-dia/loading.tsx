export default function SeuDiaLoading() {
  return (
    <main className="flex flex-col">
      <section className="border-b-2 border-border bg-vibrant-pink pt-8 pb-10 md:pt-10 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-24 w-48 bg-muted/40 border-2 border-border animate-pulse" />
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 w-full space-y-16">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted border-2 border-border animate-pulse" />
          <div className="h-12 w-72 bg-muted border-2 border-border animate-pulse" />
        </div>
      </div>
    </main>
  )
}
