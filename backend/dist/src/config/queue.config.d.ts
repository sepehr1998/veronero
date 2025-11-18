export interface QueueConfig {
    prefix: string;
}
declare const _default: import("@nestjs/config").ConfigFactory<QueueConfig> & import("@nestjs/config").ConfigFactoryKeyHost<QueueConfig | Promise<QueueConfig>>;
export default _default;
