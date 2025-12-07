import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiChatService {
    private readonly logger = new Logger(AiChatService.name);

    async chat(
        messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    ): Promise<string> {
        this.logger.debug(`Stub chat with ${messages.length} messages`);
        const last = messages[messages.length - 1];
        return `Echo: ${last?.content ?? 'No input'}`;
    }
}
