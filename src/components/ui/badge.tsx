// src/components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary text-white",
        secondary:
          "border-transparent bg-brand-secondary text-text-primary",
        soft:
          "border-transparent bg-brand-pale-rose text-brand-primary",
        gold:
          "border-transparent bg-brand-gold text-white",
        mint:
          "border-transparent bg-brand-mint text-text-primary",
        lavender:
          "border-transparent bg-brand-accent text-white",
        success:
          "border-transparent bg-success text-white",
        error:
          "border-transparent bg-error text-white",
        warning:
          "border-transparent bg-warning text-text-primary",
        outline:
          "text-foreground border-brand-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }