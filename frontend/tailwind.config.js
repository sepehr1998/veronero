/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#f9fafb",
                card: "#ffffff",
                cardAlt: "#f3f4f6",
                primary: "#6366f1",
                primaryHover: "#4f46e5",
                border: "#e5e7eb",
                textPrimary: "#111827",
                textSecondary: "#6b7280",
                error: "#ef4444",
                success: "#10b981",
            },
        },
    },
    plugins: [],
};
