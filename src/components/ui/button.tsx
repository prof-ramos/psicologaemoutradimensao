'use client'

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius-base)+0.125rem)] border border-border/15 text-sm font-heading font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-main text-main-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:shadow-shadow',
        outline:
          'bg-surface text-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-muted/70 hover:shadow-shadow',
        ghost: 'border-transparent bg-transparent shadow-none hover:bg-muted/80',
        hero:
          'bg-foreground text-background shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-foreground/92 hover:shadow-shadow',
      },
      size: {
        default: 'h-11 px-4 py-2.5',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-6 text-sm tracking-[0.01em]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        type={asChild ? type : (type ?? 'button')}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
