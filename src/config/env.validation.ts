const allowedNodeEnvs = ['development', 'test', 'production'] as const;
const allowedLogLevels = ['error', 'warn', 'info', 'http', 'debug'] as const;

type NodeEnv = (typeof allowedNodeEnvs)[number];
type LogLevel = (typeof allowedLogLevels)[number];

interface Environment {
  NODE_ENV: NodeEnv;
  PORT: string;
  API_PREFIX: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_TTL: string;
  RATE_LIMIT_LIMIT: string;
  DATABASE_URL: string;
  LOG_LEVEL: LogLevel;
}

export function validateEnvironment(config: Record<string, unknown>): Environment {
  const environment: Environment = {
    NODE_ENV: parseEnum(config.NODE_ENV, allowedNodeEnvs, 'NODE_ENV', 'development'),
    PORT: parsePort(config.PORT, 'PORT', 3000).toString(),
    API_PREFIX: parseString(config.API_PREFIX, 'API_PREFIX', 'api/v1'),
    CORS_ORIGIN: parseString(config.CORS_ORIGIN, 'CORS_ORIGIN', 'http://localhost:3000'),
    RATE_LIMIT_TTL: parsePositiveInteger(config.RATE_LIMIT_TTL, 'RATE_LIMIT_TTL', 60).toString(),
    RATE_LIMIT_LIMIT: parsePositiveInteger(
      config.RATE_LIMIT_LIMIT,
      'RATE_LIMIT_LIMIT',
      100,
    ).toString(),
    DATABASE_URL: parseDatabaseUrl(config.DATABASE_URL),
    LOG_LEVEL: parseEnum(config.LOG_LEVEL, allowedLogLevels, 'LOG_LEVEL', 'info'),
  };

  return environment;
}

function parseString(value: unknown, key: string, fallback: string): string {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    throw new Error(`${key} must be a string`);
  }

  return value;
}

function parsePositiveInteger(value: unknown, key: string, fallback: number): number {
  const rawValue = value === undefined || value === null || value === '' ? fallback : Number(value);

  if (!Number.isInteger(rawValue) || rawValue <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }

  return rawValue;
}

function parsePort(value: unknown, key: string, fallback: number): number {
  const port = parsePositiveInteger(value, key, fallback);

  if (port > 65535) {
    throw new Error(`${key} must be a valid TCP port`);
  }

  return port;
}

function parseDatabaseUrl(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('DATABASE_URL is required');
  }

  const parsed = new URL(value);
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('DATABASE_URL must use postgres or postgresql protocol');
  }

  return value;
}

function parseEnum<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  key: string,
  fallback: T,
): T {
  const rawValue = value === undefined || value === null || value === '' ? fallback : value;

  if (typeof rawValue !== 'string' || !allowedValues.includes(rawValue as T)) {
    throw new Error(`${key} must be one of: ${allowedValues.join(', ')}`);
  }

  return rawValue as T;
}
