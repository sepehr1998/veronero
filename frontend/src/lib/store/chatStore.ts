import { create } from 'zustand'

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string,
    createdAt: string,
}

type ChatStore = {
    messages: ChatMessage[]
    addMessage: (msg: ChatMessage) => void
    appendToLastAssistant: (text: string) => void
    clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    addMessage: (msg) =>
        set((state) => ({
            messages: [...state.messages, msg],
        })),
    appendToLastAssistant: (text) =>
        set((state) => {
            const msgs = [...state.messages]
            const last = msgs[msgs.length - 1]
            if (last?.role === 'assistant') {
                last.content += text
            }
            return { messages: msgs }
        }),
    clearMessages: () => set({ messages: [] }),
}))
