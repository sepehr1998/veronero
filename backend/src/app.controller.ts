import { Controller, Get, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { AppService } from './app.service';
import { AuthUser } from './auth/auth-user.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@AuthUser() user: User): User {
        return user;
    }
}
