"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => {
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
//# sourceMappingURL=auth.config.js.map