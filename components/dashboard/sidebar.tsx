"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Eye,
    LayoutDashboard,
    Image as ImageIcon,
    Globe,
    Users,
    Brain,
    Wrench,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
}

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Reverse Image",
        href: "/reverse-image",
        icon: ImageIcon,
    },
    {
        label: "Deep Search",
        href: "/scan-sites",
        icon: Globe,
    },
    {
        label: "Réseaux sociaux",
        href: "/social-scanner",
        icon: Users,
    },
    {
        label: "Rebriquement (IA)",
        href: "/ia-correlation",
        icon: Brain,
    },
    {
        label: "Outils PRO",
        href: "/outils-pro",
        icon: Wrench,
    },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-emerald-500/10 bg-black transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-between border-b border-emerald-500/10 px-4">
                <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                        <Eye className="h-4 w-4 text-black" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl tracking-tighter flex font-medium">
                            {/* Spy en Vert (Normal weight) */}
                            <span className="text-emerald-500">Spy</span>
                            
                            {/* OSINT en Jaune (Normal weight, Majuscules) */}
                            <span className="text-yellow-400 ml-0.5">
                                OSINT
                            </span>
                        </span>
                    )}
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="h-8 w-8 shrink-0 text-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Menu Section */}
            <nav className="flex-1 space-y-1 p-2 mt-4">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href)

                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 group",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-500 border-l-2 border-emerald-500"
                                    : "text-zinc-500 hover:bg-emerald-500/5 hover:text-emerald-400"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                isActive ? "text-emerald-500" : "group-hover:text-emerald-400"
                            )} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}