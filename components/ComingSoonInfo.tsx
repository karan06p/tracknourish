'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface ComingSoonInfoProps {
  text?: string
}

export default function ComingSoonInfo(props: ComingSoonInfoProps) {
  const [open, setOpen] = useState(false)

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent-foreground hover:text-accent-foreground/50"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="16" y2="12" />
      <line x1="12" x2="12.01" y1="8" y2="8" />
    </svg>
  )

  return (
    <>
      {/* Desktop - HoverCard */}
      <div className="hidden md:block">
        <HoverCard>
          <HoverCardTrigger className="cursor-pointer">
            {icon}
          </HoverCardTrigger>
          <HoverCardContent className="text-foreground">
            {props.text || "We are working on this feature — stay tuned for the next update!"}
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Mobile - Dialog */}
      <div className="block md:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="hidden">Coming Soon</DialogTitle>
          <DialogTrigger asChild>
            <button onClick={() => setOpen(true)}>{icon}</button>
          </DialogTrigger>
          <DialogContent className="text-foreground text-sm text-center">
            {props.text || "We are working on this feature — stay tuned for the next update!"}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
