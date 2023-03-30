import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    migrations: ['src/database/migration/*.ts'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: false,
    maxQueryExecutionTime: 1000,
    logging: true,
});
