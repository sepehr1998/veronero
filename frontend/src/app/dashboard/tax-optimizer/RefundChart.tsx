import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";

export const RefundChart = ({ income, contribution }: { income: number; contribution: number }) => {
    const refund = Math.round(contribution * 0.19)
    const remaining = income - refund

    const data = [
        { name: 'Refund', value: refund },
        { name: 'Remaining Tax', value: remaining },
    ]

    const COLORS = ['#4f46e5', '#e0e7ff']

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle>Refund Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}