import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { TaxProfilesController } from './tax-profiles.controller';
import { TaxProfilesService } from './tax-profiles.service';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [TaxProfilesController],
    providers: [TaxProfilesService],
    exports: [TaxProfilesService],
})
export class TaxProfilesModule {}
