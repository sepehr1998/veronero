import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUserSyncInterceptor } from './auth-user.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UsersModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        AuthUserSyncInterceptor,
        {
            provide: APP_INTERCEPTOR,
            useExisting: AuthUserSyncInterceptor,
        },
    ],
    exports: [JwtAuthGuard, AuthUserSyncInterceptor, AuthService],
})
export class AuthModule {}
