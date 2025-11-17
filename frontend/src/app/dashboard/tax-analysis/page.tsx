'use client'

import React, { useState } from 'react'
import UploadForm from './UploadForm'
import ResultsDisplay from './ResultsDisplay'

export default function TaxAnalyzerPage() {
    const [suggestions, setSuggestions] = useState<string | null>(null)

    return (
        <div className="min-h-screen px-6 py-12 bg-background text-[var(--color-text-primary)]">
            <div className="max-w-4xl mx-auto space-y-10">
                <header className="text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">
                        Smart Tax Document Analyzer
                    </h1>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        Upload your official tax decision or tax card, and let our AI assistant review it for
                        possible actions, tips, or missing deductible suggestions.
                    </p>
                </header>

                <UploadForm onResult={setSuggestions} />

                {suggestions && <ResultsDisplay suggestions={suggestions} />}
            </div>
        </div>
    )
}
