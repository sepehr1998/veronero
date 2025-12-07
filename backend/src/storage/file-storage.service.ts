import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import { mkdir, stat, writeFile } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { pipeline } from 'stream/promises';
import type { Readable } from 'stream';
import type { StorageConfig } from '../config/storage.config';

@Injectable()
export class FileStorageService {
    private readonly basePath: string;

    constructor(
        configService: ConfigService<StorageConfig, true>,
    ) {
        const bucket = configService.get<string>('storage.bucket', {
            infer: true,
        });
        this.basePath = resolve(bucket || 'storage');
    }

    async uploadTaxCard(key: string, content: Buffer | Readable): Promise<string> {
        const targetPath = this.resolveKeyPath(key);
        await mkdir(dirname(targetPath), { recursive: true });

        if (this.isReadable(content)) {
            await pipeline(content, createWriteStream(targetPath));
        } else {
            await writeFile(targetPath, content);
        }

        return key;
    }

    async getTaxCardStream(key: string): Promise<NodeJS.ReadableStream> {
        const targetPath = this.resolveKeyPath(key);
        try {
            const fileStat = await stat(targetPath);
            if (!fileStat.isFile()) {
                throw new NotFoundException('Tax card file not found');
            }
        } catch (error) {
            throw new NotFoundException('Tax card file not found');
        }

        return createReadStream(targetPath);
    }

    private resolveKeyPath(key: string): string {
        return join(this.basePath, key);
    }

    private isReadable(value: unknown): value is Readable {
        return (
            typeof value === 'object' &&
            value !== null &&
            typeof (value as Readable).pipe === 'function'
        );
    }
}
