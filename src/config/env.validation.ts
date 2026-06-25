import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().pattern(/^\d+$/).default('1'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  RATE_LIMIT_TTL: Joi.number().integer().positive().default(60),
  RATE_LIMIT_LIMIT: Joi.number().integer().positive().default(100),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'debug').default('info'),
});
