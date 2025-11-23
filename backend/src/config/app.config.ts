import { registerAs } from '@nestjs/config';

export interface AppConfig {
    nodeEnv: string;
    port: number;
    allowedOrigins: string[];
}

export default registerAs<AppConfig>('app', () => {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const configuredOrigins =
        process.env.APP_ALLOWED_ORIGINS?.split(',')
            .map((value) => value.trim())
            .filter(Boolean) ?? [];
    const devDefaults = nodeEnv === 'production' ? [] : ['http://localhost:3000'];

    return {
        nodeEnv,
        port: Number(process.env.PORT ?? 3000),
        allowedOrigins: Array.from(new Set([...configuredOrigins, ...devDefaults])),
    };
});
