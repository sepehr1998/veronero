import { create } from 'zustand'

interface TaxAnalysisState {
    file: File | null
    loading: boolean
    error: string | null
    setFile: (file: File | null) => void
    setLoading: (loading: boolean) => void
    setError: (msg: string | null) => void
}

export const useTaxAnalysisStore = create<TaxAnalysisState>((set) => ({
    file: null,
    loading: false,
    error: null,
    setFile: (file) => set({ file }),
    setLoading: (loading) => set({ loading }),
    setError: (msg) => set({ error: msg }),
}))
