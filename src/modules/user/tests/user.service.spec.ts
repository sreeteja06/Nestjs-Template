import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import testTypeormConfig from '../../../shared/test/typeorm_test.bootstrap';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

const NON_EXISTENT_USER_ID = 9999;

describe('UserService', () => {
    let service: UserService = undefined;
    let moduleRef: TestingModule = undefined;

    beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([User]),
                TypeOrmModule.forRoot(testTypeormConfig),
            ],
            providers: [UserService],
        }).compile();

        service = moduleRef.get<UserService>(UserService);
    });

    afterEach(async () => {
        // Free DB connection for next test
        await moduleRef.close();
    });

    describe('findAll', () => {
        it('returns empty array', async () => {
            expect(
                await service.findAll({ limit: 100, page: 1 }),
            ).toStrictEqual([]);
        });
    });

    describe('findOne', () => {
        it('returns undefined', async () => {
            expect(await service.findOne(NON_EXISTENT_USER_ID)).toStrictEqual(
                undefined,
            );
        });
    });
});
