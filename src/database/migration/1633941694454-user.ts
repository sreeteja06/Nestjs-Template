/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1633941694454 implements MigrationInterface {
  name = 'user1633941694454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_758b8ce7c18b9d347461b30228` ON `user`',
    );
    await queryRunner.query('ALTER TABLE `user` CHANGE `id` `id` int NOT NULL');
    await queryRunner.query('ALTER TABLE `user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query('ALTER TABLE `user` ADD PRIMARY KEY (`user_id`)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP PRIMARY KEY');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `id` int NOT NULL AUTO_INCREMENT',
    );
    await queryRunner.query('ALTER TABLE `user` ADD PRIMARY KEY (`id`)');
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_758b8ce7c18b9d347461b30228` ON `user` (`user_id`)',
    );
  }
}
