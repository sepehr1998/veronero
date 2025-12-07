import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesDto } from './dto/list-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('accounts/:accountId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}

    @Post()
    async createExpense(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Body() payload: CreateExpenseDto,
    ) {
        return this.expensesService.createExpense(
            user.id,
            accountId,
            payload,
        );
    }

    @Get()
    async listExpenses(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Query() query: ListExpensesDto,
    ) {
        return this.expensesService.listExpenses(user.id, accountId, query);
    }

    @Get(':expenseId')
    async getExpense(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('expenseId') expenseId: string,
    ) {
        return this.expensesService.getExpense(user.id, accountId, expenseId);
    }

    @Patch(':expenseId')
    async updateExpense(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('expenseId') expenseId: string,
        @Body() payload: UpdateExpenseDto,
    ) {
        return this.expensesService.updateExpense(
            user.id,
            accountId,
            expenseId,
            payload,
        );
    }

    @Delete(':expenseId')
    async deleteExpense(
        @AuthUser() user: User,
        @Param('accountId') accountId: string,
        @Param('expenseId') expenseId: string,
    ) {
        await this.expensesService.deleteExpense(
            user.id,
            accountId,
            expenseId,
        );
        return { success: true };
    }
}
