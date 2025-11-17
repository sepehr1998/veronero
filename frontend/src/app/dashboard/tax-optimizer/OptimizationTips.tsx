'use client'

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function OptimizationTips({ currentData, scenarios = [], showScenarioSelector = false }) {
    // When dropdown enabled, let user pick scenario by name; default to first scenario if any
    const [selectedScenarioName, setSelectedScenarioName] = useState(
        scenarios.length > 0 ? scenarios[0].name : null
    )

    // Selected data to show tips for
    const dataToUse = showScenarioSelector
        ? scenarios.find(s => s.name === selectedScenarioName) || null
        : currentData

    // Example function to generate tips based on data
    function generateTips(data) {
        if (!data) return ['No data available for tips.']

        const tips = []

        if (data.income > 100000) tips.push('Consider maximizing retirement contributions to reduce taxable income.')
        if (data.mortgageInterest > 0) tips.push('Make sure to claim full mortgage interest deductions.')
        if (data.donations > 0) tips.push('Donations can provide tax credits; keep receipts.')
        if (data.travelDeductions > 0) tips.push('Verify travel deductions align with allowable limits.')
        if (data.sideIncome > 0) tips.push('Declare all side income to avoid penalties.')
        if (data.workExpenses > 0) tips.push('Track work expenses carefully for deductions.')

        if (tips.length === 0) tips.push('No specific optimization tips found for your data.')

        return tips
    }

    const tips = generateTips(dataToUse)

    return (
        <section className="mt-6 p-4 border border-[var(--color-border)] rounded bg-[var(--color-card)]">
            <h3 className="text-xl font-semibold mb-3">Optimization Tips</h3>

            {showScenarioSelector && scenarios.length > 0 && (
                <div className="mb-4 max-w-xs">
                    <Select
                        value={selectedScenarioName}
                        onValueChange={(val) => setSelectedScenarioName(val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select scenario" />
                        </SelectTrigger>
                        <SelectContent>
                            {scenarios.map((s) => (
                                <SelectItem key={s.name} value={s.name}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <ul className="list-disc list-inside space-y-1 text-[var(--color-text-primary)]">
                {tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                ))}
            </ul>
        </section>
    )
}
