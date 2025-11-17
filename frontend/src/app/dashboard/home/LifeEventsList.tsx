import React from 'react';
import { LifeEvent } from '@/types/lifeEvents';
import { CalendarDays } from 'lucide-react';

interface Events {
    id: string;
    selectedEvents: LifeEvent[];
    createdAt: string;
}

function groupEventsByMonth(events: Events[]) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
    });

    return events.reduce((acc, event) => {
        const groupKey = formatter.format(new Date(event.createdAt));
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(event);
        return acc;
    }, {} as Record<string, Events[]>);
}

const LifeEventsList = ({ events }: { events: Events[] }) => {
    if (events.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Life Timeline</h3>
                <p className="text-sm text-gray-500">No events recorded yet.</p>
            </div>
        );
    }

    const groupedEvents = groupEventsByMonth(events);

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <h3 className="text-xl font-bold mb-6">Life Timeline</h3>

            <div className="space-y-16">
                {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                    <div key={month}>
                        {/* Month Header — not touched by line */}
                        <h4 className="text-lg font-semibold text-gray-700 mb-6">{month}</h4>

                        {/* Timeline Section */}
                        <div className="relative pl-12">
                            {/* Timeline line aligned with icons */}
                            <div className="absolute top-0 bottom-0 w-0.5 bg-gray-300" />

                            <div className="space-y-10">
                                {monthEvents.map((event) => (
                                    <div key={event.id} className="relative flex items-start gap-4">
                                        {/* Icon on the timeline */}
                                        <div className="absolute left-0 top-0 z-10 -translate-x-1/2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow-md">
                                                <CalendarDays className="w-4 h-4" />
                                            </div>
                                        </div>

                                        {/* Event content */}
                                        <div className="ml-10 bg-gray-50 border border-gray-200 p-4 rounded-md shadow-sm w-full">
                                            <p className="text-sm font-medium text-gray-800">
                                                {event.selectedEvents?.join(', ') || 'Unnamed Event'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(event.createdAt).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifeEventsList;
