'use client'

import React from 'react'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'
import { format } from 'date-fns'

const TaxRefundChart = ({ data }: { data: any[] }) => {
    return (
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Tax Refund Over Time
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                    <XAxis
                        dataKey="createdAt"
                        tickFormatter={(value) => format(new Date(value), 'MMMM yyyy')}
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                    />
                    <YAxis
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        tickFormatter={(v) => `${v}€`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '0.5rem',
                            color: 'var(--color-text-primary)',
                        }}
                        labelFormatter={(label) => format(new Date(label), 'MMMM yyyy')}
                        formatter={(value: any) => [`${value} €`, 'Estimated Refund']}
                    />
                    <Line
                        type="monotone"
                        dataKey="estimatedTaxRefund"
                        stroke="var(--color-primary)"
                        strokeWidth={2.5}
                        dot={{ r: 4, stroke: 'var(--color-primary)', strokeWidth: 1 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TaxRefundChart
