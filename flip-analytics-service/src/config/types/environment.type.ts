export enum NODE_ENV {
  development = 'development',
}

export interface Environment {
  nodeEnv: NODE_ENV;
  dbHost: string;
  dbPassword: string;
  dbUser: string;
  dbName: string;
  dbPort: string;
}
