import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import winston from 'winston';

export const createWinstonOptions = (): winston.LoggerOptions => ({
  level: process.env.LOG_LEVEL ?? 'info',
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.combine(winston.format.timestamp(), winston.format.json())
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('ParentHalo', {
                colors: true,
                prettyPrint: true,
              }),
            ),
    }),
  ],
});
