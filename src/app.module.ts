import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppConfig, configuration } from './config/configuration';
import { validationSchema } from './config/env.validation';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
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
      validationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    WinstonModule.forRootAsync({
      inject: [],
      useFactory: createWinstonOptions,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        throttlers: [
          {
            ttl: config.get('rateLimitTtl', { infer: true }) * 1000,
            limit: config.get('rateLimitLimit', { infer: true }),
          },
        ],
      }),
    }),
    PrismaModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware, RequestLoggingMiddleware).forRoutes('*');
  }
}
