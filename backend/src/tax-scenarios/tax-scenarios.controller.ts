import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalculateTaxScenarioDto } from './dto/calculate-tax-scenario.dto';
import { CreateTaxScenarioDto } from './dto/create-tax-scenario.dto';
import { UpdateTaxScenarioDto } from './dto/update-tax-scenario.dto';
import { TaxScenariosService } from './tax-scenarios.service';

@Controller('accounts/:accountId/tax-scenarios')
@UseGuards(JwtAuthGuard)
export class TaxScenariosController {
    constructor(private readonly service: TaxScenariosService) {}

    @Post()
    async create(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Body() payload: CreateTaxScenarioDto,
    ) {
        return this.service.create(user.id, accountId, payload);
    }

    @Get()
    async list(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
    ) {
        return this.service.list(user.id, accountId);
    }

    @Get(':scenarioId')
    async get(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('scenarioId') scenarioId: string,
    ) {
        return this.service.get(user.id, accountId, scenarioId);
    }

    @Patch(':scenarioId')
    async update(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('scenarioId') scenarioId: string,
        @Body() payload: UpdateTaxScenarioDto,
    ) {
        return this.service.update(user.id, accountId, scenarioId, payload);
    }

    @Delete(':scenarioId')
    async delete(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('scenarioId') scenarioId: string,
    ) {
        await this.service.delete(user.id, accountId, scenarioId);
        return { success: true };
    }

    @Post(':scenarioId/calculate')
    async calculate(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('scenarioId') scenarioId: string,
        @Body() payload: CalculateTaxScenarioDto,
    ) {
        return this.service.calculate(user.id, accountId, scenarioId, payload);
    }

    @Get(':scenarioId/results')
    async getResults(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('scenarioId') scenarioId: string,
    ) {
        const scenario = await this.service.get(user.id, accountId, scenarioId);
        return scenario.results;
    }

    @Get(':scenarioId/recommendations')
    async getRecommendations(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('scenarioId') scenarioId: string,
    ) {
        const scenario = await this.service.get(user.id, accountId, scenarioId);
        return scenario.recommendations;
    }
}
