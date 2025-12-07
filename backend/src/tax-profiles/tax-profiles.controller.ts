import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveAccountId } from './active-account.decorator';
import { TaxProfilesService, TaxProfileResponse } from './tax-profiles.service';
import type { UpdateTaxProfileDto } from './dto/update-tax-profile.dto';

@Controller('tax-profiles')
@UseGuards(JwtAuthGuard)
export class TaxProfilesController {
    constructor(private readonly taxProfilesService: TaxProfilesService) {}

    @Get('current')
    async getCurrentProfile(
        @AuthUser() user: User,
        @ActiveAccountId() accountId?: string,
    ): Promise<TaxProfileResponse | null> {
        if (!accountId) {
            throw new BadRequestException('Active account is required');
        }

        return this.taxProfilesService.getCurrentProfile(user.id, accountId);
    }

    @Patch('current')
    async updateCurrentProfile(
        @AuthUser() user: User,
        @ActiveAccountId() accountId: string | undefined,
        @Body() payload: UpdateTaxProfileDto,
    ): Promise<TaxProfileResponse> {
        if (!accountId) {
            throw new BadRequestException('Active account is required');
        }

        return this.taxProfilesService.updateCurrentProfile(
            user.id,
            accountId,
            payload,
        );
    }
}
