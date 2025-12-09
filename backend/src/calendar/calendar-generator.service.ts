import { Injectable, Logger } from '@nestjs/common';
import {
    Account,
    CalendarEvent,
    CalendarEventStatus,
    CalendarEventTemplate,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CalendarRepository } from './calendar.repository';

type CalendarRuleConfig = {
    startDate?: string;
    startAt?: string;
    frequency?: 'once' | 'monthly' | 'yearly';
    interval?: number;
    durationDays?: number;
    durationHours?: number;
    until?: string;
};

interface SyncAccountParams {
    userId: string;
    accountId: string;
    windowStart?: Date;
    windowEnd?: Date;
}

@Injectable()
export class CalendarGeneratorService {
    private readonly logger = new Logger(CalendarGeneratorService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly repo: CalendarRepository,
    ) {}

    async syncAccountCalendar(params: SyncAccountParams): Promise<void> {
        const { userId, accountId } = params;
        const membership = await this.prisma.userAccount.findFirst({
            where: { userId, accountId },
            include: { account: true },
        });

        if (!membership) {
            return;
        }

        const profile = await this.prisma.userTaxProfile.findFirst({
            where: { userId, accountId },
            orderBy: { createdAt: 'desc' },
        });

        if (!profile) {
            return;
        }

        const rangeStart = params.windowStart ?? new Date();
        const rangeEnd = params.windowEnd ?? this.addMonths(rangeStart, 6);

        const templates = await this.repo.listActiveTemplates(
            profile.taxRegimeId,
        );

        for (const template of templates) {
            const occurrences = this.buildOccurrences(
                template,
                rangeStart,
                rangeEnd,
            );

            for (const occurrence of occurrences) {
                await this.upsertTemplateEvent(
                    membership.account,
                    userId,
                    template,
                    occurrence,
                );
            }
        }

        await this.syncAnalysisReminders(userId, accountId, rangeEnd);
    }

    private async upsertTemplateEvent(
        account: Account,
        userId: string,
        template: CalendarEventTemplate,
        occurrence: { startAt: Date; endAt: Date },
    ): Promise<CalendarEvent> {
        const existing = await this.repo.findTemplateEvent(
            account.id,
            userId,
            template.id,
            occurrence.startAt,
        );

        const title = template.description ?? template.code;
        const description = template.description ?? template.code;

        if (existing) {
            return (
                (await this.repo.updateEvent(
                    account.id,
                    userId,
                    existing.id,
                    {
                        title,
                        description,
                        startAt: occurrence.startAt,
                        endAt: occurrence.endAt,
                    },
                )) ?? existing
            );
        }

        return this.repo.createEvent({
            user: { connect: { id: userId } },
            account: { connect: { id: account.id } },
            template: { connect: { id: template.id } },
            title,
            description,
            startAt: occurrence.startAt,
            endAt: occurrence.endAt,
            status: CalendarEventStatus.UPCOMING,
        });
    }

    private buildOccurrences(
        template: CalendarEventTemplate,
        rangeStart: Date,
        rangeEnd: Date,
    ): Array<{ startAt: Date; endAt: Date }> {
        const rule = (template.ruleJson as unknown as CalendarRuleConfig) ?? {};
        const startString = rule.startAt ?? rule.startDate;
        if (!startString) {
            this.logger.warn(
                `Template ${template.code} has no start date in rule_json`,
            );
            return [];
        }

        const baseStart = new Date(startString);
        if (Number.isNaN(baseStart.getTime())) {
            this.logger.warn(
                `Template ${template.code} has invalid start date`,
            );
            return [];
        }

        const durationDays = this.asPositiveNumber(rule.durationDays, 1);
        const durationHours = this.asPositiveNumber(rule.durationHours, 0);
        const frequency: 'once' | 'monthly' | 'yearly' =
            rule.frequency &&
            ['once', 'monthly', 'yearly'].includes(rule.frequency)
                ? rule.frequency
                : 'yearly';
        const interval = this.asPositiveNumber(rule.interval, 1);
        const until = rule.until ? new Date(rule.until) : null;
        const windowEnd = until && until < rangeEnd ? until : rangeEnd;

        const occurrences: Array<{ startAt: Date; endAt: Date }> = [];

        let cursor = baseStart;
        while (cursor <= windowEnd) {
            if (cursor >= rangeStart && cursor <= windowEnd) {
                const endAt = this.addDuration(cursor, durationDays, durationHours);
                occurrences.push({ startAt: cursor, endAt });
            }

            if (frequency === 'once') {
                break;
            }

            cursor = this.advanceCursor(cursor, frequency, interval);

            if (!cursor || cursor.getTime() === baseStart.getTime()) {
                break;
            }
        }

        return occurrences;
    }

    private addDuration(
        startAt: Date,
        durationDays: number,
        durationHours: number,
    ): Date {
        const end = new Date(startAt);
        if (durationDays) {
            end.setDate(end.getDate() + durationDays);
        }
        if (durationHours) {
            end.setHours(end.getHours() + durationHours);
        }
        return end;
    }

    private advanceCursor(
        current: Date,
        frequency: 'once' | 'monthly' | 'yearly',
        interval: number,
    ): Date {
        if (frequency === 'monthly') {
            return this.addMonths(current, interval);
        }

        if (frequency === 'yearly') {
            return this.addYears(current, interval);
        }

        return current;
    }

    private addMonths(date: Date, months: number): Date {
        const next = new Date(date);
        next.setMonth(next.getMonth() + months);
        return next;
    }

    private addYears(date: Date, years: number): Date {
        const next = new Date(date);
        next.setFullYear(next.getFullYear() + years);
        return next;
    }

    private async syncAnalysisReminders(
        userId: string,
        accountId: string,
        windowEnd: Date,
    ): Promise<void> {
        // Placeholder for tasks/reminders generated from analyses or AI insights.
        void userId;
        void accountId;
        void windowEnd;
    }

    private asPositiveNumber(value: unknown, fallback: number): number {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }
}
