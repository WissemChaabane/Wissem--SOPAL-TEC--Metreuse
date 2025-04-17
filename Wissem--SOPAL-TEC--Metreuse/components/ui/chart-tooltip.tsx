"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("absolute rounded-lg border bg-background p-2 shadow-md", className)} {...props} />
  )
})
ChartTooltip.displayName = "ChartTooltip"

export { ChartTooltip }
