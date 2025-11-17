'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

export default function ScenarioComparisonTable({ scenarios }) {
    if (!scenarios || scenarios.length === 0) return null

    return (
        <div className="mt-8 bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Scenario</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Income</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Deductions</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Net Income</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Tax Rate</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">% of Gross Kept</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {scenarios.map((s, idx) => {
                    const totalIncome = s.income + s.sideIncome + s.capitalGains
                    const totalDeductions = s.contribution + s.mortgageInterest + s.workExpenses + s.travelDeductions + s.donations
                    const netIncome = totalIncome - totalDeductions
                    const taxRate = ((totalDeductions / totalIncome) * 100).toFixed(1)
                    const percentKept = ((netIncome / totalIncome) * 100).toFixed(1)

                    return (
                        <tr
                            key={s.name}
                            className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                        >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                            <td className="px-6 py-4 text-sm text-right">€{totalIncome.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-right text-orange-600">€{totalDeductions.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-right text-green-600">€{netIncome.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-right">
                                <Badge className="bg-blue-100 text-blue-800">{taxRate}%</Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-right">
                                <Badge className="bg-green-100 text-green-800">{percentKept}%</Badge>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}
