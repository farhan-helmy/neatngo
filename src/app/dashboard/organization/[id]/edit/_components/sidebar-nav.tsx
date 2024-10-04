"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "sonner"

export function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            <Link
                href={"/dashboard/organization/" + pathname?.split("/")[3] + "/edit"}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname?.startsWith("/dashboard/organization/") && pathname?.endsWith("/edit")
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-transparent hover:underline",
                    "justify-start"
                )}
            >
                General
            </Link>
        </nav>
    )
}