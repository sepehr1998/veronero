'use client'

import React, {useState} from 'react'
import { Expense } from '@/types/expense'
import {ArrowDownIcon, ArrowUpIcon, FilterIcon, ReceiptIcon, SearchIcon, TagIcon} from "lucide-react";

interface Props {
    expenses: Expense[]
}

export function ExpenseTable({ expenses }: Props) {
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')

    // Filter expenses
    const filteredExpenses: Expense[] = expenses.filter((expense) => {
        // Apply category filter
        if (
            filter !== 'all' &&
            expense.category.toLowerCase() !== filter.toLowerCase()
        ) {
            return false
        }
        // Apply search filter
        if (
            searchTerm &&
            !expense.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !expense.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false
        }
        return true
    })
    // Sort expenses
    const sortedExpenses: Expense[] = [...filteredExpenses].sort((a, b) => {
        if (sortBy === 'date') {
            return sortOrder === 'asc'
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime()
        } else if (sortBy === 'amount') {
            return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
        }
        return 0
    })
    // Calculate summary data
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
    // Chart data


    const toggleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(column)
            setSortOrder('desc')
        }
    }

    return (
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Recent Expenses
                </h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C99383] focus:border-transparent"
                        />
                        <SearchIcon
                            size={16}
                            className="absolute left-2.5 top-2.5 text-gray-400"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#C99383] focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            <option value="office supplies">Office Supplies</option>
                            <option value="software">Software</option>
                            <option value="travel">Travel</option>
                            <option value="meals">Meals</option>
                            <option value="equipment">Equipment</option>
                            <option value="utilities">Utilities</option>
                        </select>
                        <FilterIcon
                            size={16}
                            className="absolute left-2.5 top-2.5 text-gray-400"
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                                className="flex items-center focus:outline-none"
                                onClick={() => toggleSort('date')}
                            >
                                Date
                                {sortBy === 'date' &&
                                    (sortOrder === 'asc' ? (
                                        <ArrowUpIcon size={14} className="ml-1" />
                                    ) : (
                                        <ArrowDownIcon size={14} className="ml-1" />
                                    ))}
                            </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                                className="flex items-center focus:outline-none"
                                onClick={() => toggleSort('amount')}
                            >
                                Amount
                                {sortBy === 'amount' &&
                                    (sortOrder === 'asc' ? (
                                        <ArrowUpIcon size={14} className="ml-1" />
                                    ) : (
                                        <ArrowDownIcon size={14} className="ml-1" />
                                    ))}
                            </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {sortedExpenses.map((expense) => (
                        <tr
                            key={expense.id}
                            className="hover:bg-[#F3EFED] cursor-pointer"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <TagIcon size={16} className="text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">
                          {expense.category}
                        </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                €{expense.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${expense.status === 'approved' ? 'bg-green-100 text-green-800' : expense.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {expense.status.charAt(0).toUpperCase() +
                            expense.status.slice(1)}
                      </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {sortedExpenses.length === 0 && (
                <div className="text-center py-12">
                    <ReceiptIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                        No expenses found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filter criteria
                    </p>
                </div>
            )}
        </div>
    )
}
