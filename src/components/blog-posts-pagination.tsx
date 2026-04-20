'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Pagination {
  page: number
  totalPosts: number
  limit: number
}

export function BlogPostsPagination({ pagination }: { pagination: Pagination }) {
  const { page, totalPosts, limit } = pagination
  const totalPages = limit > 0 ? Math.ceil(totalPosts / limit) : 0
  const hasPrev = page > 1
  const hasNext = page < totalPages
  const searchParams = useSearchParams()

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(targetPage))
    return `/blog?${params.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Blog posts pagination" className="flex items-center justify-between pt-8">
      {hasPrev ? (
        <Button asChild variant="outline">
          <Link href={buildHref(page - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Anterior
          </Link>
        </Button>
      ) : (
        <div />
      )}
      <span className="font-heading text-sm font-bold">
        {page} / {totalPages}
      </span>
      {hasNext ? (
        <Button asChild variant="outline">
          <Link href={buildHref(page + 1)}>
            Próxima
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </nav>
  )
}
