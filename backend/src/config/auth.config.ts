import { registerAs } from '@nestjs/config';

export interface AuthConfig {
    domain: string;
    audience: string;
    issuerUrl: string;
    issuerBaseUrl: string;
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    sessionSecret: string;
}

export default registerAs<AuthConfig>('auth', () => {
    const domain = process.env.AUTH0_DOMAIN ?? '';
    const rawIssuer = process.env.AUTH0_ISSUER_URL ?? `https://${domain}`;
    const issuerBaseUrl = rawIssuer.replace(/\/+$/, '');
    const issuerUrl = `${issuerBaseUrl}/`;

    return {
        domain,
        audience: process.env.AUTH0_AUDIENCE ?? '',
        issuerUrl,
        issuerBaseUrl,
        baseUrl: process.env.AUTH0_BASE_URL ?? 'http://localhost:4000',
        clientId: process.env.AUTH0_CLIENT_ID ?? '',
        clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
        sessionSecret: process.env.AUTH0_SESSION_SECRET ?? '',
    };
});
