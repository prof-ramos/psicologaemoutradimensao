import { cn } from '@/lib/utils'
import sanitizeHtml from 'sanitize-html'

interface BlogPostContentProps {
  content: string
  className?: string
}

export function BlogPostContent({ content, className }: BlogPostContentProps) {
  const clean = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: [...(sanitizeHtml.defaults.allowedAttributes.a ?? []), 'rel'],
      img: ['src', 'alt', 'width', 'height', 'class', 'srcset', 'sizes', 'loading'],
      '*': ['class'],
    },
  })

  return (
    <div
      className={cn('prose prose-lg max-w-none font-base', className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
