import { Environment, NODE_ENV } from './types/environment.type';
import { validateEnvironment } from './environment-validators';

export default (): Environment => {
  console.log(`[CONFIG] Loaded2 environment: ${process.env.NODE_ENV}`);

  const environment = {
    nodeEnv: process.env.NODE_ENV as NODE_ENV,
    dbHost: process.env.DB_HOST,
    dbPassword: process.env.DB_PASSWORD,
    dbUser: process.env.DB_USER,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
  };

  validateEnvironment(environment);

  return environment as Environment;
};
