"use client";

const features = [
    {
        title: "Tax Card Analyzer",
        description:
            "Understand and optimize your Finnish tax card with ease and confidence.",
        icon: "📄",
    },
    {
        title: "Deductions Finder",
        description:
            "Instantly see which deductions you're eligible for — no guesswork.",
        icon: "💰",
    },
    {
        title: "Income Simulator",
        description:
            "Visualize how different income levels affect your tax rate and return.",
        icon: "📈",
    },
    {
        title: "Life Event Wizard",
        description:
            "See how major life changes impact your tax situation before they happen.",
        icon: "🔍",
    },
    {
        title: "Expense Manager",
        description:
            "Track, organize, and stores expenses — auto-prepped for deductions.",
        icon: "🧾",
    },
    {
        title: "Smart Tax Dashboard",
        description:
            "Everything you need in one place — income, deadlines, insights, and more.",
        icon: "📊",
    },
];

export default function FeaturesSection() {
    return (
        <section className="bg-[#e8d1ca] py-20 text-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                        Powerful Features Built for You
                    </h2>
                    <p className="text-[#ba745f] mt-4 max-w-2xl mx-auto">
                        VeroNero handles the complexity of Finnish taxes so you don’t have to.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl p-[2px] bg-gradient-to-tr from-[#C99383] via-[#ba745f] to-[#d8b2a7] hover:scale-[1.05] transition-transform duration-500 shadow-md"
                        >
                            {/* Inner card with inset look */}
                            <div className="bg-[#1a1a1a] rounded-[16px] p-6 h-full shadow-inner border border-[#d8b2a7]">
                                <div className="text-5xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-[#e8d1ca]">
                                    {feature.title}
                                </h3>
                                <p className="text-[#d8b2a7] text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient animation for glowing bg */}
            <style jsx>{`
                @keyframes gradient-warm {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .animate-gradient-warm {
                    background: linear-gradient(
                            270deg,
                            #C99383,
                            #ba745f,
                            #e8d1ca,
                            #ba745f,
                            #C99383
                    );
                    background-size: 600% 600%;
                    animation: gradient-warm 7s ease infinite;
                }
            `}</style>
        </section>
    );
}
