'use client'
import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
import { format } from 'date-fns'

export default function ChatPage() {
    const { messages, addMessage, appendToLastAssistant } = useChatStore()
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hints, setHints] = useState<string[]>([])
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

        setInput('')
        setIsLoading(true)
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
        } catch (err) {
            console.error('Chat error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleHintClick = (hint: string) => {
        setInput(hint)
    }

    return (
        <div className="max-w-3xl mx-auto bg-[#F9FAFB] h-12/12 text-[#111827] flex flex-col">
            <h1 className="text-2xl font-semibold mb-6 p-4">💬 Your Assistant</h1>

            {/* Scrollable messages container */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 mb-2">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-lg max-w-lg ${
                            m.role === 'user'
                                ? 'ml-auto bg-primary text-white'
                                : 'mr-auto bg-[#F1F5F9] text-[#111827]'
                        }`}
                    >
                        <div>{m.content}</div>
                        {m.createdAt && (
                            <div className="text-xs mt-1 text-[#6B7280]">
                                {format(new Date(m.createdAt), 'HH:mm')}
                            </div>
                        )}
                        {i === messages.length - 1 && <div ref={bottomRef} />}
                    </div>
                ))}
            </div>

            {/* Hints / suggestions section */}
            {hints.length > 0 && (
                <div className="px-4 mb-4">
                    <div className="text-xs mb-2 opacity-70 text-gray-500">Suggestions:</div>
                    <div className="flex flex-wrap gap-2">
                        {hints.map((hint, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleHintClick(hint)}
                                className="text-sm px-3 py-1 rounded bg-primary text-white hover:bg-primary-hover transition"
                            >
                                {hint}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input area fixed at bottom */}
            <div className="flex gap-3 items-center bg-white p-4 rounded-xl shadow border border-[#E5E7EB]">
                <input
                    type="text"
                    className="flex-1 p-3 rounded-md bg-[#F1F5F9] text-[#111827] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isLoading}
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md font-medium disabled:opacity-50"
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    )
}
