'use client'

import React, { useEffect, useState } from 'react'
import { CalendarInput, TaxEvent } from '@/types/calendar'
import CalendarView from './CalendarView'
import { Loader2 } from 'lucide-react'

const defaultProfile: CalendarInput = {
    userType: 'freelancer',
    hasSideIncome: true,
    vatQuarterly: true,
    incomeEstimate: 45000,
}

export default function TaxCalendarPage() {
    const [events, setEvents] = useState<TaxEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tax-calendar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(defaultProfile),
                })
                const data = await res.json()
                setEvents(data)
            } catch (err) {
                console.error('Error loading calendar:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    return (
        <div className="max-w-9/12 mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-navy-dark">📅 Your Smart Tax Calendar</h1>

            {loading ? (
                <div className="flex justify-center py-10 text-gray-500">
                    <Loader2 className="animate-spin h-6 w-6" />
                </div>
            ) : (
                <CalendarView events={events} />
            )}
        </div>
    )
}
