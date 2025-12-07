"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ai_config_1 = __importDefault(require("./config/ai.config"));
const app_config_1 = __importDefault(require("./config/app.config"));
const auth_config_1 = __importDefault(require("./config/auth.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
const env_validation_1 = require("./config/env.validation");
const queue_config_1 = __importDefault(require("./config/queue.config"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
const storage_config_1 = __importDefault(require("./config/storage.config"));
const storage_module_1 = require("./storage/storage.module");
const auth_module_1 = require("./auth/auth.module");
const database_module_1 = require("./database/database.module");
const health_module_1 = require("./health/health.module");
const queue_module_1 = require("./queue/queue.module");
const redis_module_1 = require("./redis/redis.module");
const tax_profiles_module_1 = require("./tax-profiles/tax-profiles.module");
const tax_cards_module_1 = require("./tax-cards/tax-cards.module");
const expenses_module_1 = require("./expenses/expenses.module");
const receipts_module_1 = require("./receipts/receipts.module");
const tax_scenarios_module_1 = require("./tax-scenarios/tax-scenarios.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                cache: true,
                expandVariables: true,
                envFilePath: ['.env.local', '.env'],
                isGlobal: true,
                load: [
                    app_config_1.default,
                    database_config_1.default,
                    redis_config_1.default,
                    queue_config_1.default,
                    auth_config_1.default,
                    ai_config_1.default,
                    storage_config_1.default,
                ],
                validationSchema: env_validation_1.envValidationSchema,
            }),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            queue_module_1.QueueModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            storage_module_1.StorageModule,
            tax_profiles_module_1.TaxProfilesModule,
            tax_cards_module_1.TaxCardsModule,
            expenses_module_1.ExpensesModule,
            receipts_module_1.ReceiptsModule,
            tax_scenarios_module_1.TaxScenariosModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map