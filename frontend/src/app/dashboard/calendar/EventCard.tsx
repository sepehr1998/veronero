import { TaxEvent } from '@/types/calendar'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import clsx from 'clsx'
import { EVENT_TYPE_META } from "@/lib/eventMeta";


export default function EventCard({ event }: { event: TaxEvent }) {
    const iconMap = EVENT_TYPE_META
    return (
        <motion.div
            className="rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm bg-white hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start gap-4 text-black">
                <div
                    className={clsx(
                        'flex items-center justify-center w-10 h-10 rounded-full',
                        iconMap[event.type].color
                    )}
                >
                    <p className={clsx('w-5 h-5 text-center', iconMap[event.type].color)}> {iconMap[event.type].icon} </p>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-base md:text-lg font-semibold text-navy-dark">
                            {event.title}
                        </h3>
                        <span className="text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString('fi-FI', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
              })}
            </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">{event.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className={clsx(
                                'text-xs font-medium',
                                iconMap[event.type].color,
                            )}
                        >
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>

                        {event.omaVeroPath && (
                            <Badge variant="outline" className="text-xs text-gray-600">
                                OmaVero: {event.omaVeroPath}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
