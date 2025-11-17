'use client'

import React from 'react'
import {
    Bell,
    LogOut,
    Settings,
    User,
    LayoutDashboard,
    HelpCircle,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { useUserStore } from "@/stores/user";

type Props = {
    user: {
        name: string
        email: string
        avatarUrl?: string
        role?: string
    }
}

export default function DashboardNavbar({ user }: Props) {
    const { clearUser } = useUserStore()
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="mx-auto px-4 py-3 relative">
                <div className="flex items-center justify-between w-full">
                    <Link href="/dashboard" className="shrink-0">
                        <Image
                            src={Logo}
                            alt="Vero Nero logo"
                            width={160}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>


                    {/* Notification & user menu right */}
                    <div className="flex items-center space-x-4 shrink-0">
                        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full transition">
                                    <Image
                                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="text-left hidden sm:block">
                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.role || 'User'}</p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                                    <span>My Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <HelpCircle className="w-4 h-4 text-gray-500" />
                                    <span>Help & Support</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                                    <LogOut className="w-4 h-4" />
                                    <button onClick={clearUser}>Logout</button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}
