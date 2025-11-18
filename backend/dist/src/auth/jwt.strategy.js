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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const jwks_rsa_1 = require("jwks-rsa");
const passport_jwt_1 = require("passport-jwt");
const bearerTokenExtractor = (request) => {
    const authHeader = request.headers?.authorization;
    if (typeof authHeader !== 'string') {
        return null;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    constructor(configService) {
        const domain = configService.getOrThrow('auth.domain');
        const audience = configService.getOrThrow('auth.audience');
        const issuer = configService.getOrThrow('auth.issuerUrl');
        super({
            jwtFromRequest: bearerTokenExtractor,
            audience,
            issuer,
            algorithms: ['RS256'],
            secretOrKeyProvider: (0, jwks_rsa_1.passportJwtSecret)({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${domain}/.well-known/jwks.json`,
            }),
        });
        this.configService = configService;
    }
    validate(payload) {
        if (!payload?.sub) {
            throw new common_1.UnauthorizedException('Invalid token payload');
        }
        return {
            sub: payload.sub,
            email: this.extractOptionalString(payload.email),
            name: this.extractOptionalString(payload.name),
            given_name: this.extractOptionalString(payload.given_name),
            family_name: this.extractOptionalString(payload.family_name),
            locale: this.extractOptionalString(payload.locale),
            picture: this.extractOptionalString(payload.picture),
            scope: payload.scope,
            permissions: Array.isArray(payload.permissions)
                ? payload.permissions
                : undefined,
            aud: payload.aud,
            iss: payload.iss,
            iat: payload.iat,
            exp: payload.exp,
        };
    }
    extractOptionalString(value) {
        return typeof value === 'string' && value.length > 0
            ? value
            : undefined;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map