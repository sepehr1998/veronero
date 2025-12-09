export type TaxProfileResponse = {
    id: string;
    userId: string;
    accountId: string;
    taxRegimeId: string;
    occupation: string | null;
    profileData: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
};

export type UpdateTaxProfilePayload = {
    taxRegimeId?: string;
    occupation?: string | null;
    profileData?: Record<string, unknown>;
};

export type ProfileCompletion = {
    completion: number;
    missingFields: string[];
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function ensureApiBaseUrl(): string {
    if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }
    return apiBaseUrl;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    const baseUrl = ensureApiBaseUrl();
    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers ?? {}),
        },
    });

    if (response.status === 204) {
        return null as T;
    }

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const body = await response.json();
            errorMessage = body.message || body.error || errorMessage;
        } catch {
            // ignore JSON parse failure
        }
        throw new Error(`Request failed (${response.status}): ${errorMessage}`);
    }

    // Some endpoints may legitimately return an empty body; guard against JSON parse errors
    const contentLength = response.headers.get('content-length');
    const hasBody =
        contentLength === null ||
        Number(contentLength) > 0 ||
        response.headers.get('transfer-encoding') !== null;

    if (!hasBody) {
        return null as T;
    }

    return response.json() as Promise<T>;
}

export async function getCurrentTaxProfile(
    accountId: string,
): Promise<TaxProfileResponse | null> {
    return fetchJson<TaxProfileResponse | null>(
        `/accounts/${accountId}/tax-profiles/current`,
        { cache: 'no-store' },
    );
}

export async function updateTaxProfile(
    accountId: string,
    payload: UpdateTaxProfilePayload,
): Promise<TaxProfileResponse> {
    return fetchJson<TaxProfileResponse>(
        `/accounts/${accountId}/tax-profiles/current`,
        {
            method: 'PATCH',
            body: JSON.stringify(payload),
        },
    );
}

export function computeProfileCompletion(
    profile?: TaxProfileResponse | null,
): ProfileCompletion {
    const data = (profile?.profileData ?? {}) as Record<string, unknown>;

    const checks = [
        { label: 'Tax regime', completed: Boolean(profile?.taxRegimeId) },
        { label: 'Occupation', completed: Boolean(profile?.occupation) },
        {
            label: 'Annual income',
            completed:
                typeof data.annualIncome === 'number' &&
                Number.isFinite(data.annualIncome) &&
                data.annualIncome > 0,
        },
        {
            label: 'Filing status',
            completed:
                typeof data.filingStatus === 'string' &&
                data.filingStatus.length > 0,
        },
        {
            label: 'Dependents',
            completed:
                typeof data.dependents === 'number' ||
                data.dependents === 0,
        },
        {
            label: 'Housing status',
            completed:
                typeof data.housingStatus === 'string' &&
                data.housingStatus.length > 0,
        },
    ];

    const completedCount = checks.filter((item) => item.completed).length;
    const completion =
        checks.length === 0
            ? 0
            : Math.round((completedCount / checks.length) * 100);

    return {
        completion,
        missingFields: checks
            .filter((item) => !item.completed)
            .map((item) => item.label),
    };
}
