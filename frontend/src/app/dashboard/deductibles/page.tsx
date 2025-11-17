'use client'

import React, { useState } from 'react'
import BasicInfoStep from './BasicInfoStep'
import WorkRelatedStep from './WorkRelatedStep'
import FamilyPersonalStep from './FamilyPersonalStep'
import OtherDeductionsStep from './OtherDeductionsStep'
import ReviewSubmitStep from './ReviewSubmitStep'
import { UserData, DeductionResult } from '@/types/deductibleForm'

const steps = [
    'Basic Info',
    'Work-Related',
    'Family & Personal',
    'Other Deductions',
    'Review & Submit',
]

export default function TaxDeductionForm() {
    const [currentStep, setCurrentStep] = useState(0)

    const [formData, setFormData] = useState<UserData>({
        annualIncome: '',
        commuteType: 'none',

        workMeals: false,
        toolsEquipment: false,
        voluntaryPension: false,
        unionFees: false,
        professionalEducationCosts: '',

        singleParent: false,
        disability: false,
        childcareExpenses: false,
        alimonyPayments: false,
        medicalExpenses: false,

        charitableDonations: false,
        educationExpenses: false,
        businessExpenses: false,
        mortgageInterest: '',
        homeRenovationExpenses: false,
        travelExpensesAmount: '',
    })

    const [deductions, setDeductions] = useState<DeductionResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, type, value } = e.target

        const updatedValue =
            type === 'checkbox' && 'checked' in e.target
                ? (e.target as HTMLInputElement).checked
                : value

        setFormData(prev => ({
            ...prev,
            [name]: updatedValue,
        }))
    }


    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)
        setDeductions([])

        try {
            // Transform data where needed (numbers from strings)
            const payload = {
                ...formData,
                annualIncome: Number(formData.annualIncome),
                professionalEducationCosts: Number(formData.professionalEducationCosts),
                mortgageInterest: Number(formData.mortgageInterest),
                travelExpensesAmount: Number(formData.travelExpensesAmount),
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tax/deductions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Failed to get deductions')

            const data = await res.json()
            setDeductions(data)
            nextStep()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Unknown error')
            }
    } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6/12 mx-auto p-6 bg-white rounded shadow mt-8 text-black">
            <h2 className="text-3xl font-bold mb-6 text-navy-dark">
                Tax Deduction Assistant
            </h2>

            <div className="mb-6 font-semibold text-gray-700">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </div>

            <div className="min-h-[300px]">
                {currentStep === 0 && (
                    <BasicInfoStep data={formData} onChange={handleChange} />
                )}
                {currentStep === 1 && (
                    <WorkRelatedStep data={formData} onChange={handleChange} />
                )}
                {currentStep === 2 && (
                    <FamilyPersonalStep data={formData} onChange={handleChange} />
                )}
                {currentStep === 3 && (
                    <OtherDeductionsStep data={formData} onChange={handleChange} />
                )}
                {currentStep === 4 && (
                    <ReviewSubmitStep
                        data={formData}
                        deductions={deductions}
                        loading={loading}
                        error={error}
                        onSubmit={handleSubmit}
                        onBack={prevStep}
                    />
                )}
            </div>

            <div className="mt-6 flex justify-between">
                {currentStep > 0 && (
                    <button
                        type="button"
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={prevStep}
                    >
                        ⬅ Back
                    </button>
                )}

                {currentStep < steps.length - 1 && (
                    <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-navy-blue"
                    >
                        Next
                    </button>
                )}

                {currentStep === steps.length - 1 && (
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Calculating...' : '🔍 Calculate Deductions'}
                    </button>
                )}
            </div>
        </div>
    )
}
