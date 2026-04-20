import sanitizeHtml from 'sanitize-html'
import { cn } from '@/lib/utils'

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
      img: ['src', 'alt', 'width', 'height', 'class'],
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
