"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const express_openid_connect_1 = require("express-openid-connect");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const allowedOrigins = configService.get('app.allowedOrigins') ?? [];
    app.enableCors({
        credentials: true,
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS origin denied: ${origin}`), false);
        },
    });
    const baseUrl = configService.getOrThrow('auth.baseUrl');
    const clientId = configService.getOrThrow('auth.clientId');
    const clientSecret = configService.getOrThrow('auth.clientSecret');
    const issuerBaseURL = configService.getOrThrow('auth.issuerBaseUrl');
    const sessionSecret = configService.getOrThrow('auth.sessionSecret');
    const audience = configService.getOrThrow('auth.audience');
    const callbackUrl = new URL('/auth/callback', baseUrl).toString();
    app.use((0, express_openid_connect_1.auth)({
        authRequired: false,
        auth0Logout: true,
        baseURL: baseUrl,
        clientID: clientId,
        clientSecret,
        issuerBaseURL,
        secret: sessionSecret,
        authorizationParams: {
            response_type: 'code',
            response_mode: 'query',
            scope: 'openid profile email',
            audience,
            redirect_uri: callbackUrl,
        },
        routes: {
            login: false,
            logout: false,
            callback: false,
        },
    }));
    const port = configService.get('app.port') ?? 3000;
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map