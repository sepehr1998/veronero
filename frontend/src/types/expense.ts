export interface Expense {
    id: number
    userId?: string
    date: string // ISO string
    description: string
    amount: number
    category: string
    receiptUrl?: string // optional link to uploaded receipt
    status: string
}
