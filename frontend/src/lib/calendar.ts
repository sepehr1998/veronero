import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
} from 'date-fns'

export function generateMonthGrid(current: Date) {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 }) // Monday
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 })

    const days: Date[] = []
    let curr = start
    while (curr <= end) {
        days.push(curr)
        curr = addDays(curr, 1)
    }

    return days
}

export const formatMonthYear = (date: Date) => format(date, 'MMMM yyyy')
