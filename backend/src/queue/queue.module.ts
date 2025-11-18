import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const redisUrl = new URL(
                    configService.getOrThrow<string>('redis.url'),
                );
                const dbPath = redisUrl.pathname.replace('/', '');
                const db = dbPath ? Number(dbPath) : undefined;

                return {
                    prefix: configService.get<string>('queue.prefix'),
                    connection: {
                        host: redisUrl.hostname,
                        port: Number(redisUrl.port || 6379),
                        username: redisUrl.username || undefined,
                        password: redisUrl.password || undefined,
                        db: Number.isNaN(db) ? undefined : db,
                        tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
                    },
                };
            },
        }),
    ],
    exports: [BullModule],
})
export class QueueModule {}
