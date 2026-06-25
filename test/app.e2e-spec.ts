import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Server } from 'http';
import request from 'supertest';
import { ApiResponseInterceptor } from '../src/common/interceptors/api-response.interceptor';
import { configuration } from '../src/config/configuration';
import { validationSchema } from '../src/config/env.validation';
import { PrismaService } from '../src/infrastructure/database/prisma/prisma.service';
import { HealthController } from '../src/modules/health/health.controller';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ?? 'postgresql://parenthalo:parenthalo@localhost:5432/parenthalo';

    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validationSchema,
        }),
      ],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              status: 'ok',
              info: { database: { status: 'up' } },
              error: {},
              details: { database: { status: 'up' } },
            }),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn().mockResolvedValue({ storage: { status: 'up' } }),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn().mockResolvedValue({ memory_heap: { status: 'up' } }),
          },
        },
        {
          provide: PrismaHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ApiResponseInterceptor(app.get(Reflector)));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/health (GET)', async () => {
    const server = app.getHttpServer() as Server;
    const response = await request(server).get('/api/v1/health').expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        status: 'ok',
      },
    });
  });
});
