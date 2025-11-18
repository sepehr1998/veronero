export interface RedisConfig {
    url: string;
}
declare const _default: import("@nestjs/config").ConfigFactory<RedisConfig> & import("@nestjs/config").ConfigFactoryKeyHost<RedisConfig | Promise<RedisConfig>>;
export default _default;
