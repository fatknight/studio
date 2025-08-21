
import * as React from "react"
import { cn } from "@/lib/utils"

export const PrayingHandsIcon = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
    <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(className)}
        {...props}
    >
        <path d="M18 10h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" />
        <path d="M6 10H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1Z" />
        <path d="M12 10l3.5 3.5" />
        <path d="M12 10 8.5 3.5" />
        <path d="M12 10l-3.5 3.5" />
        <path d="M12 10l3.5-6.5" />
    </svg>
));
PrayingHandsIcon.displayName = "PrayingHandsIcon";
