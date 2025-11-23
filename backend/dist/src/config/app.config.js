"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const configuredOrigins = process.env.APP_ALLOWED_ORIGINS?.split(',')
        .map((value) => value.trim())
        .filter(Boolean) ?? [];
    const devDefaults = nodeEnv === 'production' ? [] : ['http://localhost:3000'];
    return {
        nodeEnv,
        port: Number(process.env.PORT ?? 3000),
        allowedOrigins: Array.from(new Set([...configuredOrigins, ...devDefaults])),
    };
});
//# sourceMappingURL=app.config.js.map