import React from 'react'

interface ResultsDisplayProps {
    suggestions: string
}

interface Category {
    title: string
    content: string[] // lines under this category
}

export default function ResultsDisplay({ suggestions }: ResultsDisplayProps) {
    if (!suggestions) {
        return (
            <p className="text-[var(--color-primary)] text-center italic mt-6">
                No suggestions available.
            </p>
        )
    }

    // Parse suggestions into categories
    const lines = suggestions.split('\n').map(line => line.trim()).filter(Boolean)

    const categories: Category[] = []
    let currentCategory: Category | null = null

    lines.forEach(line => {
        if (line.endsWith(':')) {
            // Start new category
            currentCategory = { title: line, content: [] }
            categories.push(currentCategory)
        } else {
            // Add line to current category if exists, else create default category
            if (!currentCategory) {
                currentCategory = { title: 'General', content: [] }
                categories.push(currentCategory)
            }
            currentCategory.content.push(line)
        }
    })

    return (
        <section className="max-w-4xl mx-auto mt-8 space-y-8">
            {categories.map(({ title, content }, idx) => (
                <article
                    key={idx}
                    className="bg-card rounded-2xl shadow-lg border border-border p-8 transition hover:shadow-2xl">
                    <h3
                        className="text-2xl font-bold mb-6 pb-2 text-primary select-none"
                    >
                        {title}
                    </h3>

                    <div className="space-y-5">
                        {content.map((line, i) => {
                            if (line.startsWith('-')) {
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center bg-card rounded-lg px-5 py-4 shadow-md border border-border">
                                        <div className="inline-block m-5 w-5 h-5 max-h-5 rounded-full bg-gray-200 shadow">&#8203;</div>
                                        <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                            {line.slice(1).trim()}
                                        </p>
                                    </div>
                                )
                            }

                            return (
                                <p
                                    key={i}
                                    className="
                    text-[var(--color-text-primary)]
                    leading-relaxed
                    bg-card
                    rounded-lg
                    px-5 py-4
                    shadow-sm
                    border border-[var(--color-border)]
                  "
                                >
                                    {line}
                                </p>
                            )
                        })}
                    </div>
                </article>
            ))}
        </section>
    )
}
