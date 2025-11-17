import React from 'react'
import { UserData } from '@/types/deductibleForm'

interface Props {
    data: UserData
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FamilyPersonalStep({ data, onChange }: Props) {
    return (
        <div className="space-y-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="singleParent"
                    checked={data.singleParent}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Single Parent Deduction</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="disability"
                    checked={data.disability}
                    onChange={onChange}
                    className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                />
                <span>Disability Deduction</span>
            </label>
        </div>
    )
}
