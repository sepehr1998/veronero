import React from 'react'
import { Input } from '@/components/ui/input'
import { Expense } from '@/types/expense'
import {ReceiptIcon, UploadCloud} from 'lucide-react'

interface ReceiptUploadProps {
    onParsed: (data: Partial<Expense>) => void
}

export default function ReceiptUpload({ onParsed }: ReceiptUploadProps) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/parse`, {
            method: 'POST',
            body: formData,
        })

        if (!res.ok) {
            console.error('Parsing failed')
            return
        }

        const data = await res.json()
        onParsed(data)
    }

    return (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-alt)] p-4 flex flex-col gap-3 shadow-sm w-full">
            <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className="p-3 bg-[#EBE5E2] rounded-full">
                        <ReceiptIcon size={24} className="text-[#C99383]" />
                    </div>
                </div>
                <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        Upload receipts for automatic categorization
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Our AI will automatically extract information from your receipts
                        and categorize them for tax purposes.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-[var(--color-text-secondary)]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-white file:font-semibold
                        file:bg-[var(--color-primary)] file:hover:bg-[var(--color-primary-hover)]
                        transition"
                />
            </div>
        </div>
    )
}
