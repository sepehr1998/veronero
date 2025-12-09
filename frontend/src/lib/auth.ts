export type AuthenticatedUserProfile = {
    id: string;
    email: string;
    fullName: string | null;
    locale: string | null;
    lastLoginAt: string | null;
};

export type Auth0Profile = {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
};

export type AccountMembership = {
    accountId: string;
    name: string;
    countryCode: string;
    type: string;
    role: string;
};

export type AuthSessionResponse = {
    isAuthenticated: boolean;
    user: AuthenticatedUserProfile | null;
    auth0Profile: Auth0Profile | null;
    accounts?: AccountMembership[];
    defaultAccountId?: string | null;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL;

function ensureApiBaseUrl(): string {
    if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }
    return apiBaseUrl;
}

function ensureAppBaseUrl(): string {
    if (appBaseUrl) {
        return appBaseUrl;
    }

    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    throw new Error('NEXT_PUBLIC_APP_URL is not configured');
}

export function buildAuthLoginUrl(returnTo = '/dashboard'): string {
    const apiBase = ensureApiBaseUrl();
    const appBase = ensureAppBaseUrl();

    const url = new URL('/auth/login', apiBase);

    const normalized = normalizeReturnTarget(returnTo) ?? '/';

    // If caller already passed an absolute URL, keep it
    const finalReturnTo = normalized.startsWith('http://') || normalized.startsWith('https://')
        ? normalized
        : new URL(normalized, appBase).toString(); // -> http://localhost:3000/dashboard

    url.searchParams.set('returnTo', finalReturnTo);

    return url.toString();
}

export function buildAuthLogoutUrl(returnTo = '/'): string {
    const baseUrl = ensureApiBaseUrl();
    const url = new URL('/auth/logout', baseUrl);
    const normalized = normalizeReturnTarget(returnTo);
    if (normalized) {
        url.searchParams.set('returnTo', normalized);
    }
    return url.toString();
}

export async function fetchAuthSession(): Promise<AuthSessionResponse> {
    const baseUrl = ensureApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/session`, {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch auth session (${response.status})`);
    }

    return response.json();
}

function normalizeReturnTarget(target?: string): string | null {
    if (!target) {
        return null;
    }

    const trimmed = target.trim();
    if (!trimmed) {
        return null;
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }

    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
