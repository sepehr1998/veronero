export interface StorageConfig {
    bucket: string;
    endpoint?: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
}
declare const _default: import("@nestjs/config").ConfigFactory<StorageConfig> & import("@nestjs/config").ConfigFactoryKeyHost<StorageConfig | Promise<StorageConfig>>;
export default _default;
