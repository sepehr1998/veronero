import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLifeEventDto } from './dto/create-life-event.dto';
import { LifeEventsService } from './life-events.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class LifeEventsController {
    constructor(private readonly service: LifeEventsService) {}

    @Get('tax-regimes/:taxRegimeId/life-event-types')
    async listTypes(@Param('taxRegimeId') taxRegimeId: string) {
        return this.service.listTypes(taxRegimeId);
    }

    @Post('accounts/:accountId/life-events')
    async createLifeEvent(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Body() payload: CreateLifeEventDto,
    ) {
        return this.service.createLifeEvent(user.id, accountId, payload);
    }

    @Get('accounts/:accountId/life-events')
    async listLifeEvents(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
    ) {
        return this.service.listLifeEvents(user.id, accountId);
    }
}
