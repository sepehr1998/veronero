export type AnswerValue = string | number | boolean | undefined;

export interface LifeEventPayload {
    userId: string;
    selectedEvents: string[];
    answers: Record<string, AnswerValue>;
}

export async function submitLifeEvents(payload: LifeEventPayload) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/life-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to submit life events')
    }

    return res.json()
}
