import { ExternalLink } from 'lucide-react'
import type { OnThisDayResult, WikiEvent, ValidSeuDiaParams } from '@/features/seu-dia'
import { WikiThumbnail } from './wiki-thumbnail'

interface DayResultsProps {
  result: OnThisDayResult
  params: ValidSeuDiaParams
}

function normalizeWikiTitle(title: string) {
  return title.replaceAll('_', ' ').trim()
}

function normalizeWikiText(text: string | undefined) {
  return text ? text.replaceAll('_', ' ').trim() : ''
}

function getEventLead(text: string | undefined) {
  const normalized = normalizeWikiText(text)
  return normalized.split(',')[0]?.replace(/\.$/, '').trim() ?? ''
}

function getPersonName(event: WikiEvent) {
  return normalizeWikiTitle(event.pages[0]?.title ?? '') || getEventLead(event.text)
}

function shouldContainThumbnail(thumbnail: { source: string; width: number; height: number } | undefined) {
  if (!thumbnail) return false
  const aspectRatio = thumbnail.width / thumbnail.height
  return thumbnail.width < 220 || thumbnail.height < 140 || aspectRatio < 1.2
}

// ── Cards ──────────────────────────────────────────────────────────────────

function EventCard({ event, index, accent }: { event: WikiEvent; index: number; accent?: string }) {
  const page = event.pages[0]
  const wikiUrl = page?.content_urls?.desktop.page
  const thumbnail = page?.thumbnail
  const thumb = thumbnail?.source
  const extract = normalizeWikiText(page?.extract?.split('. ')[0])
  const imageFitClass = shouldContainThumbnail(thumbnail)
    ? 'object-contain p-4 bg-muted'
    : 'object-cover'

  return (
    <article
      className="animate-card-enter border-2 border-border bg-background shadow-shadow overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {thumb && (
        <div className="relative w-full h-28 border-b-2 border-border overflow-hidden flex-shrink-0">
          <WikiThumbnail
            src={thumb}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className={imageFitClass}
          />
          {!shouldContainThumbnail(thumbnail) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-block border-2 border-border px-2 py-0.5 font-heading text-[11px] font-black uppercase tracking-wider ${accent ?? 'bg-muted'}`}
          >
            {event.year}
          </span>
        </div>
        <p className="font-base text-sm leading-snug flex-1">{event.text}</p>
        {extract && extract !== event.text && (
          <p className="font-base text-xs leading-snug text-muted-foreground line-clamp-2">{extract}</p>
        )}
        {wikiUrl && (
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-11 items-center gap-1 self-start font-heading text-[11px] font-black uppercase tracking-wider hover:underline"
          >
            Wikipedia <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

function PersonCard({ event, index, accent }: { event: WikiEvent; index: number; accent: string }) {
  const page = event.pages[0]
  const wikiUrl = page?.content_urls?.desktop.page
  const thumb = page?.thumbnail?.source
  const name = getPersonName(event)
  const extract = normalizeWikiText(page?.extract?.split('. ')[0])

  return (
    <article
      className="animate-card-enter border-2 border-border bg-background shadow-shadow overflow-hidden flex"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {thumb ? (
        <div className="relative w-20 flex-shrink-0 border-r-2 border-border overflow-hidden">
          <WikiThumbnail
            src={thumb}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className={`w-3 flex-shrink-0 ${accent}`} aria-hidden="true" />
      )}
      <div className="flex flex-col p-4 gap-1.5 min-w-0 flex-1">
        {name && (
          <p className="font-heading text-sm font-black leading-tight line-clamp-1">{name}</p>
        )}
        {extract && (
          <p className="font-base text-xs leading-snug text-muted-foreground line-clamp-2">{extract}</p>
        )}
        <div className="flex items-center gap-3 mt-auto pt-1">
          <span className={`inline-block border-2 border-border px-2 py-0.5 font-heading text-[11px] font-black uppercase tracking-wider ${accent}`}>
            {event.year}
          </span>
          {wikiUrl && (
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-heading text-[11px] font-black uppercase tracking-wider hover:underline"
            >
              Wikipedia <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Exact Day (inverted treatment) ─────────────────────────────────────────

function ExactDaySection({ events, year }: { events: WikiEvent[]; year: number }) {
  if (events.length === 0) return null

  return (
    <section className="border-2 border-border bg-foreground text-background overflow-hidden">
      {/* Header */}
      <div className="relative px-6 py-5 border-b-2 border-background/20">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-heading font-black text-[80px] leading-none text-background/8 select-none pointer-events-none">
          {year}
        </div>
        <p className="font-heading text-[11px] font-black uppercase tracking-[0.2em] text-main">
          No seu ano
        </p>
        <h3 className="font-heading text-2xl font-black uppercase mt-0.5">
          Aconteceu em {year}
        </h3>
      </div>

      {/* Cards */}
      <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {events.map((event, i) => {
          const page = event.pages[0]
          const wikiUrl = page?.content_urls?.desktop.page
          const thumb = page?.thumbnail?.source
          const name = getPersonName(event)
          const description = normalizeWikiText(event.text)

          return (
            <article
              key={`exact-${i}`}
              className="animate-card-enter bg-main text-foreground border-2 border-background/30 flex gap-3 p-3 overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {thumb && (
                <WikiThumbnail
                  src={thumb}
                  width={56}
                  height={56}
                  className="h-14 w-14 flex-shrink-0 border-2 border-foreground/30 object-cover"
                />
              )}
              <div className="flex flex-col gap-1.5 min-w-0">
                {name && (
                  <p className="font-heading text-xs font-black uppercase tracking-wide line-clamp-1">
                    {name}
                  </p>
                )}
                <p className="font-base text-xs leading-snug line-clamp-3">{description}</p>
                {wikiUrl && (
                  <a
                    href={wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 items-center gap-1 font-heading text-[11px] font-black uppercase tracking-wider hover:underline"
                  >
                    Wikipedia <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

// ── Section wrapper ─────────────────────────────────────────────────────────

type SectionKind = 'events' | 'births' | 'deaths'

const SECTION_META: Record<SectionKind, { label: string; accent: string; cardAccent: string }> = {
  events:  { label: 'Eventos do dia',      accent: 'bg-electric-orange', cardAccent: 'bg-electric-orange' },
  births:  { label: 'Nasceram neste dia',  accent: 'bg-cosmic-blue',     cardAccent: 'bg-cosmic-blue'     },
  deaths:  { label: 'Morreram neste dia',  accent: 'bg-vibrant-pink',    cardAccent: 'bg-vibrant-pink'    },
}

function Section({
  kind,
  events,
}: {
  kind: SectionKind
  events: WikiEvent[]
}) {
  if (events.length === 0) return null
  const meta = SECTION_META[kind]
  const isPeople = kind === 'births' || kind === 'deaths'

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`h-5 w-1.5 ${meta.accent} border-2 border-border flex-shrink-0`} aria-hidden="true" />
        <h3 className="font-heading text-lg font-black uppercase tracking-tight">{meta.label}</h3>
        <div className="h-px flex-1 bg-border" />
        <span className="font-heading text-xs font-black text-muted-foreground">{events.length}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isPeople
          ? events.map((event, i) => (
              <PersonCard
                key={`${kind}-${event.year}-${i}`}
                event={event}
                index={i}
                accent={meta.cardAccent}
              />
            ))
          : events.map((event, i) => (
              <EventCard
                key={`${kind}-${event.year}-${i}`}
                event={event}
                index={i}
                accent={meta.cardAccent}
              />
            ))}
      </div>
    </section>
  )
}

// ── Root ────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="border-2 border-border bg-secondary-background p-6 shadow-shadow">
      <p className="font-heading text-xl font-black uppercase">
        Ainda não encontramos registros para esta data.
      </p>
      <p className="mt-2 max-w-xl font-base text-sm leading-relaxed text-muted-foreground">
        A Wikipedia pt-BR pode não ter dados suficientes para esse dia no momento. Tente outra data
        ou volte mais tarde, porque a base pública é atualizada continuamente.
      </p>
    </div>
  )
}

export function DayResults({ result, params }: DayResultsProps) {
  const hasResults =
    result.exactDayEvents.length > 0 ||
    result.events.length > 0 ||
    result.births.length > 0 ||
    result.deaths.length > 0

  return (
    <section id="resultado" className="scroll-mt-24 space-y-12">
      {/* Date heading */}
      <div className="flex flex-col gap-3">
        <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Resultados para
        </p>
        <h2 className="font-heading text-4xl font-black uppercase leading-none md:text-6xl">
          {params.display}
        </h2>
        <div className="h-1.5 w-20 bg-main border-2 border-border" />
        <p className="max-w-2xl font-base text-sm leading-relaxed text-muted-foreground">
          Dados públicos da Wikipedia pt-BR. Cada card mantém o link da fonte quando a página
          correspondente está disponível.
        </p>
      </div>

      {/* Sections */}
      {hasResults ? (
        <div className="space-y-14">
          <ExactDaySection events={result.exactDayEvents} year={params.year} />
          <Section kind="events" events={result.events} />
          <Section kind="births" events={result.births} />
          <Section kind="deaths" events={result.deaths} />
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  )
}
