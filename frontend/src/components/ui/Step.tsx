'use client'
import { motion } from "framer-motion";

interface Props {
    number: number;
    text: string;
    title: string
}

export function Step({ number, text, title }: Props) {
    return (
        <motion.li
            className="
        bg-white rounded-xl p-8 shadow-md
        flex flex-col items-center justify-center
        w-full sm:w-[300px] md:w-[260px]
      "
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            tabIndex={0}
            aria-label={`Step ${number}`}
        >
            <div className="text-blue-600 text-4xl font-extrabold mb-4 select-none">{number}</div>
            <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
            <p className="text-gray-700 font-medium text-center">{text}</p>
        </motion.li>
    );
}
