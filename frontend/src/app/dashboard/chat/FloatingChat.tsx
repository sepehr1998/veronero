'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
import { format } from 'date-fns'
import { MessageCircle, X } from 'lucide-react'

export default function FloatingChat() {
    const { messages, addMessage, appendToLastAssistant } = useChatStore()
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hints, setHints] = useState<string[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    const fetchHints = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages }),
            })

            const data = await res.json()
            setHints(data.hints || [])
        } catch {
            setHints([])
        }
    }

    const sendMessage = async () => {
        const trimmedInput = input.trim()
        if (!trimmedInput) return

        addMessage({ role: 'user', content: trimmedInput, createdAt: new Date().toISOString() })
        addMessage({ role: 'assistant', content: '', createdAt: new Date().toISOString() })

        setIsLoading(true)
        setInput('')
        setHints([])

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/openai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, { role: 'user', content: trimmedInput }] }),
            })

            if (!res.body) throw new Error('No response body')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value)
                appendToLastAssistant(chunk)
            }

            await fetchHints()
        } catch (error) {
            console.error('Chat error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleHintClick = (hint: string) => {
        setInput(hint)
    }

    return (
        <div className="fixed bottom-4 right-4 z-50" style={{ maxWidth: '90vw', maxHeight: '70vh' }}>
            {!isOpen ? (
                <button
                    className="rounded-full p-4 shadow-lg"
                    style={{
                        backgroundColor: 'var(--color-text-primary)',
                        color: 'var(--color-primary)',
                    }}
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            ) : (
                <div
                    className="w-80 rounded-lg shadow-2xl p-4 border flex flex-col"
                    style={{
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-text-primary)',
                        borderColor: 'var(--color-border)',
                        maxHeight: '60vh',
                        height: '100%',
                        minHeight: '300px',
                    }}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">💬 Assistant</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-red-500 hover:opacity-80 transition"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div
                        className="overflow-y-auto mb-3 custom-scrollbar"
                        style={{
                            flexGrow: 1,
                            minHeight: 0,
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mb-2 p-2 rounded max-w-[80%] break-words ${
                                    msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                                }`}
                                style={{
                                    backgroundColor:
                                        msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-card-alt)',
                                    color:
                                        msg.role === 'user' ? 'var(--color-background)' : 'var(--color-text-primary)',
                                }}
                            >
                                <span>{msg.content}</span>
                                {msg.createdAt && (
                                    <div className="text-xs opacity-50 mt-1 text-right">
                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                    </div>
                                )}
                                {idx === messages.length - 1 && <div ref={bottomRef} />}
                            </div>
                        ))}
                    </div>

                    {hints.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs mb-1 opacity-70 text-gray-500">Suggestions:</div>
                            <div className="flex flex-wrap gap-2">
                                {hints.map((hint, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleHintClick(hint)}
                                        className="text-sm px-2 py-1 rounded"
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'var(--color-background)',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
                                        }
                                    >
                                        {hint}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="w-full rounded p-2 mb-2 border focus:outline-none"
                        style={{
                            backgroundColor: 'var(--color-card-alt)',
                            color: 'var(--color-text-primary)',
                            borderColor: 'var(--color-border)',
                        }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={isLoading}
                    />

                    <button
                        className="w-full font-bold py-2 rounded"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-background)',
                            opacity: isLoading ? 0.5 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                        onClick={sendMessage}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Assistant is typing...' : 'Send'}
                    </button>
                </div>
            )}
        </div>
    )
}
