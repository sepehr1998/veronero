'use client'

import { useState } from 'react'
import { generateMonthGrid, formatMonthYear } from '@/lib/calendar'
import { TaxEvent } from '@/types/calendar'
import { isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import CalendarCell from './CalendarCell'
import { Button } from '@/components/ui/button'

interface Props {
    events: TaxEvent[]
}

export default function CalendarGrid({ events }: Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const days = generateMonthGrid(currentMonth)

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const resetToday = () => setCurrentMonth(new Date())

    return (
        <div className="space-y-6 text-black">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-navy-dark">
                    {formatMonthYear(currentMonth)}
                </h2>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={prevMonth}>←</Button>
                    <Button variant="ghost" onClick={resetToday}>Today</Button>
                    <Button variant="ghost" onClick={nextMonth}>→</Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm text-center font-medium text-gray-600">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), day))
                    return (
                        <CalendarCell
                            key={i}
                            date={day}
                            events={dayEvents}
                            isCurrentMonth={isSameMonth(day, currentMonth)}
                        />
                    )
                })}
            </div>
        </div>
    )
}
