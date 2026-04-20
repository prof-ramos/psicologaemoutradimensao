import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-base border-2 border-border px-2.5 py-0.5 text-[10px] font-heading font-black uppercase tracking-wider shadow-shadow transition-all',
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground',
        blue:    'bg-cosmic-blue text-foreground',
        pink:    'bg-vibrant-pink text-foreground',
        orange:  'bg-electric-orange text-foreground',
        subtle:  'bg-secondary-background text-muted-foreground shadow-sm',
        outline: 'bg-transparent text-foreground shadow-none',
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
