
export enum NODE_ENV {
  development = 'development'
}

export interface Environment {
  nodeEnv: NODE_ENV
  dataSourceUrl: string
}