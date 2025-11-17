import React from 'react'
import { EVENT_TYPE_META } from '@/lib/eventMeta'

interface Props {
    activeFilters: string[]
    onToggle: (type: string) => void
}

export default function FilterBar({ activeFilters, onToggle }: Props) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(EVENT_TYPE_META).map(([type, meta]) => {
                const isActive = activeFilters.includes(type)

                return (
                    <button
                        key={type}
                        onClick={() => onToggle(type)}
                        className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200
                            ${isActive
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : 'bg-[var(--color-card)] text-[var(--color-text-primary)] border-[var(--color-border)]'}
                            hover:bg-[var(--color-primary-hover)] hover:text-white`}
                    >
                        <span className="mr-1">{meta.icon}</span>
                        {meta.label}
                    </button>
                )
            })}
        </div>
    )
}
