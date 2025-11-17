'use client'

import React, { useState } from 'react'

// Types

export type LifeEventKey =
    | 'married'
    | 'children'
    | 'relocation'
    | 'newJob'
    | 'selfEmployed'
    | 'boughtHome'
    | 'soldProperty'
    | 'retirement'
    | 'disability'
    | 'education'

export interface LifeEvent {
    key: LifeEventKey
    title: string
    description: string
    icon: React.ReactNode
    questions: Question[]
}

interface Question {
    key: string
    question: string
    type: 'number' | 'select' | 'text'
    options?: string[]
}

interface LifeEventSelectorProps {
    lifeEvents: LifeEvent[]
    selectedEvents: LifeEventKey[]
    onToggleEvent: (key: LifeEventKey) => void
    onContinue: () => void
}

function LifeEventSelector({
                               lifeEvents,
                               selectedEvents,
                               onToggleEvent,
                               onContinue,
                           }: LifeEventSelectorProps) {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Select Your Life Event(s)</h1>
            <p className="mb-6 text-gray-600">
                Choose one or more events that happened recently:
            </p>
            <div className="grid grid-cols-2 gap-4">
                {lifeEvents.map((event) => (
                    <button
                        key={event.key}
                        onClick={() => onToggleEvent(event.key)}
                        className={`p-4 border border-border rounded cursor-pointer flex flex-col items-center
              ${
                            selectedEvents.includes(event.key)
                                ? 'bg-blue-100 bg-site-background'
                                : 'hover:bg-gray-100'
                        }`}
                        type="button"
                    >
                        <span className="text-4xl mb-2">{event.icon}</span>
                        <strong>{event.title}</strong>
                        <small className="text-gray-500">{event.description}</small>
                    </button>
                ))}
            </div>
            <button
                disabled={selectedEvents.length === 0}
                onClick={onContinue}
                className="mt-6 px-6 py-2 bg-primary hover:bg-primary-hover cursor-pointer text-white rounded disabled:opacity-50"
            >
                Continue
            </button>
        </>
    )
}

interface LifeEventDetailProps {
    event: LifeEvent
    answers: Record<string, any>
    onChange: (questionKey: string, value: any) => void
    onNext: () => void
    onBack: () => void
}

