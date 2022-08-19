import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(await app.resolve(CustomLogger));
  await app.listen(3000);
}
bootstrap();
