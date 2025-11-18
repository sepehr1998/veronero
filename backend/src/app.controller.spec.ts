import { Test, TestingModule } from '@nestjs/testing';
import type { User } from '@prisma/client';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });

    describe('me', () => {
        it('should return auth user payload', () => {
            const mockUser = {
                id: 'user-1',
                auth0Id: 'auth0|123',
                email: 'test@example.com',
                fullName: 'Test User',
                locale: null,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as User;

            expect(appController.getProfile(mockUser)).toEqual(mockUser);
        });
    });
});
