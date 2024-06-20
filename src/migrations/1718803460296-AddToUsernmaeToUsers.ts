import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToUsernmaeToUsers1718803460296 implements MigrationInterface {
    name = 'AddToUsernmaeToUsers1718803460296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
