'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import TaxRefundChart from './TaxRefundChart'
import ExpensePieChart from './ExpensePieChart'
import LifeEventsList from './LifeEventsList'
import AIInsightsCard from './AIInsightsCard'
import MetricCard from './MetricCard'
import { mockDashboardData } from '@/app/dashboard/mocks/dashboardMockDatra'
import { mockTaxRefundData } from '@/app/dashboard/mocks/taxRefunds'
import { useUserStore } from '@/stores/user'
import { useActiveAccount } from '@/lib/useActiveAccount'
import {
    computeProfileCompletion,
    getCurrentTaxProfile,
} from '@/services/taxProfileService'

type DashboardData = {
    user: {
        id: string
        name: string
        email: string
    } | null
    recentLifeEvents: {
        id: string
        createdAt: Date
        selectedEvents: string[]
        answers: Record<string, unknown> | string[]
    }[]
    latestInsights: string | null
    expensesSummary: {
        category: string
        amount: number
    }[]
    taxProfileSummary: {
        annualIncome: number
        completion: number
        missingFields: string[]
    }
    deductionSimulations: {
        estimatedTaxRefund: number
        monthlyNetAfter: number
    }[]
}

export default function DashboardHomePage() {
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        user: mockDashboardData.user,
        recentLifeEvents: mockDashboardData.recentLifeEvents,
        latestInsights: mockDashboardData.latestInsights,
        expensesSummary: mockDashboardData.expensesSummary,
        deductionSimulations: mockTaxRefundData,
        taxProfileSummary: {
            annualIncome: 0,
            completion: 0,
            missingFields: [],
        },
    })
    const [error, setError] = useState<string | null>(null)
    const [accountWarning, setAccountWarning] = useState<string | null>(null)
    const { accountId } = useActiveAccount()
    const { user } = useUserStore()

    const resolvedUser = useMemo(() => {
        if (user) {
            return {
                id: user.id,
                name: user.fullName ?? user.email ?? 'You',
                email: user.email,
            }
        }
        return dashboardData.user
    }, [dashboardData.user, user])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            setAccountWarning(null)

            if (!accountId) {
                setAccountWarning(
                    'No active account selected. Set NEXT_PUBLIC_ACCOUNT_ID or add ?accountId=... to sync data.',
                )
                setLoading(false)
                return;
            }

            try {
                const fetchedProfile = await getCurrentTaxProfile(accountId)
                const completion = computeProfileCompletion(fetchedProfile)
                const profileData = (fetchedProfile?.profileData ??
                    {}) as Record<string, unknown>
                const annualIncomeRaw = profileData.annualIncome
                const annualIncome =
                    typeof annualIncomeRaw === 'number'
                        ? annualIncomeRaw
                        : typeof annualIncomeRaw === 'string'
                          ? Number(annualIncomeRaw)
                          : 0

                setDashboardData((current) => ({
                    ...current,
                    user: user
                        ? {
                              id: user.id,
                              name: user.fullName ?? user.email ?? 'You',
                              email: user.email,
                          }
                        : current.user,
                    taxProfileSummary: {
                        annualIncome: Number.isFinite(annualIncome)
                            ? annualIncome
                            : 0,
                        completion: completion.completion,
                        missingFields: completion.missingFields,
                    },
                }))
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Failed to load dashboard.'
                setError(message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [accountId, user])

    if (loading)
        return <div className="p-8 text-gray-600 text-center">Loading your dashboard...</div>
    if (error) return <div className="p-8 text-red-500 text-center">{error}</div>

    const {
        recentLifeEvents = [],
        latestInsights = '',
        taxProfileSummary,
        deductionSimulations = [],
        expensesSummary = [],
    } = dashboardData

    const lastSim = deductionSimulations[deductionSimulations.length - 1] || {}
    const missingCopy =
        taxProfileSummary?.missingFields?.length
            ? `Missing: ${taxProfileSummary.missingFields.join(', ')}`
            : 'Profile complete'

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-10 font-sans">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">Welcome back, {resolvedUser?.name || 'User'} 👋</h1>
            </div>

            {taxProfileSummary?.completion !== 100 && (
                <Card className="bg-white/60 backdrop-blur shadow-xl rounded-3xl border-border">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Tax Profile Completion</h2>
                        <Progress value={taxProfileSummary?.completion || 0} className="h-4 rounded-full" />
                        <p className="text-sm text-gray-500 mt-2">
                            {taxProfileSummary?.completion || 0}% complete.{' '}
                            <Link href="/dashboard/tax-profile" className="text-primary hover:underline">
                                Complete your profile →
                            </Link>
                        </p>
                        {taxProfileSummary?.missingFields?.length ? (
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                <p className="text-xs font-semibold text-amber-700 mb-2">
                                    Missing details
                                </p>
                                <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                                    {taxProfileSummary.missingFields.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        {accountWarning && (
                            <p className="mt-2 text-xs text-amber-600">{accountWarning}</p>
                        )}
                    </CardContent>
                </Card>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Tax Rate (%)" value="25%" />
                <MetricCard title="Annual Income (€)" value={taxProfileSummary?.annualIncome?.toFixed(2) || 'N/A'} />
                <MetricCard title="Estimated Refund (€)" value={lastSim?.estimatedTaxRefund?.toFixed(2) || '0'} />
                <MetricCard title="Net Income After (€)" value={lastSim?.monthlyNetAfter?.toFixed(2) || '0'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-border">
                <TaxRefundChart data={deductionSimulations} />
                {expensesSummary?.length ? (
                    <ExpensePieChart data={expensesSummary} />
                ) : (
                    <div className="p-4 border rounded bg-white shadow text-gray-500 text-sm border-border">
                        No expense data available.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-border">
                <LifeEventsList events={recentLifeEvents} />
                <AIInsightsCard insights={latestInsights} />
            </div>

        </div>
    )
}
