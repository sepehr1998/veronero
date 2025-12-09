export interface AiConfig {
    apiKey?: string;
    model?: string;
    provider?: 'openai' | 'anthropic' | 'azure_openai' | 'dummy';
}
declare const _default: import("@nestjs/config").ConfigFactory<AiConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AiConfig | Promise<AiConfig>>;
export default _default;
