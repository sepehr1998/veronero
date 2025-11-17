'use client'
import { motion } from "framer-motion";

interface Props {
    title: string,
    price: string,
    features: string[]
}

export function PricingPlan({ title, price, features }: Props) {
    return (
        <motion.div
            className="border border-gray-300 rounded-xl p-8 shadow-md hover:shadow-lg transition cursor-pointer"
            whileHover={{ scale: 1.05 }}
            tabIndex={0}
            role="region"
            aria-label={`${title} pricing plan`}
        >
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>
            <p className="text-gray-700 mb-6 text-lg">{price}</p>
            <ul className="mb-6 text-left list-disc list-inside space-y-2 text-gray-600">
                {features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition">
                Choose {title}
            </button>
        </motion.div>
    );
}