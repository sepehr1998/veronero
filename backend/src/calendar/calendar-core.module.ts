import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CalendarGeneratorService } from './calendar-generator.service';
import { CalendarRepository } from './calendar.repository';

@Module({
    imports: [DatabaseModule],
    providers: [CalendarRepository, CalendarGeneratorService],
    exports: [CalendarRepository, CalendarGeneratorService],
})
export class CalendarCoreModule {}
