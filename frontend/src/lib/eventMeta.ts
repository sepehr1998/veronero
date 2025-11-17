export const EVENT_TYPE_META = {
    vat: { label: 'VAT Return', color: 'bg-blue-100', icon: '📄' },
    income: { label: 'Income Tax', color: 'bg-green-100', icon: '💰' },
    reminder: { label: 'Reminder', color: 'bg-yellow-100', icon: '⏰' },
    deadline: { label: 'Deadline', color: 'bg-red-100', icon: '📅' },
    other: { label: 'Other', color: 'bg-gray-100', icon: '🧾' },
} as const
