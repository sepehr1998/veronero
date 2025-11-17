import React, { useState } from 'react'
import { TaxEvent } from '@/types/calendar'
import EventCard from './EventCard'
import CalendarGrid from './CalendarGrid'
import EventModal from './EventModal'
import FilterBar from "@/app/dashboard/calendar/FilterBar";

interface Props {
    events: TaxEvent[]
}

export default function CalendarView({ events }: Props) {
    const [selectedEvent, setSelectedEvent] = useState<TaxEvent | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const [filters, setFilters] = useState<string[]>([])

    const toggleFilter = (type: string) => {
        setFilters(prev =>
            prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
        )
    }

    const filteredEvents = filters.length > 0
        ? events.filter(e => filters.includes(e.type))
        : events

    const sorted = [...filteredEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const openModal = (event: TaxEvent) => {
        setSelectedEvent(event)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedEvent(null)
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                <div className="lg:col-span-2 space-y-4">
                    <FilterBar activeFilters={filters} onToggle={toggleFilter} />
                    <h2 className="text-lg font-semibold text-navy-dark">📅 Calendar View</h2>
                    <div className="bg-white border border-border rounded-2xl shadow-sm p-4">
                        <CalendarGrid events={sorted} onEventClick={openModal} />
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold text-navy-dark">📌 Timeline View</h2>
                    <div className="bg-white border border-border rounded-2xl shadow-inner p-4 max-h-[80vh] overflow-y-auto space-y-3">
                        {sorted.map(event => (
                            <div key={event.id} onClick={() => openModal(event)} className="cursor-pointer">
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <EventModal open={modalOpen} onClose={closeModal} event={selectedEvent} />
        </>
    )
}
