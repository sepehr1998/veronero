import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

export const TaxGraph = ({ income, contribution, housingInterest, deductions }: { income: number; contribution: number; housingInterest: number; deductions: number }) => {
    const baseTax = income * 0.25
    const reducedTax = (income - contribution - housingInterest - deductions) * 0.25

    const data = [
        { name: 'Base Tax', Tax: baseTax },
        { name: 'With Contributions', Tax: reducedTax },
    ]

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle>Tax Impact Graph</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="Tax" stroke="#4f46e5" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
