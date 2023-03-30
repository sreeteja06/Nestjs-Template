/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class userUnique1633935259102 implements MigrationInterface {
  name = 'userUnique1633935259102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_758b8ce7c18b9d347461b30228` (`user_id`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_758b8ce7c18b9d347461b30228`',
    );
  }
}
