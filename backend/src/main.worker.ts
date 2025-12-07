import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';

async function bootstrap(): Promise<void> {
    await NestFactory.createApplicationContext(WorkerModule);
    Logger.log('Worker application is running and listening for jobs');
}

void bootstrap();
