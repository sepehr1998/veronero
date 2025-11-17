import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BotIcon } from 'lucide-react'
import clsx from 'clsx'

export default function AIInsightsCard({ insights }: { insights: string }) {
    return (
        <Card className="bg-gradient-to-br from-rg-background to-rg-background shadow-xl rounded-3xl border border-rg-background h-fit">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="bg-card text-primary p-2 rounded-full">
                        <BotIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-primary tracking-tight">
                        Your AI Assistant
                    </h2>
                </div>
                {insights ? (
                    <div
                        className={clsx(
                            'p-4 bg-white/90 rounded-xl border border-blue-100 text-gray-700 shadow-inner',
                            'text-sm leading-relaxed whitespace-pre-line'
                        )}
                    >
                        {insights}
                    </div>
                ) : (
                    <p className="text-sm text-white">No AI insights available yet.</p>
                )}
                <p className="text-xs text-black italic">
                    Powered by AI — your smart tax assistant 🤖
                </p>
            </CardContent>
        </Card>
    )
}
