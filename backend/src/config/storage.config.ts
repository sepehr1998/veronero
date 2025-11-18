import { registerAs } from '@nestjs/config';

export interface StorageConfig {
    bucket: string;
    endpoint?: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
}

export default registerAs<StorageConfig>('storage', () => ({
    bucket: process.env.STORAGE_BUCKET ?? '',
    endpoint: process.env.STORAGE_ENDPOINT,
    region: process.env.STORAGE_REGION,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
}));
