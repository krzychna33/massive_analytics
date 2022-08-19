import { Environment } from './types/environment.type';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentDto } from './dto/environment.dto';

export function validateEnvironment(config: Environment) {
  const validatedConfig = plainToInstance(EnvironmentDto, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
