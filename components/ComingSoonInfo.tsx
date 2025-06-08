import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

interface ComingSoonInfoProps{
    text?: string
}

export default function ComingSoonInfo(props: ComingSoonInfoProps) {
  return (
    <HoverCard>
        <HoverCardTrigger className='hover:cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground hover:text-accent-foreground/50"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
        </HoverCardTrigger>
        <HoverCardContent className='text-foreground'>
            {props.text || "We're working on this feature — stay tuned for the next update!"}
        </HoverCardContent>
    </HoverCard>
  )
}
