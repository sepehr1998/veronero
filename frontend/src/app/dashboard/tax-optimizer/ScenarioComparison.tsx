'use client'

import React from 'react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

export default function ScenarioComparison({ scenarios }) {
    if (!scenarios || scenarios.length === 0) return null

    const chartData = scenarios.map(s => {
        const totalIncome = s.income + s.sideIncome + s.capitalGains
        const totalDeductions = s.contribution + s.mortgageInterest + s.workExpenses + s.travelDeductions + s.donations
        const netIncome = totalIncome - totalDeductions
        const taxRate = Number(((totalDeductions / totalIncome) * 100).toFixed(1))

        return {
            name: s.name,
            'Total Income': totalIncome,
            'Deductions': totalDeductions,
            'Net Income': netIncome,
            'Tax Rate (%)': taxRate
        }
    })

    return (
        <div className="mt-10">
            {/* Bar Chart */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-border">
                <h3 className="text-xl font-bold mb-4">Scenario Comparison - Bar Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Total Income" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Deductions" fill="#F97316" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Net Income" fill="#22C55E" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
