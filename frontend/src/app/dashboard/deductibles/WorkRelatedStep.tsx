import React from 'react'
import { UserData } from '@/types/deductibleForm'

interface Props {
    data: UserData
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function WorkRelatedStep({ data, onChange }: Props) {
    return (
        <div className="space-y-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="workMeals"
                    checked={data.workMeals}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Work Meal Expenses</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="toolsEquipment"
                    checked={data.toolsEquipment}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Tools & Equipment</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="voluntaryPension"
                    checked={data.voluntaryPension}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Voluntary Pension Contributions</span>
            </label>
        </div>
    )
}
