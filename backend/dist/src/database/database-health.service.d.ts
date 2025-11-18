import { PrismaService } from './prisma.service';
export interface DatabaseHealthStatus {
    status: 'up' | 'down';
    details?: string;
}
export declare class DatabaseHealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<DatabaseHealthStatus>;
}
