import React from 'react';
import Image from "next/image";
import Dashboard from "@/assets/dashboard-new.png";

export function DashboardOverlap() {
    return (
        <div className="relative z-30 w-8/12 mx-auto -mt-30 px-4 sm:px-6 lg:px-8">
            <div className="transition-transform duration-500 hover:scale-[1.01] rounded-2xl shadow-2xl overflow-hidden border border-border">
                <Image
                    src={Dashboard}
                    alt="VeroNero Dashboard Preview"
                    className="w-full h-auto object-cover"
                />
            </div>
        </div>
    );
}

export default DashboardOverlap;