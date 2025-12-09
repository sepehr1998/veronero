"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    configService;
    usersService;
    baseUrl;
    callbackUrl;
    baseOrigin;
    audience;
    defaultScope = 'openid profile email';
    allowedReturnOrigins;
    constructor(configService, usersService) {
        this.configService = configService;
        this.usersService = usersService;
        this.baseUrl = this.configService.getOrThrow('auth.baseUrl');
        this.baseOrigin = new URL(this.baseUrl).origin;
        this.callbackUrl = new URL('/auth/callback', this.baseUrl).toString();
        this.audience = this.configService.getOrThrow('auth.audience');
        const configuredOrigins = this.configService.get('auth.allowedReturnOrigins') ?? [];
        this.allowedReturnOrigins = new Set(configuredOrigins
            .map((origin) => {
            try {
                return new URL(origin).origin;
            }
            catch {
                return null;
            }
        })
            .filter((value) => Boolean(value)));
    }
    async login(res, options) {
        await res.oidc.login({
            returnTo: this.normalizeReturnPath(options?.returnTo),
            authorizationParams: {
                redirect_uri: this.callbackUrl,
                scope: this.defaultScope,
                audience: this.audience,
                ...(options?.prompt ? { prompt: options.prompt } : null),
            },
        });
    }
    async logout(res, returnTo) {
        await res.oidc.logout({
            returnTo: this.normalizeReturnPath(returnTo),
        });
    }
    async handleCallback(res) {
        await res.oidc.callback({
            redirectUri: this.callbackUrl,
        });
    }
    async getSession(req) {
        const isAuthenticated = req.oidc?.isAuthenticated?.() ?? false;
        if (!isAuthenticated || !req.oidc.user) {
            return {
                isAuthenticated: false,
                user: null,
                auth0Profile: null,
            };
        }
        const payload = req.oidc.user;
        if (!payload.sub) {
            throw new common_1.UnauthorizedException('Missing subject claim in user');
        }
        const user = await this.usersService.syncFromAuth0Payload(payload);
        let memberships = await this.usersService.listUserAccounts(user.id);
        if (memberships.length === 0) {
            const created = await this.usersService.ensureDefaultAccountForUser(user);
            if (created) {
                memberships = await this.usersService.listUserAccounts(user.id);
            }
        }
        const accounts = memberships.map((membership) => ({
            accountId: membership.account.id,
            name: membership.account.name,
            countryCode: membership.account.countryCode,
            type: membership.account.type,
            role: membership.role,
        }));
        const defaultAccountId = accounts[0]?.accountId ?? null;
        return {
            isAuthenticated: true,
            user: this.mapUser(user),
            auth0Profile: this.mapAuth0Profile(payload),
            accounts,
            defaultAccountId,
        };
    }
    normalizeReturnPath(value) {
        if (!value) {
            return '/';
        }
        try {
            const resolvedUrl = new URL(value, this.baseUrl);
            const origin = resolvedUrl.origin;
            if (origin === this.baseOrigin) {
                const path = `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
                return path.startsWith('/') ? path : `/${path}`;
            }
            if (this.allowedReturnOrigins.has(origin)) {
                return resolvedUrl.toString();
            }
            return '/';
        }
        catch {
            return '/';
        }
    }
    mapUser(user) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName ?? null,
            locale: user.locale ?? null,
            lastLoginAt: user.lastLoginAt ?? null,
        };
    }
    mapAuth0Profile(payload) {
        return {
            sub: payload.sub,
            email: this.extractOptionalString(payload.email),
            name: this.extractOptionalString(payload.name),
            picture: this.extractOptionalString(payload.picture),
            given_name: this.extractOptionalString(payload.given_name),
            family_name: this.extractOptionalString(payload.family_name),
            locale: this.extractOptionalString(payload.locale),
        };
    }
    extractOptionalString(value) {
        return typeof value === 'string' && value.length > 0
            ? value
            : undefined;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map