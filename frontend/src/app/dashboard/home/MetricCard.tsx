import React from 'react'

interface MetricCardProps {
    title: string
    value: string | number
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
    return (
        <div className="p-4 bg-white rounded-xl shadow-md border border-border hover:shadow-xl">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    )
}

export default MetricCard