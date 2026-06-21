import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { configuration } from './config/configuration';
import { validateEnvironment } from './config/env.validation';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { createWinstonOptions } from './infrastructure/logging/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
    WinstonModule.forRootAsync({
      inject: [],
      useFactory: createWinstonOptions,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL ?? 60) * 1000,
        limit: Number(process.env.RATE_LIMIT_LIMIT ?? 100),
      },
    ]),
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
