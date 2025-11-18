import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('development'),
    PORT: Joi.number().port().default(3000),
    DATABASE_URL: Joi.string().uri().required(),
    REDIS_URL: Joi.string().uri().required(),
    BULLMQ_PREFIX: Joi.string().default('veronero'),
    AUTH0_DOMAIN: Joi.string().required(),
    AUTH0_AUDIENCE: Joi.string().required(),
    AUTH0_ISSUER_URL: Joi.string().uri().required(),
    AUTH0_BASE_URL: Joi.string().uri().required(),
    AUTH0_CLIENT_ID: Joi.string().required(),
    AUTH0_CLIENT_SECRET: Joi.string().required(),
    AUTH0_SESSION_SECRET: Joi.string().min(32).required(),
    AI_API_KEY: Joi.string().allow('', null),
    STORAGE_BUCKET: Joi.string().required(),
    STORAGE_ENDPOINT: Joi.string().uri().allow('', null),
    STORAGE_REGION: Joi.string().allow('', null),
    STORAGE_ACCESS_KEY: Joi.string().allow('', null),
    STORAGE_SECRET_KEY: Joi.string().allow('', null),
});
