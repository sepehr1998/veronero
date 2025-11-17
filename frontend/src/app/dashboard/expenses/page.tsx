'use client'

import React, { useEffect, useState } from 'react'
import ExpenseForm from './ExpenseForm'
import ReceiptUpload from './ReceiptUpload'
import { ExpenseTable } from './ExpenseTable'
import { Card } from '@/components/ui/card'
import {Expense} from "@/types/expense";
import ExpensesChart from "@/app/dashboard/expenses/ExpensesChart";
import {SummaryCard} from "@/app/dashboard/expenses/SummaryCard";

export default function Page() {
    const expenses: Expense[] = [
        {
            id: 1,
            date: '2023-12-01',
            category: 'Office Supplies',
            description: 'Printer ink and paper',
            amount: 89.95,
            status: 'approved',
        },
        {
            id: 2,
            date: '2023-11-28',
            category: 'Software',
            description: 'Adobe Creative Cloud subscription',
            amount: 52.99,
            status: 'pending',
        },
        {
            id: 3,
            date: '2023-11-25',
            category: 'Travel',
            description: 'Train tickets to client meeting',
            amount: 47.5,
            status: 'approved',
        },
        {
            id: 4,
            date: '2023-11-22',
            category: 'Meals',
            description: 'Business lunch with clients',
            amount: 78.25,
            status: 'rejected',
        },
        {
            id: 5,
            date: '2023-11-18',
            category: 'Equipment',
            description: 'External hard drive',
            amount: 129.99,
            status: 'approved',
        },
        {
            id: 6,
            date: '2023-11-15',
            category: 'Office Supplies',
            description: 'Notebooks and pens',
            amount: 24.5,
            status: 'approved',
        },
        {
            id: 7,
            date: '2023-11-10',
            category: 'Software',
            description: 'Accounting software license',
            amount: 199.99,
            status: 'approved',
        },
        {
            id: 8,
            date: '2023-11-05',
            category: 'Utilities',
            description: 'Internet bill',
            amount: 59.95,
            status: 'pending',
        },
    ]

    const [form, setForm] = useState<Expense>({
        userId: '',
        date: '',
        amount: 0,
        category: '',
        description: '',
    })

    // const [expenses, setExpenses] = useState<Expense[]>([])
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)

    const handleFormChange = <K extends keyof Expense>(key: K, value: Expense[K]) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleParsedReceipt = (parsed: Partial<Expense>) => {
        setForm(prev => ({ ...prev, ...parsed }))
    }

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses?userId=test-user-id`)
            const data = await response.json()
            // setExpenses(data)
        } catch (err) {
            console.error('Failed to fetch expenses:', err)
        }
    }

    const resetForm = async () => {
        setForm({
            userId: '',
            date: '',
            amount: 0,
            category: '',
            description: '',
        })
        await fetchExpenses()
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
    )
    const approvedExpenses = expenses
        .filter((expense) => expense.status === 'approved')
        .reduce((sum, expense) => sum + expense.amount, 0)
    const pendingExpenses = expenses
        .filter((expense) => expense.status === 'pending')
        .reduce((sum, expense) => sum + expense.amount, 0)

    return (
        <>
            <div className="flex flex-row w-full mb-10 mt-6 justify-between">
                <h1 className="text-2xl font-bold text-primary">
                    Expense Manager
                </h1>
                <button
                    className="bg-primary hover:bg-primary-hover cursor-pointer rounded-lg py-2 px-6 text-white text-sm"
                    onClick={() => setShowAddExpenseModal(true)}
                >
                    + Add Expense
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SummaryCard
                    title="Total Expenses"
                    amount={totalExpenses}
                    description="All expenses this month"
                    color="primary"
                />
                <SummaryCard
                    title="Approved Expenses"
                    amount={approvedExpenses}
                    description="Ready for tax deduction"
                    color="green"
                />
                <SummaryCard
                    title="Pending Review"
                    amount={pendingExpenses}
                    description="Awaiting categorization"
                    color="amber"
                />
            </div>
            <div className="flex flex-row w-full gap-10 items-stretch">
                <div className="flex flex-1">
                    <div className="flex flex-col flex-1">
                        <ExpensesChart expenses={expenses} />
                    </div>
                </div>
                <div className="flex flex-[2]">
                    <div className="flex flex-col flex-1">
                        <ExpenseTable expenses={expenses} />
                    </div>
                </div>
            </div>

            {showAddExpenseModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative">
                        <button
                            onClick={() => setShowAddExpenseModal(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold cursor-pointer"
                            aria-label="Close scenario modal"
                        >
                            &times;
                        </button>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Add New Expense</h2>
                        </div>
                        <div className="space-y-6">
                            <ReceiptUpload onParsed={handleParsedReceipt} />
                            <ExpenseForm
                                form={form}
                                setForm={setForm}
                                onChange={handleFormChange}
                                onSubmitComplete={resetForm}
                            />
                        </div>

                    </div>
                </div>
            )}
        </>

    )
}
