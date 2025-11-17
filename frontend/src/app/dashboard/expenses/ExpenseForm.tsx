import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {Expense} from "@/types/expense";

interface ExpenseFormProps {
    form: Expense
    setForm: (data: Expense) => void
    onChange: <K extends keyof Expense>(key: K, value: Expense[K]) => void
    onSubmitComplete?: () => void
}

const categories = ['Travel', 'Meals', 'Supplies', 'Office', 'Health', 'Education', 'Other']

export default function ExpenseForm({ form, setForm, onChange, onSubmitComplete }: ExpenseFormProps) {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        setForm({...form, userId: 'test-user-id' })
        e.preventDefault()
        setLoading(true)
        setError(null)

        const expenseData = { ...form, userId: 'test-user-id' }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expense`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            })

            if (!res.ok) throw new Error('Failed to submit expense')

            onSubmitComplete?.()
            setForm({userId: '', date: '', amount: 0, category: '', description: '' })
        } catch (err) {
            setError('Failed to submit expense. Please try again.' + err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => onChange('date', e.target.value)} required />
            </div>

            <div>
                <Label>Amount (€)</Label>
                <Input type="number" value={form.amount} onChange={e => onChange('amount', parseFloat(e.target.value))} required />
            </div>

            <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={value => onChange('category', value)} required>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent className="bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                        {categories.map(cat => (
                            <SelectItem
                                key={cat}
                                value={cat}
                                className="hover:bg-[var(--color-primary-hover)] focus:bg-[var(--color-primary-hover)] text-[var(--color-text-primary)] px-3 py-2 cursor-pointer rounded-md transition"
                            >
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>

                </Select>
            </div>

            <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => onChange('description', e.target.value)} />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Expense'}
            </Button>
        </form>
    )
}
