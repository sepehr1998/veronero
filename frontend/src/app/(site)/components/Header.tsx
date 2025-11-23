'use client'

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { useUserStore } from "@/stores/user";
import { buildAuthLoginUrl } from "@/lib/auth";

export default function Header() {
    const router = useRouter();
    const { isAuthenticated } = useUserStore();

    const handleGetStarted = useCallback(() => {
        const dashboardUrl =
            typeof window !== 'undefined'
                ? `${window.location.origin}/dashboard`
                : '/dashboard';

        if (isAuthenticated) {
            router.push('/dashboard');
            return;
        }

        window.location.href = buildAuthLoginUrl(dashboardUrl);
    }, [isAuthenticated, router]);

    return (
        <header
            className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-lg px-6 py-3 flex justify-between items-center"
            style={{ background: "#1a1a1a" }}
        >
            <Link href="/" className="flex items-center space-x-2">
                <Image src={Logo} alt="Vero Nero logo" width={200} priority />
            </Link>

            <nav className="space-x-4 flex items-center text-white">
                <Link href="/#pricing">Features</Link>
                <Button onClick={handleGetStarted}>
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
            </nav>
        </header>
    );
}
