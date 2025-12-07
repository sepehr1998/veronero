import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import type { Readable } from 'stream';
import type { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveAccountId } from '../tax-profiles/active-account.decorator';
import type { TaxCardResponse } from './tax-cards.service';
import { TaxCardsService } from './tax-cards.service';

@Controller('tax-cards')
@UseGuards(JwtAuthGuard)
export class TaxCardsController {
    constructor(private readonly taxCardsService: TaxCardsService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async uploadTaxCard(
        @AuthUser() user: User,
        @ActiveAccountId() accountId: string | undefined,
        @UploadedFile() file: Express.Multer.File,
        @Body('taxRegimeId') taxRegimeId?: string,
    ): Promise<TaxCardResponse> {
        if (!accountId) {
            throw new BadRequestException('Active account is required');
        }

        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!taxRegimeId) {
            throw new BadRequestException('taxRegimeId is required');
        }

        if (!this.isPdf(file)) {
            throw new BadRequestException('Only PDF files are supported');
        }

        return this.taxCardsService.uploadTaxCard({
            userId: user.id,
            accountId,
            taxRegimeId,
            file: {
                fileName: file.originalname,
                buffer: file.buffer,
            },
        });
    }

    @Get()
    async listTaxCards(
        @AuthUser() user: User,
        @ActiveAccountId() accountId: string | undefined,
    ): Promise<TaxCardResponse[]> {
        if (!accountId) {
            throw new BadRequestException('Active account is required');
        }

        return this.taxCardsService.listTaxCardsForAccount(user.id, accountId);
    }

    @Get(':id/file')
    async getTaxCardFile(
        @AuthUser() user: User,
        @Param('id') taxCardId: string,
    ): Promise<StreamableFile> {
        const { stream, fileName } =
            await this.taxCardsService.getTaxCardFileStream(
                user.id,
                taxCardId,
            );

        return new StreamableFile(stream as Readable, {
            disposition: `inline; filename="${fileName}"`,
        });
    }

    @Get(':id')
    async getTaxCard(
        @AuthUser() user: User,
        @Param('id') taxCardId: string,
    ): Promise<ReturnType<TaxCardsService['getTaxCardWithParsed']>> {
        return this.taxCardsService.getTaxCardWithParsed(user.id, taxCardId);
    }

    @Get(':id/analysis/latest')
    async getLatestAnalysis(
        @AuthUser() user: User,
        @Param('id') taxCardId: string,
    ): Promise<ReturnType<TaxCardsService['getLatestAnalysis']>> {
        return this.taxCardsService.getLatestAnalysis(user.id, taxCardId);
    }

    private isPdf(file: Express.Multer.File): boolean {
        return (
            file.mimetype === 'application/pdf' ||
            file.originalname.toLowerCase().endsWith('.pdf')
        );
    }
}
