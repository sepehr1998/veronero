import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { ListCalendarEventsDto } from './dto/list-calendar-events.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Controller('accounts/:accountId/calendar/events')
@UseGuards(JwtAuthGuard)
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @Get()
    async listEvents(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Query() query: ListCalendarEventsDto,
    ) {
        return this.calendarService.listEvents(user.id, accountId, query);
    }

    @Patch(':eventId')
    async updateEvent(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('eventId') eventId: string,
        @Body() payload: UpdateCalendarEventDto,
    ) {
        return this.calendarService.updateEvent(
            user.id,
            accountId,
            eventId,
            payload,
        );
    }
}
