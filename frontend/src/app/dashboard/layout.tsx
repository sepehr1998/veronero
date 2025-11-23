'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../globals.css'
import FloatingChat from "@/app/dashboard/chat/FloatingChat"
import { motion } from 'framer-motion'
import DashboardNavbar from "@/app/dashboard/navbar/DashboardNavbar";
import DashboardAuthGuard from "@/app/dashboard/auth/AuthGuard";
import AuthSessionSync from "@/components/AuthSessionSync";
import {
    Home,
    BarChart3,
    MessageSquare,
    CalendarDays,
    CreditCard,
    Sparkles,
} from 'lucide-react'

const navItems = [
    { name: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Analysis', href: '/dashboard/tax-analysis', icon: <BarChart3 className="w-5 h-5 mr-2" /> },
    { name: 'AI Chat', href: '/dashboard/chat', icon: <MessageSquare className="w-5 h-5 mr-2" /> },
    { name: 'Calendar', href: '/dashboard/calendar', icon: <CalendarDays className="w-5 h-5 mr-2" /> },
    { name: 'Expense Manager', href: '/dashboard/expenses', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { name: 'Tax Optimizer', href: '/dashboard/tax-optimizer', icon: <Sparkles className="w-5 h-5 mr-2" /> },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <html>
        <head>
            <title>Dashboard</title>
        </head>
        <body className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <AuthSessionSync />
        <DashboardAuthGuard>
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-[var(--color-border)] shadow-sm">
                <DashboardNavbar />
            </div>

            {/* Layout wrapper */}
            <div className="pt-16 flex">
                {/* Sidebar */}
                <aside
                    className="
                    fixed top-16 left-0
                    w-72 h-[calc(100vh-4rem)]
                    bg-[var(--color-card)]
                    py-8
                    border-r border-[var(--color-border)]
                    shadow-lg
                    flex flex-col
                "
                >
                    <nav className="flex flex-col space-y-2 relative">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href

                            return (
                                <Link key={item.href} href={item.href} className="relative">
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className="absolute inset-0 bg-[var(--color-primary)] z-0"
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <div
                                        className={`
                                        relative z-10 flex items-center
                                        px-10 py-5
                                        border-b-1 border-border
                                        font-semibold transition
                                        ${isActive
                                        ? 'text-white'
                                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white'}
                                    `}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="absolute bottom-0 w-full p-6">

                    </div>

                    <footer className="mt-auto text-sm text-[var(--color-text-secondary)] select-none text-center">
                        <div className="bg-rg-background rounded-lg mx-6 mb-10 p-4">
                            <p className="text-sm font-medium text-primary">Need help?</p>
                            <p className="text-xs text-gray-600 mt-1">
                                Contact our support team for any sort of assistance.
                            </p>
                            <button className="mt-3 w-full py-2 bg-primary hover:bg-primary-hover text-white text-sm rounded-md transition-colors cursor-pointer">
                                Contact Support
                            </button>
                        </div>
                        &copy; 2025 VeroNero
                    </footer>
                </aside>

                {/* Main Content */}
                <main className="ml-72 flex-1 min-h-screen overflow-auto p-6">
                    {children}
                    <FloatingChat />
                </main>
            </div>
        </DashboardAuthGuard>
        </body>
        </html>
    )
}
