import { IsEnum, IsString, MinLength, validateSync } from 'class-validator';
import { Environment, NODE_ENV } from '../types/environment.type';

export class EnvironmentDto implements Environment {
  @IsEnum(NODE_ENV)
  nodeEnv: NODE_ENV;

  @IsString()
  dbHost: string;

  @IsString()
  dbName: string;

  @IsString()
  dbPassword: string;

  @IsString()
  dbPort: string;

  @IsString()
  dbUser: string;
}
