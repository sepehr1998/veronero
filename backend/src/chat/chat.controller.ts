import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('accounts/:accountId/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('sessions')
    async createSession(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Body() payload: CreateChatSessionDto,
    ) {
        return this.chatService.createSession(user.id, accountId, payload);
    }

    @Get('sessions')
    async listSessions(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
    ) {
        return this.chatService.listSessions(user.id, accountId);
    }

    @Get('sessions/:sessionId/messages')
    async listMessages(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('sessionId') sessionId: string,
    ) {
        return this.chatService.listMessages(user.id, accountId, sessionId);
    }

    @Post('sessions/:sessionId/messages')
    async postMessage(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('sessionId') sessionId: string,
        @Body() payload: CreateChatMessageDto,
    ) {
        return this.chatService.postMessage(
            user.id,
            accountId,
            sessionId,
            payload,
        );
    }
}
