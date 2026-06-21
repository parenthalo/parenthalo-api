import { Test } from '@nestjs/testing';

describe('AppModule', () => {
  beforeAll(() => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ?? 'postgresql://parenthalo:parenthalo@localhost:5432/parenthalo';
  });

  it('compiles the root module', async () => {
    const { AppModule } = await import('./app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
    await moduleRef.close();
  });
});
