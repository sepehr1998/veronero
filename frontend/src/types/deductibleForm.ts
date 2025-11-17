export interface UserData {
    annualIncome: number | ''
    commuteType: 'none' | 'public' | 'car' | 'bicycle'

    workMeals: boolean
    toolsEquipment: boolean
    voluntaryPension: boolean
    unionFees: boolean
    professionalEducationCosts: number | ''

    singleParent: boolean
    disability: boolean
    childcareExpenses: boolean
    alimonyPayments: boolean
    medicalExpenses: boolean

    charitableDonations: boolean
    educationExpenses: boolean
    businessExpenses: boolean
    mortgageInterest: number | ''
    homeRenovationExpenses: boolean
    travelExpensesAmount: number | ''
}

export interface DeductionResult {
    name: string
    eligible: boolean
    estimate?: string
    explanation: string
    omaVero?: string
}
