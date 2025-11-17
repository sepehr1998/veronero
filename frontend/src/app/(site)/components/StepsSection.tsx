const steps = [
    {
        title: "Sign Up in Minutes",
        description: "Create your account and answer a few simple questions to personalize your experience.",
        icon: "📝",
    },
    {
        title: "Connect Your Data",
        description: "Securely link your income sources, expenses, and tax card. We’ll keep everything safe and private.",
        icon: "🔗",
    },
    {
        title: "Get Smart Insights",
        description: "See real-time suggestions on deductions, tax scenarios, and how life events affect your taxes.",
        icon: "💡",
    },
    {
        title: "Stay Informed Year-Round",
        description: "Track everything from your personal dashboard — with reminders, tools, and updates along the way.",
        icon: "📆",
    },
];

export default function StepsSection() {
    return (
        <section className="bg-site-background py-20 text-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-[#ba745f]">
                    How VeroNero Works?
                </h2>
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="
                                bg-[#f9ece7] rounded-2xl p-8
                                border-2 border-[#c99383]/40
                                transition transform
                                hover:scale-[1.04]
                                hover:shadow-xl
                                relative overflow-hidden
                            "
                            style={{
                                boxShadow:
                                    "inset 5px 5px 12px #d8b2a7, inset -5px -5px 12px #fff",
                            }}
                        >
                            {/* Soft gradient glow accent */}
                            <div className="absolute inset-0 pointer-events-none z-0 rounded-2xl bg-gradient-to-br from-[#c99383]/10 via-transparent to-[#ba745f]/10"></div>

                            {/* Icon badge */}
                            <div
                                className="
                                    relative z-10
                                    w-14 h-14 rounded-full
                                    bg-[#C99383]
                                    flex items-center justify-center
                                    text-white text-3xl mb-6
                                    mx-auto
                                    shadow-lg
                                "
                            >
                                {step.icon}
                            </div>

                            <h3 className="relative z-10 text-xl font-semibold mb-3 text-[#1a1a1a]">
                                {step.title}
                            </h3>
                            <p className="relative z-10 text-[#ba745f] text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

