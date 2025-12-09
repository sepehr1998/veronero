import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Account, LifeEventType, Prisma, UserLifeEvent } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateLifeEventDto } from './dto/create-life-event.dto';
import { LifeEventsRepository } from './life-events.repository';

export interface LifeEventResponse {
    id: string;
    userId: string;
    accountId: string;
    lifeEventTypeId: string;
    answersJson: Record<string, unknown>;
    occurredAt: Date;
    createdAt: Date;
    lifeEventType?: LifeEventType;
}

@Injectable()
export class LifeEventsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly repo: LifeEventsRepository,
    ) {}

    async listTypes(taxRegimeId: string): Promise<LifeEventType[]> {
        return this.repo.listTypes(taxRegimeId);
    }

    async createLifeEvent(
        userId: string,
        accountId: string,
        dto: CreateLifeEventDto,
    ): Promise<LifeEventResponse> {
        await this.assertAccountAccess(userId, accountId);
        if (!dto.lifeEventTypeId) {
            throw new BadRequestException('lifeEventTypeId is required');
        }
        if (!dto.occurredAt || Number.isNaN(Date.parse(dto.occurredAt))) {
            throw new BadRequestException('occurredAt must be a valid date');
        }
        if (!dto.answersJson || typeof dto.answersJson !== 'object') {
            throw new BadRequestException('answersJson must be an object');
        }

        const lifeEventType = await this.prisma.lifeEventType.findUnique({
            where: { id: dto.lifeEventTypeId },
        });
        if (!lifeEventType || !lifeEventType.isActive) {
            throw new NotFoundException('Life event type not found');
        }

        const created = await this.repo.createLifeEvent({
            user: { connect: { id: userId } },
            account: { connect: { id: accountId } },
            lifeEventType: { connect: { id: dto.lifeEventTypeId } },
            answersJson: dto.answersJson as unknown as Prisma.InputJsonValue,
            occurredAt: new Date(dto.occurredAt),
        });

        return this.mapLifeEvent(created);
    }

    async listLifeEvents(
        userId: string,
        accountId: string,
    ): Promise<LifeEventResponse[]> {
        await this.assertAccountAccess(userId, accountId);
        const events = await this.repo.listLifeEvents(accountId);
        return events.map((e) => this.mapLifeEvent(e));
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

    private mapLifeEvent(
        lifeEvent: UserLifeEvent & { lifeEventType?: LifeEventType },
    ): LifeEventResponse {
        return {
            id: lifeEvent.id,
            userId: lifeEvent.userId,
            accountId: lifeEvent.accountId,
            lifeEventTypeId: lifeEvent.lifeEventTypeId,
            answersJson:
                (lifeEvent.answersJson as Record<string, unknown>) ?? {},
            occurredAt: lifeEvent.occurredAt,
            createdAt: lifeEvent.createdAt,
            lifeEventType: lifeEvent.lifeEventType,
        };
    }
}
