import { Injectable } from '@nestjs/common';
import { DatabaseHealthService } from '../database/database-health.service';

export interface HealthResponse {
    status: 'ok' | 'error';
    checks: {
        database: 'up' | 'down';
    };
    details?: Record<string, unknown>;
}

@Injectable()
export class HealthService {
    constructor(private readonly databaseHealth: DatabaseHealthService) {}

    async check(): Promise<HealthResponse> {
        const databaseStatus = await this.databaseHealth.check();

        const status = databaseStatus.status === 'up' ? 'ok' : 'error';
        const details =
            databaseStatus.status === 'down' && databaseStatus.details
                ? { database: databaseStatus.details }
                : undefined;

        return {
            status,
            checks: {
                database: databaseStatus.status,
            },
            details,
        };
    }
}
