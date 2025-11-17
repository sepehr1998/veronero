'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { useUserStore } from "@/stores/user";

export default function Header() {
    const { isAuthenticated, setUser, user } = useUserStore();
    console.log(user);
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
                <Button asChild>
                    <Link href={isAuthenticated ? "/dashboard" : "/auth"}>
                        {isAuthenticated ? "Go to Dashboard" : "Sign Up / Login"}
                    </Link>
                </Button>
            </nav>
        </header>
    );
}
