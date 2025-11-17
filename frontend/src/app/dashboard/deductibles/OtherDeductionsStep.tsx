import React from 'react'
import { UserData } from '@/types/deductibleForm'

interface Props {
    data: UserData
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function OtherDeductionsStep({ data, onChange }: Props) {
    return (
        <div className="space-y-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="charitableDonations"
                    checked={data.charitableDonations}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Charitable Donations</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="educationExpenses"
                    checked={data.educationExpenses}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Education Expenses</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="businessExpenses"
                    checked={data.businessExpenses}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Business or Freelance Expenses</span>
            </label>
        </div>
    )
}
