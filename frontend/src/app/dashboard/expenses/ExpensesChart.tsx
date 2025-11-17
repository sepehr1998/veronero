import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {Expense} from "@/types/expense";

interface Props {
    expenses: Expense[]
}

export default function ExpensesChart({expenses}: Props) {
    const categoryData = expenses.reduce((acc, expense) => {
        const existingCategory = acc.find((item) => item.name === expense.category)
        if (existingCategory) {
            existingCategory.value += expense.amount
        } else {
            acc.push({
                name: expense.category,
                value: expense.amount,
            })
        }
        return acc
    }, [])

    const COLORS = [
        '#C99383',
        '#A77B6C',
        '#D8b2A7',
        '#EBE5E2',
        '#8B5CF6',
        '#EC4899',
    ]

    return (
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Expenses by Category
                </h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`€${value.toFixed(2)}`, 'Amount']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-10 space-y-2">
                    {categoryData.map((category, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                }}
                            ></div>
                            <span className="text-sm text-gray-700">{category.name}</span>
                            <span className="ml-auto text-sm font-medium text-gray-700">
                  €{category.value.toFixed(2)}
                </span>
                        </div>
                    ))}
                </div>
            </div>
    )
}