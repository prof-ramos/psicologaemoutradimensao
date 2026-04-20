import Link from 'next/link'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { wisp } from '@/lib/wisp'
import { BlogPostCard } from '@/components/blog-post-card'
import { Button } from '@/components/ui/button'

export const revalidate = 3600

const TICKER_ITEMS = [
  '✦ NOVO POST TODA SEMANA',
  '🌙 SEM FILTRO, SEM CONSULTÓRIO',
  '✦ ASTROLOGIA POP',
  '🔮 HUMOR ÁCIDO',
  '✦ CAOS EMOCIONAL',
  '⚡ OUTRA DIMENSÃO',
  '✦ SE FOR PREVISÍVEL, REESCREVE',
]

export default async function HomePage() {
  const { posts } = await wisp.getPosts({ limit: 6 })

  return (
    <div>

      {/* ── Ticker ── */}
      <div className="overflow-hidden border-b-2 border-border bg-foreground py-2.5">
        <div className="animate-marquee flex gap-14 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-heading text-xs font-bold tracking-widest text-background uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="border-b-2 border-border bg-main px-4 py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">

            {/* Left — headline + CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div>
                <span className="inline-flex items-center gap-2 border-2 border-border bg-foreground px-3 py-1">
                  <Star className="h-3 w-3 fill-main text-main" />
                  <span className="font-heading text-xs font-black tracking-widest text-background uppercase">
                    Coluna pessoal
                  </span>
                </span>
              </div>

              <h1 className="font-heading font-black uppercase leading-[0.88] tracking-tight text-[3.25rem] md:text-[5rem]">
                Psicóloga<br />
                Em{' '}
                <span className="inline-block border-2 border-border bg-vibrant-pink px-2 leading-tight">
                  Outra
                </span>{' '}
                Dimensão
              </h1>

              <p className="font-base text-base md:text-lg max-w-sm leading-relaxed text-foreground/80">
                Astrologia pop, humor ácido e observações sinceras sobre caos emocional, rotina e internet.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button asChild size="lg">
                  <Link href="/blog">
                    <Sparkles className="h-4 w-4" />
                    Ler os posts
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contato">
                    @Gayaliz_
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right — bento cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 content-start">

              {/* Manifesto */}
              <div className="col-span-2 border-2 border-border bg-foreground p-5 shadow-shadow">
                <p className="font-heading text-xs font-black tracking-widest text-main uppercase mb-2">
                  Sem filtro
                </p>
                <p className="font-heading text-xl font-black text-background uppercase leading-tight">
                  Sem consultório
                </p>
                <p className="mt-2 font-base text-sm leading-relaxed text-background/70">
                  Persona, ironia e texto direto. É crônica de internet com mapa astral no bolso.
                </p>
              </div>

              {/* Tom */}
              <div className="border-2 border-border bg-vibrant-pink p-4 shadow-shadow">
                <p className="font-heading text-xs font-black tracking-widest uppercase text-foreground/60 mb-1">
                  Tom
                </p>
                <p className="font-heading text-lg font-black uppercase">Irreverente</p>
              </div>

              {/* Formato */}
              <div className="border-2 border-border bg-cosmic-blue p-4 shadow-shadow">
                <p className="font-heading text-xs font-black tracking-widest uppercase text-foreground/60 mb-1">
                  Formato
                </p>
                <p className="font-heading text-lg font-black uppercase">Texto curto</p>
              </div>

              {/* Regra */}
              <div className="col-span-2 border-2 border-border bg-background p-4">
                <p className="font-heading text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
                  Regra da casa
                </p>
                <p className="font-base text-sm italic text-foreground">
                  "Se for previsível, reescreve. Se for pasteurizado, corta."
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Posts recentes ── */}
      <div className="px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-8">

          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-3xl font-black uppercase">Posts recentes</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="font-base text-muted-foreground">Em breve...</p>
          )}

        </div>
      </div>

    </div>
  )
}
