import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfirmReceiptDto } from './dto/confirm-receipt.dto';
import { ReceiptsService } from './receipts.service';

@Controller('accounts/:accountId/receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
    constructor(private readonly receiptsService: ReceiptsService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async uploadReceipt(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.receiptsService.uploadReceipt({
            userId: user.id,
            accountId,
            file: {
                fileName: file.originalname,
                buffer: file.buffer,
            },
        });
    }

    @Get(':id')
    async getReceipt(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('id') receiptId: string,
    ) {
        return this.receiptsService.getReceipt(user.id, accountId, receiptId);
    }

    @Post(':id/confirm')
    async confirmReceipt(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('id') receiptId: string,
        @Body() payload: ConfirmReceiptDto,
    ) {
        return this.receiptsService.confirmReceipt(
            user.id,
            accountId,
            receiptId,
            payload,
        );
    }
}
