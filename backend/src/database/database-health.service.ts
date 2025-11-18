import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export interface DatabaseHealthStatus {
    status: 'up' | 'down';
    details?: string;
}

@Injectable()
export class DatabaseHealthService {
    constructor(private readonly prisma: PrismaService) {}

    async check(): Promise<DatabaseHealthStatus> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return { status: 'up' };
        } catch (error) {
            return {
                status: 'down',
                details:
                    error instanceof Error
                        ? error.message
                        : 'Unknown database error',
            };
        }
    }
}
