import type { Metadata } from "next";
import "../globals.css";
import React from "react";
import Header from "./components/Header";
import AuthSessionSync from "@/components/AuthSessionSync";

export const metadata: Metadata = {
    title: "Vero Nero",
    description: "Your AI financial co-pilot",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
            <AuthSessionSync />
            <Header />
            <main>{children}</main>
        </body>
        </html>
    );
}