function LifeEventDetail({ event, answers, onChange, onNext, onBack }: LifeEventDetailProps) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{event.title}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onNext()
                }}
            >
                {event.questions.map((q) => (
                    <div key={q.key} className="mb-4">
                        <label className="block mb-1 font-semibold" htmlFor={q.key}>
                            {q.question}
                        </label>
                        {q.type === 'number' && (
                            <input
                                id={q.key}
                                type="number"
                                value={answers[q.key] ?? ''}
                                onChange={(e) => onChange(q.key, Number(e.target.value))}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        )}
                        {q.type === 'text' && (
                            <input
                                id={q.key}
                                type="text"
                                value={answers[q.key] ?? ''}
                                onChange={(e) => onChange(q.key, e.target.value)}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        )}
                        {q.type === 'select' && (
                            <select
                                id={q.key}
                                value={answers[q.key] ?? ''}
                                onChange={(e) => onChange(q.key, e.target.value)}
                                className="w-full border rounded px-2 py-1"
                                required
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                {q.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}

                <div className="flex justify-between mt-6">
                    <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Back
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">
                        Next
                    </button>
                </div>
            </form>
        </div>
    )
}

interface SummaryProps {
    answers: Record<LifeEventKey, Record<string, any>>
    onBack: () => void
    onApply: () => void
}

function Summary({ answers, onBack, onApply }: SummaryProps) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Review Your Life Events</h2>
            {Object.entries(answers).map(([eventKey, ans]) => (
                <div key={eventKey} className="mb-4 p-4 border rounded">
                    <h3 className="font-semibold capitalize mb-2">{eventKey.replace(/([A-Z])/g, ' $1')}</h3>
                    <ul className="list-disc list-inside">
                        {Object.entries(ans).map(([qKey, val]) => (
                            <li key={qKey}>
                                <strong>{qKey.replace(/([A-Z])/g, ' $1')}: </strong>
                                {val.toString()}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className="flex justify-between mt-6">
                <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Back
                </button>
                <button onClick={onApply} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Apply Life Events
                </button>
            </div>
        </div>
    )
}

// Main Wizard Component

const lifeEvents: LifeEvent[] = [
    {
        key: 'married',
        title: 'Got Married',
        description: 'Marriage or registered partnership',
        icon: '💍',
        questions: [
            {
                key: 'spouseIncome',
                question: 'What is your spouse’s annual income (€)?',
                type: 'number',
            },
            {
                key: 'spouseEmploymentStatus',
                question: 'Spouse employment status',
                type: 'select',
                options: ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'],
            },
        ],
    },
    {
        key: 'children',
        title: 'Had Children',
        description: 'New child or children born',
        icon: '👶',
        questions: [
            {
                key: 'numberOfChildren',
                question: 'How many children were born?',
                type: 'number',
            },
            {
                key: 'childCareExpenses',
                question: 'Annual childcare expenses (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'relocation',
        title: 'Relocation',
        description: 'Moved to a new residence',
        icon: '🚚',
        questions: [
            {
                key: 'oldCity',
                question: 'Old city or municipality',
                type: 'text',
            },
            {
                key: 'newCity',
                question: 'New city or municipality',
                type: 'text',
            },
            {
                key: 'relocationCosts',
                question: 'Relocation costs (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'newJob',
        title: 'Started New Job',
        description: 'New employment during the year',
        icon: '💼',
        questions: [
            {
                key: 'jobStartMonth',
                question: 'Which month did you start?',
                type: 'select',
                options: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ],
            },
            {
                key: 'previousJobIncome',
                question: 'Income from previous job (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'selfEmployed',
        title: 'Self-Employment',
        description: 'Started self-employment or freelance work',
        icon: '🧑‍💻',
        questions: [
            {
                key: 'businessIncome',
                question: 'Annual business income (€)?',
                type: 'number',
            },
            {
                key: 'businessExpenses',
                question: 'Annual business expenses (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'boughtHome',
        title: 'Bought a Home',
        description: 'Purchased real estate property',
        icon: '🏠',
        questions: [
            {
                key: 'purchasePrice',
                question: 'Purchase price (€)?',
                type: 'number',
            },
            {
                key: 'loanAmount',
                question: 'Loan amount (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'soldProperty',
        title: 'Sold Property',
        description: 'Sold real estate or other property',
        icon: '🏢',
        questions: [
            {
                key: 'salePrice',
                question: 'Sale price (€)?',
                type: 'number',
            },
            {
                key: 'purchasePrice',
                question: 'Original purchase price (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'retirement',
        title: 'Retired',
        description: 'Retirement during the year',
        icon: '🎉',
        questions: [
            {
                key: 'retirementMonth',
                question: 'Month of retirement',
                type: 'select',
                options: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ],
            },
            {
                key: 'pensionIncome',
                question: 'Annual pension income (€)?',
                type: 'number',
            },
        ],
    },
    {
        key: 'disability',
        title: 'Disability',
        description: 'Disability or health-related issues',
        icon: '♿',
        questions: [
            {
                key: 'disabilityDegree',
                question: 'Degree of disability (%)',
                type: 'number',
            },
            {
                key: 'disabilityStartDate',
                question: 'Date disability started',
                type: 'text',
            },
        ],
    },
    {
        key: 'education',
        title: 'Education',
        description: 'Started or continued studies',
        icon: '🎓',
        questions: [
            {
                key: 'educationLevel',
                question: 'Level of education',
                type: 'select',
                options: ['High School', 'Bachelor', 'Master', 'PhD', 'Other'],
            },
            {
                key: 'tuitionFees',
                question: 'Annual tuition fees (€)?',
                type: 'number',
            },
        ],
    },
]

export default function LifeEventWizard() {
    const [step, setStep] = useState(1) // 1 = selector, 2+ detail per event, final last step summary
    const [selectedEvents, setSelectedEvents] = useState<LifeEventKey[]>([])
    const [currentDetailIndex, setCurrentDetailIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<LifeEventKey, Record<string, any>>>({})

    const toggleEvent = (key: LifeEventKey) => {
        setSelectedEvents((prev) =>
            prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
        )
    }

    const onContinueFromSelector = () => {
        setStep(2)
        setCurrentDetailIndex(0)
    }

    const onAnswerChange = (questionKey: string, value: any) => {
        const eventKey = selectedEvents[currentDetailIndex]
        setAnswers((prev) => ({
            ...prev,
            [eventKey]: {
                ...prev[eventKey],
                [questionKey]: value,
            },
        }))
    }

    const onNextDetail = () => {
        if (currentDetailIndex < selectedEvents.length - 1) {
            setCurrentDetailIndex(currentDetailIndex + 1)
        } else {
            setStep(3) // summary step
        }
    }

    const onBackDetail = () => {
        if (currentDetailIndex > 0) {
            setCurrentDetailIndex(currentDetailIndex - 1)
        } else {
            setStep(1) // back to selector
        }
    }

    const onBackFromSummary = () => {
        setStep(2)
        setCurrentDetailIndex(selectedEvents.length - 1)
    }

    const onApply = () => {
        // Here you can send the answers to your backend or process them
        alert('Life events applied:\n' + JSON.stringify(answers, null, 2))
    }

    if (step === 1) {
        return (
            <LifeEventSelector
                lifeEvents={lifeEvents}
                selectedEvents={selectedEvents}
                onToggleEvent={toggleEvent}
                onContinue={onContinueFromSelector}
            />
        )
    }

    if (step === 2) {
        const eventKey = selectedEvents[currentDetailIndex]
        const event = lifeEvents.find((e) => e.key === eventKey)!
        return (
            <LifeEventDetail
                event={event}
                answers={answers[eventKey] ?? {}}
                onChange={onAnswerChange}
                onNext={onNextDetail}
                onBack={onBackDetail}
            />
        )
    }

    if (step === 3) {
        return <Summary answers={answers} onBack={onBackFromSummary} onApply={onApply} />
    }

    return null
}
