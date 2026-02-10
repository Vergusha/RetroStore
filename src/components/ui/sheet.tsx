"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Context
const SheetContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function Sheet({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    defaultOpen?: boolean
}) {
    // Basic context provider, duplicated from Dialog for simplicity
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const setOpen = React.useCallback((newOpen: boolean) => {
        if (onOpenChange) onOpenChange(newOpen)
        if (!isControlled) setUncontrolledOpen(newOpen)
    }, [onOpenChange, isControlled])

    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    )
}

function SheetTrigger({ children, asChild, className, ...props }: any) {
    const context = React.useContext(SheetContext)
    const handleClick = (e: any) => {
        // @ts-ignore
        props.onClick?.(e)
        context?.setOpen(true)
    }
  
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      return React.cloneElement(child, {
          ...props,
          ...child.props,
          className: cn(className, props.className, child.props.className),
          onClick: (e: any) => {
              handleClick(e)
              child.props.onClick?.(e)
          }
      })
    }
    return <button className={className} onClick={handleClick} {...props}>{children}</button>
}

const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
        const context = React.useContext(SheetContext)
        return (
            <button
                className={cn("cursor-pointer", className)}
                onClick={(e) => {
                    context?.setOpen(false)
                    props.onClick?.(e)
                }}
                ref={ref}
                {...props}
            />
        )
    }
)
SheetClose.displayName = "SheetClose"

const SheetPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>

const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
       // Overlay handled in Content usually, but mimicking structure
       <div className={cn("fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px]", className)} {...props} ref={ref} />
    )
)
SheetOverlay.displayName = "SheetOverlay"

const sheetVariants = cva(
    "fixed z-50 gap-4 bg-background p-6 shadow-[8px_0_0_0_rgba(0,0,0,1)] transition ease-in-out font-mono border-4 border-primary",
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b-4",
                bottom: "inset-x-0 bottom-0 border-t-4",
                left: "inset-y-0 left-0 h-full w-3/4 border-r-4 sm:max-w-sm",
                right: "inset-y-0 right-0 h-full w-3/4 border-l-4 sm:max-w-sm",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

interface SheetContentProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> { }

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
    ({ side = "right", className, children, ...props }, ref) => {
        const context = React.useContext(SheetContext)
        if (!context?.open) return null

        return createPortal(
            <div className="fixed inset-0 z-50 flex">
                <div 
                  className="fixed inset-0 bg-black/80 backdrop-blur-[2px]" 
                  onClick={() => context.setOpen(false)}
                />
                <div
                    ref={ref}
                    className={cn(sheetVariants({ side }), "ml-auto relative animate-in slide-in-from-right duration-300", className)}
                    {...props}
                >
                    <SheetClose className="absolute right-4 top-4 rounded-none bg-primary text-primary-foreground p-1 opacity-70 hover:opacity-100 focus:outline-none">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                    {children}
                </div>
            </div>,
            document.body
        )
    }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left border-b-2 border-primary/30 pb-4 mb-4",
            className
        )}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t-2 border-primary/30 mt-auto",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn("text-lg font-bold text-foreground uppercase tracking-widest", className)}
            {...props}
        />
    )
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
)
SheetDescription.displayName = "SheetDescription"

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
