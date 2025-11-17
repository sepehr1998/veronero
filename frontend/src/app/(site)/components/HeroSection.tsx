import Pattern from "@/app/(site)/components/Pattern";

export default function HeroSection() {
    return (
        <section className="relative isolate overflow-hidden bg-background text-primary">
            <Pattern>
                <div className="px-6 md:px-12 text-center z-20">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                        <span className="bg-gradient-to-r from-[var(--color-primary)] via-[white] to-[var(--color-primary)] bg-clip-text text-transparent animate-gradient-x">
                        Smarter Taxes. Less Stress. <br className="hidden md:inline-block" />
                        More Money in Your Pocket.
                      </span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-white max-w-3xl mx-auto">
                        VeroNero is your personal AI tax assistant — built for individuals, freelancers, and small businesses in Finland.
                        From deductions to deadlines, we’ve got your back.
                    </p>

                    <div className="mt-10 flex justify-center gap-4 flex-wrap">
                        <a
                            href="#pricing"
                            className="
    relative
    px-8 py-4
    text-white
    bg-primary
    rounded-xl
    text-lg font-extrabold
    tracking-wide
    uppercase
    shadow-[0_0_10px_rgba(59,130,246,0.8)]
    transition
    transform
    hover:scale-110
    hover:shadow-[0_0_30px_rgba(59,130,246,1)]
    focus:outline-none
    focus:ring-4
    focus:ring-primary/60
    animate-pulse-glow
    before:absolute
    before:inset-0
    before:rounded-xl
    before:bg-gradient-to-r
    before:from-[var(--color-primary)]
    before:via-[var(--color-primary-hover)]
    before:to-[var(--color-primary)]
    before:opacity-70
    before:blur-[12px]
    before:-z-10
  "
                            style={{
                                animationTimingFunction: 'ease-in-out',
                                animationDuration: '2.5s',
                                animationIterationCount: 'infinite',
                            }}
                        >
                            Start Free Trial
                        </a>

                        <a
                            href="#features"
                            className="flex items-center justify-center px-6 py-3 text-primary border bg-border border-border rounded-xl text-lg font-medium transition duration-200 hover:bg-card-alt shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/50"
                        >
                            Explore Features
                        </a>

                    </div>

                </div>
            </Pattern>
        </section>
    );
}
