import { Injectable, Logger } from '@nestjs/common';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

export interface ChatSuggestion {
    type: string;
    title?: string;
    payload?: Record<string, unknown>;
}

export interface ChatContext {
    user?: Record<string, unknown>;
    account?: Record<string, unknown>;
    domain?: Record<string, unknown>;
}

export interface ChatResponse {
    message: string;
    suggestions?: ChatSuggestion[];
    model?: string;
    tokenUsage?: { promptTokens: number; completionTokens: number };
}

@Injectable()
export class AiChatService {
    private readonly logger = new Logger(AiChatService.name);

    async chat(params: {
        messages: ChatMessage[];
        context?: ChatContext;
    }): Promise<ChatResponse> {
        const { messages, context } = params;
        this.logger.debug(
            `Stub chat invoked with ${messages.length} messages and context keys: ${Object.keys(
                context ?? {},
            ).join(',')}`,
        );

        const lastUserMessage = [...messages]
            .reverse()
            .find((m) => m.role === 'user');
        const summary = context?.domain
            ? `\n\nContext summary: ${JSON.stringify(context.domain).slice(
                  0,
                  500,
              )}`
            : '';
        const message = `Echo: ${lastUserMessage?.content ?? 'No input'}${summary}`;

        const suggestions: ChatSuggestion[] = [
            {
                type: 'open_expenses',
                title: 'Open expenses manager',
            },
        ];

        return {
            message,
            suggestions,
            model: 'stub-llm',
            tokenUsage: { promptTokens: 0, completionTokens: 0 },
        };
    }
}
