import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] font-heading font-semibold uppercase tracking-[0.14em]',
  {
    variants: {
      variant: {
        default: 'border-border/10 bg-main/55 text-foreground',
        blue:    'border-border/10 bg-cosmic-blue/60 text-foreground',
        pink:    'border-border/10 bg-vibrant-pink/60 text-foreground',
        orange:  'border-border/10 bg-electric-orange/60 text-foreground',
        sky:     'border-sky-200 bg-sky-50 text-sky-900',
        rose:    'border-rose-200 bg-rose-50 text-rose-900',
        amber:   'border-amber-200 bg-amber-50 text-amber-900',
        stone:   'border-stone-200 bg-stone-100 text-stone-800',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
