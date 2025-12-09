import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { DatabaseModule } from '../database/database.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [DatabaseModule, AuthModule, AiModule],
    controllers: [ChatController],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule {}
