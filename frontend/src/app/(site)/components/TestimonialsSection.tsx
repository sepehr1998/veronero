import Image from "next/image";

const testimonials = [
    {
        name: "Marko",
        location: "Helsinki, Finland",
        quote:
            "VeroNero made tax season a breeze. I saved more than I expected and felt confident all along!",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Laura",
        location: "Tampere, Finland",
        quote:
            "As a freelancer, tracking deductions was a nightmare — until I found VeroNero. Now I know exactly what I can claim.",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        name: "Jussi",
        location: "Oulu, Finland",
        quote:
            "The life event wizard is a game changer! It helped me plan my family’s finances with clarity.",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
];
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`h-5 w-5 fill-current ${
                        i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.757 4.635 1.123 6.545z" />
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="bg-card-alt py-20 text-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                    What Our Users Say
                </h2>
                <div className="grid gap-10 md:grid-cols-3">
                    {testimonials.map(({ name, location, quote, rating, avatar }, i) => (
                        <div
                            key={i}
                            className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col items-center text-center"
                        >
                            <Image
                                src={avatar}
                                alt={`${name} avatar`}
                                width={100}
                                height={100}
                                className="rounded-full mb-4 object-cover"
                            />
                            <StarRating rating={rating} />
                            <p className="mt-4 text-text-secondary italic">`&quot{quote}`&quot</p>
                            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                                <span>{name}</span>
                                <span className="text-text-secondary">{location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
