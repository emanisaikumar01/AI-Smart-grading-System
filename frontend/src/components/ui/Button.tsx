import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'link' | 'danger', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow-glow hover:shadow-[0_0_5px_#2563eb,0_0_25px_#2563eb,0_0_55px_rgba(37,99,235,0.65)]": variant === "default",
            "border border-primary/70 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-glow": variant === "outline",
            "text-muted-foreground hover:bg-primary/10 hover:text-primary": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "danger",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
