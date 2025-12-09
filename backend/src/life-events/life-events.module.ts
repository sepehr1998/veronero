import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LifeEventsController } from './life-events.controller';
import { LifeEventsService } from './life-events.service';
import { LifeEventsRepository } from './life-events.repository';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [LifeEventsController],
    providers: [LifeEventsService, LifeEventsRepository],
    exports: [LifeEventsService],
})
export class LifeEventsModule {}
