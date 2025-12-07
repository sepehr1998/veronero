import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SCENARIO_QUEUE } from '../queue/queue.constants';

export interface TaxScenarioJobData {
    scenario_id: string;
}

@Injectable()
export class TaxScenarioQueueService {
    constructor(@InjectQueue(SCENARIO_QUEUE) private readonly queue: Queue) {}

    async enqueueCalculateScenario(scenarioId: string): Promise<void> {
        await this.queue.add('calculate-scenario', { scenario_id: scenarioId });
    }
}
