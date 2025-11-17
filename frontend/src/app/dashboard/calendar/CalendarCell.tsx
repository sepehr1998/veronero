import { TaxEvent } from '@/types/calendar'
import { format, isToday } from 'date-fns'
import clsx from 'clsx'

interface Props {
    date: Date
    events: TaxEvent[]
    isCurrentMonth: boolean
}

export default function CalendarCell({ date, events, isCurrentMonth }: Props) {
    return (
        <div
            className={clsx(
                'min-h-[6rem] p-3 rounded-xl border border-border transition-all duration-300 flex flex-col gap-2 shadow-sm',
                isCurrentMonth
                    ? 'bg-[var(--color-card)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-card-alt)] text-[var(--color-text-secondary)] opacity-80',
                isToday(date) && 'ring-2 ring-[var(--color-primary)] ring-offset-1'
            )}
        >
            <div className="text-sm font-semibold tracking-tight">
                {format(date, 'd')}
            </div>

            <div className="flex flex-col gap-1">
                {events.slice(0, 2).map((e, i) => (
                    <span
                        key={i}
                        className={clsx(
                            'truncate text-xs px-2 py-1 rounded-full font-medium w-fit transition-colors',
                            e.type === 'vat' && 'bg-green-100 text-green-700',
                            e.type === 'deadline' && 'bg-yellow-100 text-yellow-800',
                            e.type === 'reminder' && 'bg-gray-200 text-gray-600',
                            e.type === 'income' && 'bg-blue-100 text-blue-700'
                        )}
                        title={e.title}
                    >
                        {e.title}
                    </span>
                ))}

                {events.length > 2 && (
                    <span className="text-[10px] text-gray-500 mt-0.5">
                        + {events.length - 2} more
                    </span>
                )}
            </div>
        </div>
    )
}
