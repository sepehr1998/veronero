export type LifeEventKey = 'newChild' | 'homePurchase' | 'jobChange' | 'marriage' | 'education'

export interface Question {
    id: string
    text: string
    type: 'text' | 'number' | 'checkbox' | 'select'
    options?: string[]
}


export interface LifeEvent {
    key: LifeEventKey
    title: string
    description: string
    icon: string
    questions: Question[]
}