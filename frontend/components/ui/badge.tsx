import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-teal-500/15 to-purple-500/15 border border-teal-500/25 text-teal-400",
                success:
                    "bg-green-500/15 border border-green-500/25 text-green-400",
                warning:
                    "bg-yellow-500/15 border border-yellow-500/25 text-yellow-400",
                danger:
                    "bg-red-500/15 border border-red-500/25 text-red-400",
                outline:
                    "border border-gray-600 text-gray-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
