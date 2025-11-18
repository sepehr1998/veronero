import { registerAs } from '@nestjs/config';

export interface AiConfig {
    apiKey?: string;
}

export default registerAs<AiConfig>('ai', () => ({
    apiKey: process.env.AI_API_KEY,
}));
