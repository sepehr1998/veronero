export default function DashboardPreview() {
    return (
        <section className="py-20 bg-card-alt text-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Your Tax Universe. Organized.
                </h2>
                <p className="text-[#ba745f] max-w-2xl mx-auto mb-12">
                    VeroNero’s intuitive dashboard brings your income, deductions, and tax events together — so you can focus on what matters.
                </p>

                <div className="relative max-w-5xl mx-auto mb-12 group">
                    {/* Outer gradient border */}
                    <div className="absolute -inset-1 rounded-[24px] bg-gradient-to-tr from-[#C99383] via-[#ba745f] to-[#d8b2a7] z-0"></div>

                    <div className="relative z-10 rounded-[22px] overflow-hidden bg-[#1a1a1a] p-2 shadow-2xl">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto rounded-xl"
                        >
                            <source src="demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                <a
                    // href="https://demo.veronero.fi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
            inline-block px-6 py-3
            bg-[#ba745f] hover:bg-[#C99383]
            text-white font-medium
            rounded-xl transition
            shadow-md hover:shadow-lg
          "
                >
                    Try Demo Dashboard
                </a>
            </div>
        </section>
    );
}
