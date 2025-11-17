export const mockDashboardData = {
    user: {
        id: 'user_123',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
    },
    recentLifeEvents: [
        {
            id: 'le_001',
            createdAt: new Date('2025-07-20T10:15:00Z'),
            selectedEvents: ['Got a new job', 'Moved to a new city'],
            answers: {
                jobSatisfaction: 'Very satisfied',
                relocationStress: 'Moderate',
            },
        },
        {
            id: 'le_002',
            createdAt: new Date('2025-07-15T14:20:00Z'),
            selectedEvents: ['Started therapy'],
            answers: {
                therapyFrequency: 'Weekly',
                comfortLevel: 'High',
            },
        },
        {
            id: 'le_003',
            createdAt: new Date('2025-07-10T09:00:00Z'),
            selectedEvents: ['Adopted a pet'],
            answers: {
                petType: 'Dog',
                happinessIncrease: 'Significant',
            },
        },
        {
            id: 'le_004',
            createdAt: new Date('2025-07-05T18:45:00Z'),
            selectedEvents: ['Broke up with partner'],
            answers: {
                emotionalImpact: 'High',
                supportNeeded: 'Yes',
            },
        },
        {
            id: 'le_005',
            createdAt: new Date('2025-07-01T11:30:00Z'),
            selectedEvents: ['Started a fitness program'],
            answers: {
                frequency: '3 times a week',
                goal: 'Weight loss',
            },
        },
    ],
    latestInsights:
        'Here are your insights based on your latest life events: Got a new job, Moved to a new city. Review your answers carefully.',
    expensesSummary: [
        { category: 'Food', amount: 450 },
        { category: 'Transportation', amount: 120 },
        { category: 'Healthcare', amount: 300 },
        { category: 'Entertainment', amount: 200 },
        { category: 'Housing', amount: 950 },
    ],
}
