import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { AiModule } from '../ai/ai.module';
import { BullModule } from '@nestjs/bullmq';
import { SCENARIO_QUEUE } from '../queue/queue.constants';
import { TaxScenariosController } from './tax-scenarios.controller';
import { TaxScenariosService } from './tax-scenarios.service';
import { TaxScenariosRepository } from './tax-scenarios.repository';
import { TaxScenarioQueueService } from './tax-scenario-queue.service';
import { TaxCalculationService } from './tax-calculation.service';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        AiModule,
        BullModule.registerQueue({ name: SCENARIO_QUEUE }),
    ],
    controllers: [TaxScenariosController],
    providers: [
        TaxScenariosService,
        TaxScenariosRepository,
        TaxScenarioQueueService,
        TaxCalculationService,
    ],
    exports: [TaxScenariosService, TaxScenarioQueueService, TaxCalculationService],
})
export class TaxScenariosModule {}
