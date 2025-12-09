import { Injectable } from '@nestjs/common';
import { Prisma, LifeEventType, UserLifeEvent } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LifeEventsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async listTypes(taxRegimeId: string): Promise<LifeEventType[]> {
        return this.prisma.lifeEventType.findMany({
            where: { taxRegimeId, isActive: true },
            orderBy: { displayName: 'asc' },
        });
    }

    async createLifeEvent(
        data: Prisma.UserLifeEventCreateInput,
    ): Promise<UserLifeEvent> {
        return this.prisma.userLifeEvent.create({ data });
    }

    async listLifeEvents(accountId: string): Promise<UserLifeEvent[]> {
        return this.prisma.userLifeEvent.findMany({
            where: { accountId },
            orderBy: { occurredAt: 'desc' },
            include: { lifeEventType: true },
        });
    }
}
