import React from 'react'
import { UserData, DeductionResult } from '@/types/deductibleForm'

interface Props {
    data: UserData
    deductions: DeductionResult[]
    loading: boolean
    error: string | null
    onSubmit: () => void
    onBack: () => void
}

type PrettyValueType =
    | string
    | number
    | boolean
    | null
    | undefined
    | PrettyValueType[]
    | { [key: string]: PrettyValueType }

function PrettyValue({ value }: { value: PrettyValueType }) {
    if (value === null || value === undefined) return <>—</>
    if (typeof value === 'boolean') return <>{value ? 'Yes' : 'No'}</>
    if (typeof value === 'string' || typeof value === 'number') return <>{value}</>
    if (Array.isArray(value)) {
        return (
            <ul className="list-disc list-inside ml-4">
                {value.map((item, i) => (
                    <li key={i}>
                        <PrettyValue value={item} />
                    </li>
                ))}
            </ul>
        )
    }
    if (typeof value === 'object') {
        return (
            <ul className="ml-4 space-y-1">
                {Object.entries(value).map(([k, v]) => (
                    <li key={k}>
                        <strong>{k}:</strong> <PrettyValue value={v} />
                    </li>
                ))}
            </ul>
        )
    }
    return <>{String(value)}</>
}

const prettifyKey = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

export default function ReviewSubmitStep({
                                             data,
                                             deductions,
                                             error,
                                         }: Props) {
    // Sum estimated amounts of eligible deductions
    const totalEstimate = deductions
        .filter(d => d.eligible && d.estimate)
        .reduce((sum, d) => {
            const numeric = parseFloat(d.estimate?.replace(/[^\d.]/g, '') || '0')
            return sum + (isNaN(numeric) ? 0 : numeric)
        }, 0)

    return (
        <div className="space-y-10">
            {/* Section: Input Summary */}
            <section className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-navy-900 mb-4 flex items-center gap-2">
                    🧾 Review Your Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-800">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-gray-500 font-medium">{prettifyKey(key)}</p>
                            <p className="font-semibold"><PrettyValue value={value} /></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section: Deduction Summary Box */}
            {deductions.length > 0 && totalEstimate > 0 && (
                <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-300 rounded-xl shadow-md px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-green-700 font-semibold text-lg">💰 Estimated Total Deductions</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Based on your input, you are likely eligible for tax deductions worth approximately:
                        </p>
                    </div>
                    <div className="text-3xl font-bold text-green-800 tracking-tight">
                        €{totalEstimate.toLocaleString('fi-FI')}
                    </div>
                </div>
            )}

            {/* Section: Deductions */}
            <section className="bg-gray-50 border border-gray-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    🎯 Eligible Tax Deductions
                </h2>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {deductions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {deductions.map((d, i) => (
                            <div
                                key={i}
                                className={`rounded-lg border p-4 shadow-sm transition ${
                                    d.eligible
                                        ? 'bg-white border-green-300'
                                        : 'bg-gray-100 border-gray-200 opacity-70'
                                }`}
                            >
                                <h4 className={`text-lg font-semibold mb-2 ${d.eligible ? 'text-green-700' : 'text-gray-500'}`}>
                                    {d.eligible ? '✅' : '🚫'} {d.name}
                                </h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                                    <li>{d.explanation}</li>
                                    {d.estimate && (
                                        <li>
                                            <strong>Estimate:</strong> €{parseFloat(d.estimate).toLocaleString()}
                                        </li>
                                    )}
                                    {d.omaVero && (
                                        <li>
                                            <strong>OmaVero:</strong> {d.omaVero}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm">No deductions calculated yet.</p>
                )}
            </section>

        </div>
    )
}
