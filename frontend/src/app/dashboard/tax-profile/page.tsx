'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    computeProfileCompletion,
    getCurrentTaxProfile,
    updateTaxProfile,
    type TaxProfileResponse,
} from '@/services/taxProfileService'
import { useActiveAccount } from '@/lib/useActiveAccount'
import { useUserStore } from '@/stores/user'

type FormState = {
    occupation: string
    filingStatus: string
    annualIncome: string
    dependents: string
    housingStatus: string
    city: string
    spouseIncome: string
    retirementContributions: string
    otherDeductions: string
}

const defaultFormState: FormState = {
    occupation: '',
    filingStatus: '',
    annualIncome: '',
    dependents: '',
    housingStatus: '',
    city: '',
    spouseIncome: '',
    retirementContributions: '',
    otherDeductions: '',
}

const formSteps = [
    {
        key: 'basics',
        title: 'Basics',
        description: 'Tell us about your work and how you file taxes.',
    },
    {
        key: 'income',
        title: 'Income',
        description: 'Your household income and dependents.',
    },
    {
        key: 'deductions',
        title: 'Deductions',
        description: 'Housing and contributions that reduce your taxes.',
    },
]

function stringifyNumber(value: unknown): string {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value.toString()
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        return value
    }
    return ''
}

function parseNumberInput(value: string): number | undefined {
    if (!value || value.trim().length === 0) {
        return undefined
    }
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

function buildFormState(
    profile: TaxProfileResponse | null,
    fallbackName?: string | null,
): FormState {
    const data = (profile?.profileData ?? {}) as Record<string, unknown>

    return {
        occupation: profile?.occupation ?? fallbackName ?? '',
        filingStatus:
            typeof data.filingStatus === 'string' ? data.filingStatus : '',
        annualIncome: stringifyNumber(data.annualIncome),
        dependents: stringifyNumber(data.dependents),
        housingStatus:
            typeof data.housingStatus === 'string' ? data.housingStatus : '',
        city: typeof data.city === 'string' ? data.city : '',
        spouseIncome: stringifyNumber(data.spouseIncome),
        retirementContributions: stringifyNumber(data.retirementContributions),
        otherDeductions: stringifyNumber(data.otherDeductions),
    }
}

function buildProfilePayload(
    form: FormState,
    existing: TaxProfileResponse | null,
) {
    const baseData = (existing?.profileData ?? {}) as Record<string, unknown>
    const nextData: Record<string, unknown> = {
        ...baseData,
        filingStatus: form.filingStatus || null,
        annualIncome: parseNumberInput(form.annualIncome),
        dependents:
            form.dependents.trim().length > 0
                ? parseNumberInput(form.dependents)
                : baseData.dependents,
        housingStatus: form.housingStatus || null,
        city: form.city || null,
        spouseIncome: parseNumberInput(form.spouseIncome),
        retirementContributions: parseNumberInput(
            form.retirementContributions,
        ),
        otherDeductions: parseNumberInput(form.otherDeductions),
    }

    Object.keys(nextData).forEach((key) => {
        const value = nextData[key]
        if (value === undefined || value === '') {
            delete nextData[key]
        }
    })

    const trimmedOccupation = form.occupation.trim()

    return {
        occupation: trimmedOccupation ? trimmedOccupation : null,
        profileData: nextData,
    }
}

export default function TaxProfilePage() {
    const [form, setForm] = useState<FormState>(defaultFormState)
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<TaxProfileResponse | null>(null)
    const [completion, setCompletion] = useState(() =>
        computeProfileCompletion(null),
    )
    const [error, setError] = useState<string | null>(null)
    const [accountWarning, setAccountWarning] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const { accountId } = useActiveAccount()
    const { user } = useUserStore()

    const displayName = useMemo(
        () => user?.fullName ?? user?.email ?? null,
        [user],
    )

    useEffect(() => {
        async function loadProfile() {
            setLoading(true)
            setError(null)
            setAccountWarning(null)

            if (!accountId) {
                setAccountWarning(
                    'No active account selected. Set NEXT_PUBLIC_ACCOUNT_ID or add ?accountId=... to sync data.',
                )
                setLoading(false)
                return
            }

            try {
                const existing = await getCurrentTaxProfile(accountId)
                setProfile(existing)
                setCompletion(computeProfileCompletion(existing))
                setForm(buildFormState(existing, displayName))
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Unable to load your profile.'
                setError(message)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [accountId, displayName])

    const handleChange = <K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        if (!accountId) {
            setError(
                'No active account selected. Set NEXT_PUBLIC_ACCOUNT_ID or add ?accountId=... to save.',
            )
            return
        }

        const payload = buildProfilePayload(form, profile)

        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const updated = await updateTaxProfile(accountId, payload)
            setProfile(updated)
            setCompletion(computeProfileCompletion(updated))
            setSuccess('Profile saved successfully.')
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Failed to save your profile.'
            setError(message)
        } finally {
            setSaving(false)
        }
    }

    const moveStep = (direction: 'next' | 'prev') => {
        setActiveStep((current) => {
            if (direction === 'next') {
                return Math.min(current + 1, formSteps.length - 1)
            }
            return Math.max(current - 1, 0)
        })
    }

    const renderStepFields = () => {
        if (activeStep === 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                            id="occupation"
                            placeholder="Software Engineer, Freelancer, etc."
                            value={form.occupation}
                            onChange={(event) =>
                                handleChange('occupation', event.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Filing status</Label>
                        <Select
                            value={form.filingStatus}
                            onValueChange={(value) =>
                                handleChange('filingStatus', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your filing status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married_joint">Married - joint</SelectItem>
                                <SelectItem value="married_separate">Married - separate</SelectItem>
                                <SelectItem value="head_of_household">Head of household</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )
        }

        if (activeStep === 1) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="annualIncome">Annual income (€)</Label>
                        <Input
                            id="annualIncome"
                            type="number"
                            inputMode="decimal"
                            placeholder="42000"
                            value={form.annualIncome}
                            onChange={(event) =>
                                handleChange('annualIncome', event.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="spouseIncome">Spouse income (€)</Label>
                        <Input
                            id="spouseIncome"
                            type="number"
                            inputMode="decimal"
                            placeholder="Optional"
                            value={form.spouseIncome}
                            onChange={(event) =>
                                handleChange('spouseIncome', event.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dependents">Dependents</Label>
                        <Input
                            id="dependents"
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={form.dependents}
                            onChange={(event) =>
                                handleChange('dependents', event.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            placeholder="Helsinki"
                            value={form.city}
                            onChange={(event) =>
                                handleChange('city', event.target.value)
                            }
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Housing status</Label>
                    <Select
                        value={form.housingStatus}
                        onValueChange={(value) =>
                            handleChange('housingStatus', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select housing status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="renting">Renting</SelectItem>
                            <SelectItem value="own_mortgage">Own with mortgage</SelectItem>
                            <SelectItem value="own_free">Own outright</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="retirementContributions">Retirement contributions (€)</Label>
                    <Input
                        id="retirementContributions"
                        type="number"
                        inputMode="decimal"
                        placeholder="Optional"
                        value={form.retirementContributions}
                        onChange={(event) =>
                            handleChange('retirementContributions', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="otherDeductions">Other deductible expenses (€)</Label>
                    <Input
                        id="otherDeductions"
                        type="number"
                        inputMode="decimal"
                        placeholder="Education, medical, etc."
                        value={form.otherDeductions}
                        onChange={(event) =>
                            handleChange('otherDeductions', event.target.value)
                        }
                    />
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-sm text-gray-600">
                Loading your profile...
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Complete your tax profile</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        We&apos;ll use this to tailor deductions, reminders, and AI chat answers.
                    </p>
                    {accountWarning && (
                        <p className="mt-2 text-xs text-amber-600">
                            {accountWarning}
                        </p>
                    )}
                </div>
                <Link
                    href="/dashboard"
                    className="text-sm text-primary hover:underline"
                >
                    ← Back to dashboard
                </Link>
            </div>

            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl">Completion</CardTitle>
                        <p className="text-sm text-gray-500">
                            {completion.completion}% complete
                        </p>
                    </div>
                    <div className="flex-1 md:max-w-md">
                        <Progress value={completion.completion} className="h-3 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3">
                            {formSteps.map((step, index) => {
                                const isActive = index === activeStep
                                const isDone = index < activeStep
                                return (
                                    <div
                                        key={step.key}
                                        className={`px-4 py-3 rounded-xl border ${
                                            isActive
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : isDone
                                                    ? 'border-green-500/50 text-green-700 bg-green-50'
                                                    : 'border-border text-gray-600'
                                        }`}
                                    >
                                        <div className="text-xs uppercase tracking-wide">
                                            Step {index + 1}
                                        </div>
                                        <div className="font-semibold">{step.title}</div>
                                        <div className="text-xs text-gray-500">
                                            {step.description}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">{formSteps[activeStep].title}</h2>
                                    <p className="text-sm text-gray-500">
                                        {formSteps[activeStep].description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    Step {activeStep + 1} of {formSteps.length}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {renderStepFields()}
                            </div>

                            {error && (
                                <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mt-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {success}
                                </div>
                            )}

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        className="gap-2"
                                        onClick={() => moveStep('prev')}
                                        disabled={activeStep === 0 || saving}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => moveStep('next')}
                                        disabled={
                                            activeStep === formSteps.length - 1 || saving
                                        }
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    className="bg-primary text-white hover:bg-primary-hover"
                                    onClick={handleSubmit}
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Saving...'
                                        : activeStep === formSteps.length - 1
                                            ? 'Save profile'
                                            : 'Save and continue'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {completion.missingFields.length === 0 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                        Profile checklist
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {completion.missingFields.length === 0 ? (
                        <p className="text-sm text-green-700">
                            Nice! Your profile is complete. Head back to the dashboard to see tailored insights.
                        </p>
                    ) : (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {completion.missingFields.map((item) => (
                                <li key={item}>{item} is still missing</li>
                            ))}
                        </ul>
                    )}
                    <p className="text-xs text-gray-500">
                        Keeping this up to date lets VeroNero surface deductions, deadlines, and chat answers for your exact situation.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
