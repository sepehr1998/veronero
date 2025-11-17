import HeroSection from "@/app/(site)/components/HeroSection";
import ValueHighlights from "@/app/(site)/components/ValueHighlights";
import StepsSection from "@/app/(site)/components/StepsSection";
import FeaturesSection from "@/app/(site)/components/FeaturesSection";
import DashboardPreview from "@/app/(site)/components/DashboardPreview";
import FinalCTA from "@/app/(site)/components/FinalCTA";
import TestimonialsSection from "@/app/(site)/components/TestimonialsSection";
import PricingSection from "@/app/(site)/components/PricingSection";
import DashboardOverlap from "@/app/(site)/components/DashboardOverlap";

export default function Home() {
    return (
        <main className="bg-[#e8d1ca] text-gray-900 font-sans selection:bg-blue-300 selection:text-white min-h-screen">

            <section className="mx-auto">
                <HeroSection />
            </section>
            <section className="relative z-20">
                <DashboardOverlap/>
            </section>

            <section className="mx-auto">
                <FeaturesSection />
            </section>

            <section className="mx-auto">
                <ValueHighlights />
            </section>

            <section className="mx-auto">
                <StepsSection />
            </section>


            <section className="mx-auto">
                <DashboardPreview />
            </section>

            <section className="mx-auto">
                <PricingSection />
            </section>

            <section className="mx-auto">
                <TestimonialsSection />
            </section>

            <section className="mx-auto">
                <FinalCTA />
            </section>

            <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm select-none">
                <p>© 2025 Vero Nero. All rights reserved.</p>
                <p className="mt-2">
                    <a href="#" className="hover:underline focus:underline">
                        Privacy Policy
                    </a>{" "}
                    |{" "}
                    <a href="#" className="hover:underline focus:underline">
                        Terms of Service
                    </a>
                </p>
            </footer>
        </main>
    );
}
