import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-none border-2 border-primary bg-background px-3 py-2 text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 font-mono shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    />
  )
}


export { Input }
