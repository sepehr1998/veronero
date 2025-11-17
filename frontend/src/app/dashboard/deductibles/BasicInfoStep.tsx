import React from 'react'
import { UserData } from '@/types/deductibleForm'

interface Props {
    data: UserData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function BasicInfoStep({ data, onChange }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="annualIncome" className="block font-semibold mb-2">
                    Annual Income (€)
                </label>
                <input
                    type="number"
                    id="annualIncome"
                    name="annualIncome"
                    value={data.annualIncome}
                    onChange={onChange}
                    placeholder="e.g. 35000"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-dark"
                />
            </div>

            <div>
                <label htmlFor="commuteType" className="block font-semibold mb-2">
                    Commute Type
                </label>
                <select
                    id="commuteType"
                    name="commuteType"
                    value={data.commuteType}
                    onChange={onChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-dark"
                >
                    <option value="none">None</option>
                    <option value="public">Public Transport</option>
                    <option value="car">Car</option>
                    <option value="bicycle">Bicycle</option>
                </select>
            </div>

            <div>
                <label htmlFor="mortgageInterest" className="block font-semibold mb-2">
                    Mortgage Interest Paid (€)
                </label>
                <input
                    type="number"
                    id="mortgageInterest"
                    name="mortgageInterest"
                    value={data.mortgageInterest || ''}
                    onChange={onChange}
                    placeholder="e.g. 2000"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-dark"
                />
            </div>

            <div>
                <label htmlFor="homeRenovationExpenses" className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        id="homeRenovationExpenses"
                        name="homeRenovationExpenses"
                        checked={data.homeRenovationExpenses}
                        onChange={onChange}
                        className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                    />
                    <span>Home Renovation Expenses</span>
                </label>
            </div>

            <div>
                <label htmlFor="travelExpensesAmount" className="block font-semibold mb-2">
                    Travel Expenses Amount (€)
                </label>
                <input
                    type="number"
                    id="travelExpensesAmount"
                    name="travelExpensesAmount"
                    value={data.travelExpensesAmount || ''}
                    onChange={onChange}
                    placeholder="e.g. 500"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-dark"
                />
            </div>

            <div>
                <label htmlFor="professionalEducationCosts" className="block font-semibold mb-2">
                    Professional Education Costs (€)
                </label>
                <input
                    type="number"
                    id="professionalEducationCosts"
                    name="professionalEducationCosts"
                    value={data.professionalEducationCosts || ''}
                    onChange={onChange}
                    placeholder="e.g. 1500"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-dark"
                />
            </div>

            <div>
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        id="unionFees"
                        name="unionFees"
                        checked={data.unionFees}
                        onChange={onChange}
                        className="rounded border-gray-300 text-navy-dark focus:ring-navy-dark"
                    />
                    <span>Union Fees Paid</span>
                </label>
            </div>
        </div>
    )
}
