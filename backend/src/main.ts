import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { auth } from 'express-openid-connect';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const baseUrl = configService.getOrThrow<string>('auth.baseUrl');
    const clientId = configService.getOrThrow<string>('auth.clientId');
    const clientSecret =
        configService.getOrThrow<string>('auth.clientSecret');
    const issuerBaseURL =
        configService.getOrThrow<string>('auth.issuerBaseUrl');
    const sessionSecret =
        configService.getOrThrow<string>('auth.sessionSecret');
    const audience = configService.getOrThrow<string>('auth.audience');
    const callbackUrl = new URL('/auth/callback', baseUrl).toString();

    app.use(
        auth({
            authRequired: false,
            auth0Logout: true,
            baseURL: baseUrl,
            clientID: clientId,
            clientSecret,
            issuerBaseURL,
            secret: sessionSecret,
            authorizationParams: {
                response_type: 'code',
                response_mode: 'query',
                scope: 'openid profile email',
                audience,
                redirect_uri: callbackUrl,
            },
            routes: {
                login: false,
                logout: false,
                callback: false,
            },
        }),
    );

    const port = configService.get<number>('app.port') ?? 3000;
    await app.listen(port);
}
void bootstrap();
