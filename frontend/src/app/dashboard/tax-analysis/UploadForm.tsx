'use client'

import { useDropzone } from 'react-dropzone'
import { useTaxAnalysisStore } from '@/lib/store/taxAnalysisStore'
import { useCallback } from 'react'
import { UploadCloud } from 'lucide-react'

interface UploadFormProps {
    onResult: (suggestions: string) => void
}

export default function UploadForm({ onResult }: UploadFormProps) {
    const { file, setFile, loading, setLoading, error, setError } = useTaxAnalysisStore()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        setFile(file)
        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tax/analyze`, {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Upload failed')

            const data = await res.json()
            onResult(data.suggestions)
        } catch (err) {
            console.error(err)
            setError('Failed to analyze the tax document.')
        } finally {
            setLoading(false)
        }
    }, [setFile, setLoading, setError, onResult])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
    })

    return (
        <section className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Upload Your Tax Document
            </h2>

            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                    ${isDragActive ? 'border-primary bg-muted' : 'border-gray-400 bg-muted/50'}
                `}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-10 h-10 text-primary" />
                {file ? (
                    <p className="text-sm font-medium text-primary">
                        Uploaded: <strong>{file.name}</strong>
                    </p>
                ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Drag and drop your PDF/DOCX here, or click to select a file.
                    </p>
                )}
            </div>

            {loading && (
                <p className="mt-4 text-sm text-primary text-center animate-pulse">Analyzing file...</p>
            )}
            {error && (
                <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}
        </section>
    )
}
