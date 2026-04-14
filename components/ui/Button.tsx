'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    // Vanilla CSS integration via utility-like approach or just CSS classes
    // Here we'll use base classes that we'll define in a companion CSS module if needed,
    // but for now, we'll use standard classes and expect styles in globals.css or local modules.
    
    return (
      <Comp
        className={cn(
          'btn', // Shared base class
          `btn-${variant}`,
          `btn-${size}`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, cn }
