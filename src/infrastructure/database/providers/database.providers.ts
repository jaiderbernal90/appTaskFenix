import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: process.env.DB_PATH || '/db/database.sqlite',
        logging: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true
      });

      return dataSource.initialize();
    }
  }
];
