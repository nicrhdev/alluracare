// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100",
        className
      )}
      style={{
        backgroundSize: "200% 100%",
      }}
      {...props}
    />
  )
}

export { Skeleton }