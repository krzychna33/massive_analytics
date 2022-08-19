import { Environment, NODE_ENV } from './types/environment.type';
import { validateEnvironment } from './environment-validators';

export default (): Environment => {
  console.log(`[CONFIG] Loaded2 environment: ${process.env.NODE_ENV}`);

  const environment = {
    nodeEnv: process.env.NODE_ENV as NODE_ENV,
    dataSourceUrl: process.env.DATA_SOURCE_URL,
  };

  validateEnvironment(environment);

  return environment as Environment;
};
