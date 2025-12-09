import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    Account,
    AiCallPurpose,
    CalendarEventStatus,
    ChatMessage,
    ChatMessageSender,
    ChatSession,
    Prisma,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { AiChatService, ChatMessage as AiChatMessage } from '../ai/ai-chat.service';
import { PrismaService } from '../database/prisma.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

export interface ChatSessionResponse {
    id: string;
    userId: string;
    accountId: string;
    taxRegimeId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatMessageResponse {
    id: string;
    sessionId: string;
    sender: ChatMessageSender;
    messageText: string;
    metadataJson: Prisma.JsonValue | null;
    createdAt: Date;
}

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aiChatService: AiChatService,
    ) {}

    async createSession(
        userId: string,
        accountId: string,
        payload: CreateChatSessionDto,
    ): Promise<ChatSessionResponse> {
        const account = await this.assertAccountAccess(userId, accountId);
        if (!payload.taxRegimeId) {
            throw new BadRequestException('taxRegimeId is required');
        }

        const taxRegime = await this.validateTaxRegime(
            payload.taxRegimeId,
            account.countryCode,
        );

        const session = await this.prisma.chatSession.create({
            data: {
                id: randomUUID(),
                userId,
                accountId,
                taxRegimeId: taxRegime.id,
                title: payload.title || 'Chat session',
            },
        });

        return this.mapSession(session);
    }

    async listSessions(
        userId: string,
        accountId: string,
    ): Promise<ChatSessionResponse[]> {
        await this.assertAccountAccess(userId, accountId);
        const sessions = await this.prisma.chatSession.findMany({
            where: { userId, accountId },
            orderBy: { createdAt: 'desc' },
        });
        return sessions.map((s) => this.mapSession(s));
    }

    async listMessages(
        userId: string,
        accountId: string,
        sessionId: string,
    ): Promise<ChatMessageResponse[]> {
        await this.assertSessionAccess(userId, accountId, sessionId);
        const messages = await this.prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
        return messages.map((m) => this.mapMessage(m));
    }

    async postMessage(
        userId: string,
        accountId: string,
        sessionId: string,
        payload: CreateChatMessageDto,
    ): Promise<ChatMessageResponse> {
        if (!payload.messageText || payload.messageText.trim().length === 0) {
            throw new BadRequestException('messageText is required');
        }

        const session = await this.assertSessionAccess(
            userId,
            accountId,
            sessionId,
        );

        const userMessage = await this.prisma.chatMessage.create({
            data: {
                id: randomUUID(),
                sessionId,
                sender: ChatMessageSender.USER,
                messageText: payload.messageText,
            },
        });

        const context = await this.buildContext(userId, accountId);
        const history = await this.loadRecentHistory(sessionId);

        const aiMessages: AiChatMessage[] = [
            ...history
                .filter(
                    (m) =>
                        m.sender === ChatMessageSender.USER ||
                        m.sender === ChatMessageSender.ASSISTANT,
                )
                .map((m): AiChatMessage => ({
                    role:
                        m.sender === ChatMessageSender.USER
                            ? 'user'
                            : 'assistant',
                    content: m.messageText,
                })),
            { role: 'user', content: payload.messageText },
        ];

        const aiResponse = await this.aiChatService.chat({
            messages: aiMessages,
            context: {
                domain: context,
                account: { id: accountId },
                user: { id: userId },
            },
        });

        const assistantMessage = await this.prisma.chatMessage.create({
            data: {
                id: randomUUID(),
                sessionId,
                sender: ChatMessageSender.ASSISTANT,
                messageText: aiResponse.message,
                metadataJson: {
                    suggestions: aiResponse.suggestions,
                    context,
                } as Prisma.InputJsonValue,
            },
        });

        await this.prisma.aiCallLog.create({
            data: {
                id: randomUUID(),
                userId,
                purpose: AiCallPurpose.CHAT,
                modelName: aiResponse.model ?? 'stub',
                tokenUsageJson: aiResponse.tokenUsage ?? {
                    promptTokens: 0,
                    completionTokens: 0,
                },
            },
        });

        return this.mapMessage(assistantMessage);
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

    private async assertSessionAccess(
        userId: string,
        accountId: string,
        sessionId: string,
    ): Promise<ChatSession> {
        await this.assertAccountAccess(userId, accountId);
        const session = await this.prisma.chatSession.findFirst({
            where: { id: sessionId, accountId, userId },
        });

        if (!session) {
            throw new NotFoundException('Chat session not found');
        }

        return session;
    }

    private async validateTaxRegime(
        taxRegimeId: string,
        countryCode?: string,
    ) {
        const taxRegime = await this.prisma.taxRegime.findFirst({
            where: {
                id: taxRegimeId,
                isActive: true,
                ...(countryCode ? { countryCode } : null),
            },
        });

        if (!taxRegime) {
            throw new NotFoundException('Tax regime is not valid for account');
        }

        return taxRegime;
    }

    private async buildContext(userId: string, accountId: string) {
        const [profile, taxCard, expensesTotal, scenarioCount] =
            await this.prisma.$transaction([
                this.prisma.userTaxProfile.findFirst({
                    where: { userId, accountId },
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.taxCard.findFirst({
                    where: { userId, accountId },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        parsed: true,
                    },
                }),
                this.prisma.expense.aggregate({
                    where: { accountId },
                    _sum: { amount: true },
                }),
                this.prisma.taxScenario.count({
                    where: { accountId },
                }),
            ]);

        const upcomingEvents = await this.prisma.calendarEvent.findMany({
            where: {
                accountId,
                userId,
                status: CalendarEventStatus.UPCOMING,
                startAt: { gte: new Date() },
            },
            orderBy: { startAt: 'asc' },
            take: 3,
            include: { template: true },
        });

        return {
            taxProfile: profile
                ? {
                      taxRegimeId: profile.taxRegimeId,
                      occupation: profile.occupation,
                      profileDataJson: profile.profileDataJson,
                  }
                : null,
            latestTaxCard: taxCard
                ? {
                      id: taxCard.id,
                      status: taxCard.status,
                      createdAt: taxCard.createdAt,
                      parsed: taxCard.parsed
                          ? {
                                incomeLimit:
                                    taxCard.parsed.incomeLimit.toString(),
                                withholdingPercentage:
                                    taxCard.parsed.withholdingPercentage.toString(),
                            }
                          : null,
                  }
                : null,
            expensesSummary: {
                total: expensesTotal._sum.amount?.toString() ?? '0',
            },
            scenarioSummary: { count: scenarioCount },
            upcomingEvents: upcomingEvents.map((e) => ({
                title: e.title,
                startAt: e.startAt,
                templateCode: e.template?.code,
            })),
        };
    }

    private async loadRecentHistory(
        sessionId: string,
    ): Promise<ChatMessage[]> {
        return this.prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            take: 20,
        });
    }

    private mapSession(session: ChatSession): ChatSessionResponse {
        return {
            id: session.id,
            userId: session.userId,
            accountId: session.accountId,
            taxRegimeId: session.taxRegimeId,
            title: session.title,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
    }

    private mapMessage(message: ChatMessage): ChatMessageResponse {
        return {
            id: message.id,
            sessionId: message.sessionId,
            sender: message.sender,
            messageText: message.messageText,
            metadataJson: message.metadataJson as Prisma.JsonValue,
            createdAt: message.createdAt,
        };
    }
}
