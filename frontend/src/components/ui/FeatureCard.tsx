'use client'
import { motion } from "framer-motion";

interface Props {
    icon: string,
    title: string,
    description: string
}

function FeatureCard({ icon, title, description }: Props) {
    return (
        <motion.div
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition cursor-default select-text"
            whileHover={{ scale: 1.05 }}
            tabIndex={0}
            role="group"
            aria-label={`${title} feature`}
        >
            <div
                aria-hidden="true"
                className="text-6xl mb-6 select-none"
            >
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
        </motion.div>
    );
}

export default FeatureCard;