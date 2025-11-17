'use client'
import { motion } from "framer-motion";

interface Props {
    name: string,
    role: string,
    quote: string
}

export function Testimonial({ name, role, quote }: Props) {
    return (
        <motion.blockquote
            className="bg-gray-100 p-8 rounded-xl shadow-md select-text"
            whileHover={{ scale: 1.03 }}
            tabIndex={0}
            aria-label={`Testimonial from ${name}, ${role}`}
        >
            <p className="mb-6 italic text-gray-900 leading-relaxed">“{quote}”</p>
            <footer className="text-sm font-semibold text-gray-700">
                — {name}, <span className="text-gray-500">{role}</span>
            </footer>
        </motion.blockquote>
    );
}