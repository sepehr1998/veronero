const values = [
    {
        title: "Maximize Your Refunds",
        description: "Never miss a deduction again — VeroNero finds what others miss.",
        icon: "💸",
    },
    {
        title: "Plan with Confidence",
        description: "Understand your tax future — before life changes happen.",
        icon: "📅",
    },
    {
        title: "Stress-Free Tax Season",
        description: "We track deadlines, simulate scenarios, and remind you when it matters.",
        icon: "😌",
    },
    {
        title: "Built for Finland",
        description: "From verokortti to veroilmoitus — everything is tailored for Finnish tax law.",
        icon: "🇫🇮",
    },
];

export default function ValueHighlights() {
    return (
        <section className="bg-card-alt py-20 text-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#1a1a1a]">
                    Why VeroNero?
                </h2>
                <p className="text-[#ba745f] max-w-2xl mx-auto mb-12">
                    Powerful features are great — but these are the real-world benefits our users love most.
                </p>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((item, index) => (
                        <div
                            key={index}
                            className="
                                relative rounded-2xl p-6 bg-[#1a1a1a]
                                border border-transparent
                                transition
                                shadow-md
                                hover:shadow-lg hover:border-gradient
                                hover:-translate-y-1 hover:scale-[1.03]
              "
                        >
                            <div className="relative mb-4 w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-5xl">
                                <span className="relative z-10">{item.icon}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[#e8d1ca]">{item.title}</h3>
                            <p className="text-[#d8b2a7] text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
