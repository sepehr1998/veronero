import { registerAs } from '@nestjs/config';

export interface AppConfig {
    nodeEnv: string;
    port: number;
}

export default registerAs<AppConfig>('app', () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
}));
