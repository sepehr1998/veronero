import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ExpensesController } from './expenses.controller';
import { ExpensesRepository } from './expenses.repository';
import { ExpensesService } from './expenses.service';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [ExpensesController],
    providers: [ExpensesService, ExpensesRepository],
    exports: [ExpensesService],
})
export class ExpensesModule {}
