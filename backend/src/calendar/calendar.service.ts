import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    Account,
    CalendarEvent,
    CalendarEventStatus,
    CalendarEventTemplate,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CalendarGeneratorService } from './calendar-generator.service';
import { CalendarRepository } from './calendar.repository';
import { ListCalendarEventsDto } from './dto/list-calendar-events.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

export interface CalendarEventResponse {
    id: string;
    userId: string;
    accountId: string;
    templateId?: string | null;
    title: string;
    description: string | null;
    startAt: Date;
    endAt: Date;
    status: CalendarEventStatus;
    createdAt: Date;
    updatedAt: Date;
    template?: Pick<CalendarEventTemplate, 'id' | 'code' | 'description'>;
}

@Injectable()
export class CalendarService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly repo: CalendarRepository,
        private readonly generator: CalendarGeneratorService,
    ) {}

    async listEvents(
        userId: string,
        accountId: string,
        query: ListCalendarEventsDto,
    ): Promise<CalendarEventResponse[]> {
        await this.assertAccountAccess(userId, accountId);
        const { from, to, status } = this.parseListQuery(query);

        await this.generator.syncAccountCalendar({
            userId,
            accountId,
            windowStart: from,
            windowEnd: to,
        });

        const events = await this.repo.listEvents(accountId, userId, {
            from,
            to,
            status,
        });

        return events.map((event) => this.mapEvent(event));
    }

    async updateEvent(
        userId: string,
        accountId: string,
        eventId: string,
        dto: UpdateCalendarEventDto,
    ): Promise<CalendarEventResponse> {
        await this.assertAccountAccess(userId, accountId);
        const existing = await this.repo.findEvent(accountId, userId, eventId);

        if (!existing) {
            throw new NotFoundException('Calendar event not found');
        }

        const updatePayload = this.validateUpdatePayload(dto, existing);
        if (Object.keys(updatePayload).length === 0) {
            return this.mapEvent(existing);
        }

        const updated = await this.repo.updateEvent(
            accountId,
            userId,
            eventId,
            updatePayload,
        );

        if (!updated) {
            throw new NotFoundException('Calendar event not found');
        }

        return this.mapEvent(updated);
    }

    private async assertAccountAccess(
        userId: string,
        accountId: string,
    ): Promise<Account> {
        const membership = await this.prisma.userAccount.findFirst({
            where: { userId, accountId },
            include: { account: true },
        });

        if (!membership) {
            throw new ForbiddenException('Account not found for current user');
        }

        return membership.account;
    }

    private parseListQuery(query: ListCalendarEventsDto): {
        from?: Date;
        to?: Date;
        status?: CalendarEventStatus;
    } {
        let from: Date | undefined;
        let to: Date | undefined;
        let status: CalendarEventStatus | undefined;

        if (query.from) {
            const parsed = new Date(query.from);
            if (Number.isNaN(parsed.getTime())) {
                throw new BadRequestException('from must be a valid date');
            }
            from = parsed;
        }

        if (query.to) {
            const parsed = new Date(query.to);
            if (Number.isNaN(parsed.getTime())) {
                throw new BadRequestException('to must be a valid date');
            }
            to = parsed;
        }

        if (from && to && from > to) {
            throw new BadRequestException('from must be before to');
        }

        if (query.status) {
            const normalized = query.status.toUpperCase();
            if (!(normalized in CalendarEventStatus)) {
                throw new BadRequestException('Invalid status');
            }
            status =
                CalendarEventStatus[
                    normalized as keyof typeof CalendarEventStatus
                ];
        }

        return { from, to, status };
    }

    private validateUpdatePayload(
        dto: UpdateCalendarEventDto,
        existing: CalendarEvent,
    ): Record<string, unknown> {
        const payload: Record<string, unknown> = {};
        let nextStartAt: Date | undefined = existing.startAt;
        let nextEndAt: Date | undefined = existing.endAt;

        if (dto.title !== undefined) {
            if (dto.title === null || dto.title === '') {
                throw new BadRequestException('title cannot be empty');
            }
            payload.title = dto.title;
        }

        if (dto.description !== undefined) {
            payload.description = dto.description;
        }

        if (dto.startAt !== undefined) {
            const parsed = new Date(dto.startAt);
            if (Number.isNaN(parsed.getTime())) {
                throw new BadRequestException('startAt must be a valid date');
            }
            payload.startAt = parsed;
            nextStartAt = parsed;
        }

        if (dto.endAt !== undefined) {
            const parsed = new Date(dto.endAt);
            if (Number.isNaN(parsed.getTime())) {
                throw new BadRequestException('endAt must be a valid date');
            }
            payload.endAt = parsed;
            nextEndAt = parsed;
        }

        if (nextStartAt && nextEndAt) {
            if (nextStartAt.getTime() >= nextEndAt.getTime()) {
                throw new BadRequestException('endAt must be after startAt');
            }
        }

        if (dto.status !== undefined) {
            const normalized = dto.status.toUpperCase();
            if (!(normalized in CalendarEventStatus)) {
                throw new BadRequestException('Invalid status');
            }
            payload.status =
                CalendarEventStatus[
                    normalized as keyof typeof CalendarEventStatus
                ];
        }

        return payload;
    }

    private mapEvent(
        event: CalendarEvent & { template?: CalendarEventTemplate | null },
    ): CalendarEventResponse {
        return {
            id: event.id,
            userId: event.userId,
            accountId: event.accountId,
            templateId: event.templateId,
            title: event.title,
            description: event.description,
            startAt: event.startAt,
            endAt: event.endAt,
            status: event.status,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            template: event.template
                ? {
                      id: event.template.id,
                      code: event.template.code,
                      description: event.template.description,
                  }
                : undefined,
        };
    }
}
