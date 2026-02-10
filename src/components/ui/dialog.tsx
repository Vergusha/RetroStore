import * as React from "react"
import { createPortal } from "react-dom"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"


// Custom Dialog Context to replace Radix
const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function Dialog({
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
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
  }, [onOpenChange, isControlled])

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}


function DialogTrigger({
  children,
  asChild,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const context = React.useContext(DialogContext)

  const handleClick = (e: React.MouseEvent) => {
    props.onClick?.(e as any)
    context?.setOpen(true)
  }

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      className: cn(className, child.props.className),
      onClick: (e: React.MouseEvent) => {
        handleClick(e)
        child.props.onClick?.(e)
      }
    })
  }


  return (
    <button
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DialogClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(DialogContext)

  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={(e) => {
        context?.setOpen(false)
        props.onClick?.(e)
      }}
      {...props}
    />
  )
}

function DialogOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} style={{ display: 'none' }} />
}



function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  const context = React.useContext(DialogContext)

  if (!context?.open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center font-mono">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-[2px] transition-all"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-lg border-[4px] border-primary bg-background p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="absolute right-4 top-4 rounded-none border-2 border-primary bg-background p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-primary hover:text-primary-foreground focus:outline-none disabled:pointer-events-none">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </div>
    </div>,
    document.body
  )
}


function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left border-b-2 border-primary/30 pb-4 mb-4",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t-2 border-primary/30 mt-4",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-bold leading-none tracking-tight text-primary uppercase",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground font-mono", className)}
      {...props}
    />
  )
}


export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
