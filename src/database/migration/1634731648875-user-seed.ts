import { MigrationInterface, QueryRunner } from 'typeorm';
import { userSeed } from '../seed/user.seed';

export class userSeed1634731648875 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            userSeed.map(async (user) => {
                await queryRunner.query(
                    'INSERT into user ( user_id, name ) values ( ?, ? )',
                    [user.user_id, user.name],
                );
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            userSeed.map(async (user) => {
                await queryRunner.query('DELETE from user where user_id = ?', [
                    user.user_id,
                ]);
            }),
        );
    }
}
