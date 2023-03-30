import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const testTypeormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'this_is_sparta',
    password: 'keep_this_a_secret',
    database: 'test',
    autoLoadEntities: true,
    synchronize: true,
};

export default testTypeormConfig;
