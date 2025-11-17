'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import TaxRefundChart from './TaxRefundChart'
import ExpensePieChart from './ExpensePieChart'
import LifeEventsList from './LifeEventsList'
import AIInsightsCard from './AIInsightsCard'
import MetricCard from './MetricCard'
import {mockDashboardData} from "@/app/dashboard/mocks/dashboardMockDatra";
import {mockTaxRefundData} from "@/app/dashboard/mocks/taxRefunds";

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
        answers: string[]
    }[]
    latestInsights: string | null
    expensesSummary: {
        category: string
        amount: number
    }[]
    taxProfileSummary: {
        annualIncome: number
        completion: number
    }
    deductionSimulations: {
        estimatedTaxRefund: number
        monthlyNetAfter: number
    }[]
}

const fetchDashboardData = async (userId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`)
    return res.json()
}

export default function DashboardHomePage() {
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<DashboardData>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                // const response = await fetchDashboardData('test-user-id')
                setDashboardData(mockDashboardData)
            } catch (err) {
                setError('Failed to load dashboard. Error: ' + err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <div className="p-8 text-gray-600 text-center">Loading your dashboard...</div>
    if (error) return <div className="p-8 text-red-500 text-center">{error}</div>

    const {
        user,
        recentLifeEvents = [],
        latestInsights = '',
        taxProfileSummary,
        deductionSimulations = [],
        expensesSummary = [],
    } = dashboardData!

    const lastSim = deductionSimulations[deductionSimulations.length - 1] || {}

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-10 font-sans">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">Welcome back, {user?.name || 'User'} 👋</h1>
            </div>

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
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Tax Rate (%)" value='25%' />
                <MetricCard title="Annual Income (€)" value={taxProfileSummary?.annualIncome?.toFixed(2) || 'N/A'} />
                <MetricCard title="Estimated Refund (€)" value={lastSim?.estimatedTaxRefund?.toFixed(2) || '0'} />
                <MetricCard title="Net Income After (€)" value={lastSim?.monthlyNetAfter?.toFixed(2) || '0'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-border">
                <TaxRefundChart data={mockTaxRefundData} />
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
