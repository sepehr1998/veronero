export interface AuthConfig {
    domain: string;
    audience: string;
    issuerUrl: string;
    issuerBaseUrl: string;
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    sessionSecret: string;
}
declare const _default: import("@nestjs/config").ConfigFactory<AuthConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AuthConfig | Promise<AuthConfig>>;
export default _default;
