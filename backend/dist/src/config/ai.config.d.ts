export interface AiConfig {
    apiKey?: string;
}
declare const _default: import("@nestjs/config").ConfigFactory<AiConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AiConfig | Promise<AiConfig>>;
export default _default;
