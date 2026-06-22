export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  corsOrigins: string[];
  databaseUrl: string;
  logLevel: string;
  rateLimitTtl: number;
  rateLimitLimit: number;
}

export const configuration = (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiVersion: process.env.API_VERSION ?? '1',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL ?? '',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  rateLimitTtl: Number(process.env.RATE_LIMIT_TTL ?? 60),
  rateLimitLimit: Number(process.env.RATE_LIMIT_LIMIT ?? 100),
});
