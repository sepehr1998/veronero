"use client"

import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#60a5fa', '#f59e0b', '#10b981', '#ef4444', '#a78bfa']

interface Data {
    category: string,
    amount: number
}

const ExpensePieChart = ({ data }: { data: Data[] }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 border border-border">
            <h3 className="text-lg font-semibold mb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={90} label>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ExpensePieChart
