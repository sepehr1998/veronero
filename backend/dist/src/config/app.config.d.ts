export interface AppConfig {
    nodeEnv: string;
    port: number;
    allowedOrigins: string[];
}
declare const _default: import("@nestjs/config").ConfigFactory<AppConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AppConfig | Promise<AppConfig>>;
export default _default;
