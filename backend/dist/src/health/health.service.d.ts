import { DatabaseHealthService } from '../database/database-health.service';
export interface HealthResponse {
    status: 'ok' | 'error';
    checks: {
        database: 'up' | 'down';
    };
    details?: Record<string, unknown>;
}
export declare class HealthService {
    private readonly databaseHealth;
    constructor(databaseHealth: DatabaseHealthService);
    check(): Promise<HealthResponse>;
}
