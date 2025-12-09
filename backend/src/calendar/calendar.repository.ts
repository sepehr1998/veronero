import { Injectable } from '@nestjs/common';
import {
    CalendarEvent,
    CalendarEventStatus,
    CalendarEventTemplate,
    Prisma,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface CalendarEventFilters {
    from?: Date;
    to?: Date;
    status?: CalendarEventStatus;
}

@Injectable()
export class CalendarRepository {
    constructor(private readonly prisma: PrismaService) {}

    async listEvents(
        accountId: string,
        userId: string,
        filters: CalendarEventFilters,
    ): Promise<(CalendarEvent & { template?: CalendarEventTemplate | null })[]> {
        const dateFilter =
            filters.from || filters.to
                ? {
                      ...(filters.from ? { gte: filters.from } : null),
                      ...(filters.to ? { lte: filters.to } : null),
                  }
                : undefined;

        return this.prisma.calendarEvent.findMany({
            where: {
                accountId,
                userId,
                ...(filters.status ? { status: filters.status } : null),
                ...(dateFilter ? { startAt: dateFilter } : null),
            },
            include: { template: true },
            orderBy: { startAt: 'asc' },
        });
    }

    async findEvent(
        accountId: string,
        userId: string,
        eventId: string,
    ): Promise<CalendarEvent | null> {
        return this.prisma.calendarEvent.findFirst({
            where: { id: eventId, accountId, userId },
        });
    }

    async updateEvent(
        accountId: string,
        userId: string,
        eventId: string,
        data: Prisma.CalendarEventUpdateInput,
    ): Promise<CalendarEvent | null> {
        const updated = await this.prisma.calendarEvent.updateMany({
            where: { id: eventId, accountId, userId },
            data,
        });

        if (updated.count === 0) {
            return null;
        }

        return this.findEvent(accountId, userId, eventId);
    }

    async createEvent(
        data: Prisma.CalendarEventCreateInput,
    ): Promise<CalendarEvent> {
        return this.prisma.calendarEvent.create({ data });
    }

    async findTemplateEvent(
        accountId: string,
        userId: string,
        templateId: string,
        startAt: Date,
    ): Promise<CalendarEvent | null> {
        return this.prisma.calendarEvent.findFirst({
            where: { accountId, userId, templateId, startAt },
        });
    }

    async listActiveTemplates(
        taxRegimeId: string,
    ): Promise<CalendarEventTemplate[]> {
        return this.prisma.calendarEventTemplate.findMany({
            where: { taxRegimeId, isActive: true },
            orderBy: { code: 'asc' },
        });
    }
}
