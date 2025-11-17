const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for individuals managing their personal taxes.",
        features: [
            "Tax card analysis",
            "Deductions check",
            "Tax calendar reminders",
        ],
        popular: false,
    },
    {
        name: "Pro",
        price: "€9.90/mo",
        description: "Great for freelancers with dynamic income and expenses.",
        features: [
            "Everything in Starter",
            "Income simulator",
            "Life event wizard",
            "Export reports",
        ],
        popular: true,
    },
    {
        name: "Business",
        price: "€19.90/mo",
        description: "For small business owners and multi-profile managers.",
        features: [
            "Everything in Pro",
            "Expense manager",
            "Comprehensive dashboard",
            "Multi-profile support",
        ],
        popular: false,
    },
];

export default function PricingSection() {
    return (
        <section className="bg-[#e8d1ca] py-20 text-[#ba745f]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-[#ba745f] mb-12">
                    Start for free. Upgrade when you are ready — cancel anytime.
                </p>

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan, index) => {
                        const isPopular = plan.popular;

                        return (
                            <div
                                key={index}
                                className={`relative flex flex-col justify-between rounded-2xl p-8 transition-transform duration-300 ${
                                    isPopular
                                        ? "bg-[#1a1a1a] text-[#e8d1ca] border-2 border-[#ba745f] shadow-xl scale-[1.03]"
                                        : "bg-[#f9ece7] text-[#1a1a1a] border border-[#C99383]/30 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                }`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="inline-block text-sm font-medium text-white bg-[#ba745f] px-3 py-1 rounded-full shadow-md">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <p className="text-2xl font-semibold mt-2">{plan.price}</p>
                                    <p
                                        className={`mt-2 mb-6 ${
                                            isPopular
                                                ? "text-[#d8b2a7]"
                                                : "text-[#ba745f]/80"
                                        }`}
                                    >
                                        {plan.description}
                                    </p>

                                    <ul
                                        className={`text-left space-y-3 mb-6 ${
                                            isPopular ? "text-[#e8d1ca]" : "text-[#1a1a1a]"
                                        }`}
                                    >
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span
                                                    className={`text-lg ${
                                                        isPopular ? "text-[#C99383]" : "text-[#ba745f]"
                                                    }`}
                                                >
                                                    ✓
                                                </span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <a
                                    href="#"
                                    className={`mt-4 inline-block w-full text-center px-4 py-2 font-medium rounded-xl transition ${
                                        isPopular
                                            ? "bg-[#C99383] text-white hover:bg-[#ba745f]"
                                            : "bg-[#ba745f] text-white hover:bg-[#a35d4c]"
                                    }`}
                                >
                                    {plan.price === "Free" ? "Get Started" : "Start Free Trial"}
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
