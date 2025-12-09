import { CalendarEventStatus } from '@prisma/client';

export class UpdateCalendarEventDto {
    title?: string;
    description?: string | null;
    startAt?: string;
    endAt?: string;
    status?: CalendarEventStatus | string;
}
