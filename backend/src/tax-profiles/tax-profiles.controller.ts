import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Patch,
    Param,
    UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaxProfilesService, TaxProfileResponse } from './tax-profiles.service';
import type { UpdateTaxProfileDto } from './dto/update-tax-profile.dto';

@Controller('accounts/:accountId/tax-profiles')
@UseGuards(JwtAuthGuard)
export class TaxProfilesController {
    constructor(private readonly taxProfilesService: TaxProfilesService) {}

    @Get('current')
    async getCurrentProfile(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
    ): Promise<TaxProfileResponse | null> {
        return this.taxProfilesService.getCurrentProfile(user.id, accountId);
    }

    @Patch('current')
    async updateCurrentProfile(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Body() payload: UpdateTaxProfileDto,
    ): Promise<TaxProfileResponse> {
        return this.taxProfilesService.updateCurrentProfile(
            user.id,
            accountId,
            payload,
        );
    }
}
