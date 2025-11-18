import { registerAs } from '@nestjs/config';

export interface QueueConfig {
    prefix: string;
}

export default registerAs<QueueConfig>('queue', () => ({
    prefix: process.env.BULLMQ_PREFIX ?? 'veronero',
}));
