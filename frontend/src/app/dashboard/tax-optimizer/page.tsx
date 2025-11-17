'use client'

import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import LifeEventWizard from './LifeEventWizard'
import ScenarioComparison from "@/app/dashboard/tax-optimizer/ScenarioComparison";
import ScenarioComparisonTable from "@/app/dashboard/tax-optimizer/ScenarioComparisonTable";
import { OptimizationTips } from "@/app/dashboard/tax-optimizer/OptimizationTips";

export default function TaxOptimizer() {
    const [scenarios, setScenarios] = useState([])
    const [showScenarioModal, setShowScenarioModal] = useState(false)
    const [showLifeEventWizard, setShowLifeEventWizard] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        income: 55000,
        sideIncome: 0,
        capitalGains: 0,
        mortgageInterest: 0,
        workExpenses: 0,
        travelDeductions: 0,
        donations: 0,
        contribution: 2000,
        status: 'single',
        employment: 'employed'
    })

    const handleSlider = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value[0] }))
    }

    const saveScenario = () => {
        if (!formData.name.trim()) return
        setScenarios([...scenarios, formData])
        setShowScenarioModal(false)
        setFormData({
            ...formData,
            name: ''
        })
    }

    return (
        <div className="max-w-7xl mx-auto my-10 space-y-12">

            {/* Banner */}
            <div className="mb-8 p-6 bg-[var(--color-primary)] text-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold mb-2">
                        Maximize Your Tax Savings with Our Life Event Wizard!
                    </h2>
                    <p className="text-lg">
                        Recent life changes? Our wizard guides you to unlock all possible tax benefits.
                    </p>
                </div>
                <Button
                    onClick={() => setShowLifeEventWizard(true)}
                    className="mt-4 md:mt-0 bg-white text-black font-bold hover:bg-gray-100 transition"
                >
                    Open Life Event Wizard
                </Button>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tax Scenarios</h2>
                <Button onClick={() => setShowScenarioModal(true)}>+ Create New Scenario</Button>
            </div>

            {/* Current Data Section */}
            <section
                aria-label="Current Tax Estimate and Optimization Tips"
                className="p-6 rounded-lg shadow-md bg-[var(--color-card)] border border-[var(--color-border)]"
            >
                <h2 className="text-3xl font-extrabold mb-6 text-[var(--color-text-primary)]">Your Current Tax Estimate</h2>

                {/* Quick summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Payable Tax */}
                    <Card className="p-4 flex flex-col items-center border-[var(--color-border)]">
                        <CardTitle>Total Payable Tax</CardTitle>
                        {(() => {
                            const totalIncome = formData.income + formData.sideIncome + formData.capitalGains
                            const totalDeductions = formData.contribution + formData.mortgageInterest + formData.workExpenses + formData.travelDeductions + formData.donations
                            const taxRate = ((totalDeductions / totalIncome) * 100).toFixed(1)
                            const payableTax = totalDeductions // placeholder until your real formula
                            return (
                                <>
                                    <p className="text-2xl font-bold mt-2">€{payableTax.toLocaleString()}</p>
                                    <span className="mt-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {taxRate}% rate
                  </span>
                                </>
                            )
                        })()}
                    </Card>

                    {/* Total Income */}
                    <Card className="p-4 flex flex-col items-center border-[var(--color-border)]">
                        <CardTitle>Total Income</CardTitle>
                        {(() => {
                            const grossIncome = formData.income + formData.sideIncome + formData.capitalGains
                            const percentageOfGross = ((grossIncome / 150000) * 100).toFixed(1)
                            return (
                                <>
                                    <p className="text-2xl font-bold mt-2">€{grossIncome.toLocaleString()}</p>
                                    <span className="mt-1 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    {percentageOfGross}% of max gross
                  </span>
                                </>
                            )
                        })()}
                    </Card>

                    {/* Monthly Net Income */}
                    <Card className="p-4 flex flex-col items-center border-[var(--color-border)]">
                        <CardTitle>Monthly Net Income</CardTitle>
                        {(() => {
                            const totalIncome = formData.income + formData.sideIncome + formData.capitalGains
                            const totalDeductions = formData.contribution + formData.mortgageInterest + formData.workExpenses + formData.travelDeductions + formData.donations
                            const netIncome = totalIncome - totalDeductions
                            const monthlyNet = netIncome / 12
                            return (
                                <p className="text-2xl font-bold mt-2">€{monthlyNet.toLocaleString()}</p>
                            )
                        })()}
                    </Card>
                </div>

                {/* Optimization Tips for current inputs only */}
                <OptimizationTips currentData={formData} scenarios={[]} showScenarioSelector={false} />
            </section>

            {/* Scenario Results Section */}
            <section
                aria-label="Scenario Comparisons and Optimization Tips"
                className="p-6 rounded-lg shadow-md bg-[var(--color-card-alt)] border border-[var(--color-border)]"
            >
                <h2 className="text-3xl font-extrabold mb-6 text-[var(--color-text-primary)]">Scenario Comparisons & Insights</h2>

                <ScenarioComparisonTable scenarios={scenarios} />

                <ScenarioComparison scenarios={scenarios} />

                {/* Optimization Tips with toggle for scenarios */}
                <OptimizationTips currentData={formData} scenarios={scenarios} showScenarioSelector={true} />
            </section>

            {/* Scenario Creation Modal */}
            {showScenarioModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative">
                        <button
                            onClick={() => setShowScenarioModal(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold cursor-pointer"
                            aria-label="Close scenario modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Create New Scenario</h2>

                        {/* Name */}
                        <input
                            className="w-full border border-[var(--color-border)] p-2 rounded mb-4"
                            placeholder="Scenario Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        {/* All original fields here */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            {/* Income sliders and selects (same as before) */}
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Main Income</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.income]} min={20000} max={150000} step={1000} onValueChange={(v) => handleSlider('income', v)} />
                                    <p className="mt-2 font-medium">€{formData.income.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Side Income</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.sideIncome]} min={0} max={50000} step={1000} onValueChange={(v) => handleSlider('sideIncome', v)} />
                                    <p className="mt-2 font-medium">€{formData.sideIncome.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Capital Gains</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.capitalGains]} min={0} max={100000} step={1000} onValueChange={(v) => handleSlider('capitalGains', v)} />
                                    <p className="mt-2 font-medium">€{formData.capitalGains.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Mortgage Interest</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.mortgageInterest]} min={0} max={15000} step={500} onValueChange={(v) => handleSlider('mortgageInterest', v)} />
                                    <p className="mt-2 font-medium">€{formData.mortgageInterest.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Work Expenses</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.workExpenses]} min={0} max={5000} step={100} onValueChange={(v) => handleSlider('workExpenses', v)} />
                                    <p className="mt-2 font-medium">€{formData.workExpenses.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Travel Deductions</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.travelDeductions]} min={0} max={7000} step={100} onValueChange={(v) => handleSlider('travelDeductions', v)} />
                                    <p className="mt-2 font-medium">€{formData.travelDeductions.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.donations]} min={0} max={3000} step={100} onValueChange={(v) => handleSlider('donations', v)} />
                                    <p className="mt-2 font-medium">€{formData.donations.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Retirement Contribution</CardTitle></CardHeader>
                                <CardContent>
                                    <Slider value={[formData.contribution]} min={0} max={10000} step={500} onValueChange={(v) => handleSlider('contribution', v)} />
                                    <p className="mt-2 font-medium">€{formData.contribution.toLocaleString()}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Marital Status</CardTitle></CardHeader>
                                <CardContent>
                                    <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                            <Card className="border-[var(--color-border)]">
                                <CardHeader><CardTitle>Employment Status</CardTitle></CardHeader>
                                <CardContent>
                                    <Select value={formData.employment} onValueChange={(val) => setFormData({ ...formData, employment: val })}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Select employment" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="employed">Employed</SelectItem>
                                            <SelectItem value="self-employed">Self-Employed</SelectItem>
                                            <SelectItem value="unemployed">Unemployed</SelectItem>
                                            <SelectItem value="retired">Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <Button onClick={() => setShowScenarioModal(false)} variant="outline">Cancel</Button>
                            <Button onClick={saveScenario} disabled={!formData.name.trim()}>Save Scenario</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Life Event Wizard Modal */}
            {showLifeEventWizard && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative">
                        <button
                            onClick={() => setShowLifeEventWizard(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold cursor-pointer"
                            aria-label="Close scenario modal"
                        >
                            &times;
                        </button>
                        <LifeEventWizard onClose={() => setShowLifeEventWizard(false)} />
                    </div>
                </div>
            )}

        </div>
    )
}
