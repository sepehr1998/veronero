import { Module } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { AiReceiptService } from './ai-receipt.service';
import { AiScenarioService } from './ai-scenario.service';
import { AiTaxCardService } from './ai-tax-card.service';

@Module({
    providers: [
        AiTaxCardService,
        AiReceiptService,
        AiScenarioService,
        AiChatService,
    ],
    exports: [
        AiTaxCardService,
        AiReceiptService,
        AiScenarioService,
        AiChatService,
    ],
})
export class AiModule {}
