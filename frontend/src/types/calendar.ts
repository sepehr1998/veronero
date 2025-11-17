export type UserType = 'employee' | 'freelancer' | 'vat-liable-business'

export interface CalendarInput {
    userType: UserType
    hasSideIncome: boolean
    vatQuarterly: boolean
    incomeEstimate: number
}

export interface TaxEvent {
    id: string
    title: string
    description: string
    date: string
    type: 'vat' | 'income' | 'reminder' | 'deadline' | 'other'
    omaVeroPath?: string,
}
