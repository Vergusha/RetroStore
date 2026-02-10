import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border-2 px-2.5 py-0.5 text-xs font-bold uppercase w-fit whitespace-nowrap shrink-0 transition-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
  {
    variants: {
      variant: {
        default:
          "border-primary-foreground bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  // Removed Radix Slot support for simplification, just render span
  const Comp = "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
