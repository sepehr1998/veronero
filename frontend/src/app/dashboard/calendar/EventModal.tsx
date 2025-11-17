import React from 'react'
import { TaxEvent } from '@/types/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format, isPast, isToday } from 'date-fns'
import { CalendarDays, Info, AlarmClock, BadgeCheck } from 'lucide-react'
import clsx from 'clsx'

interface Props {
    open: boolean
    onClose: () => void
    event: TaxEvent | null
}

export default function EventModal({ open, onClose, event }: Props) {
    if (!event) return null

    const eventDate = new Date(event.date)
    const overdue = isPast(eventDate) && !isToday(eventDate)
    const today = isToday(eventDate)

    const status = overdue ? 'Overdue' : today ? 'Today' : 'Upcoming'
    const statusColor = overdue ? 'text-red-600' : today ? 'text-yellow-600' : 'text-green-600'

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md border-l-4 pl-3 border-navy bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-black">
                        {event.title}
                        <span className={clsx('text-xs font-medium', statusColor)}>
              {status === 'Overdue' && '❗ Overdue'}
                            {status === 'Today' && '🟡 Today'}
                            {status === 'Upcoming' && '✅ Upcoming'}
            </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-sm text-gray-700 mt-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span>{format(eventDate, 'dd MMMM yyyy')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-gray-500" />
                        <span>{event.type}</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-gray-500" />
                        <span>{event.description}</span>
                    </div>
                </div>

                <div className="pt-5 flex justify-between items-center">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="accent-navy" disabled />
                        <AlarmClock className="w-4 h-4" />
                        Set reminder (coming soon)
                    </label>

                    <div className="space-x-2">
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            Close
                        </button>
                        <button className="bg-navy text-white px-3 py-1.5 rounded hover:bg-navy-dark text-sm">
                            Add to My Tax Planner
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
