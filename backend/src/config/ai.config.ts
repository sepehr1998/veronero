import { registerAs } from '@nestjs/config';

export interface AiConfig {
    apiKey?: string;
    model?: string;
    provider?: 'openai' | 'anthropic' | 'azure_openai' | 'dummy';
}

export default registerAs<AiConfig>('ai', () => ({
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL ?? 'gpt-4o-mini',
    provider: (process.env.AI_PROVIDER as AiConfig['provider']) ?? 'dummy',
}));
