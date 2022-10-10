import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1665446069933 implements MigrationInterface {
    name = 'migration1665446069933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_token\` (\`id\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`token\` varchar(255) NOT NULL, \`status\` enum ('expired', 'used', 'valid', 'canceled') NOT NULL DEFAULT 'valid', \`type\` enum ('reset_password', 'email_confirmation') NOT NULL, \`userId\` varchar(36) NULL, INDEX \`IDX_9b8c6eac80e52d95241b573877\` (\`token\`), INDEX \`IDX_2abd30dd47bd155e594f0e043e\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` enum ('created', 'invited', 'confirmed', 'blocked') NOT NULL DEFAULT 'created', \`password\` varchar(255) NULL, INDEX \`IDX_3d44ccf43b8a0d6b9978affb88\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ong\` (\`id\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ong_users_user\` (\`ongId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, INDEX \`IDX_a15d745fc21bd05fefa8f48e7b\` (\`ongId\`), INDEX \`IDX_4d0f0edd12795dc1cf924cd9d0\` (\`userId\`), PRIMARY KEY (\`ongId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_token\` ADD CONSTRAINT \`FK_d37db50eecdf9b8ce4eedd2f918\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ong_users_user\` ADD CONSTRAINT \`FK_a15d745fc21bd05fefa8f48e7b7\` FOREIGN KEY (\`ongId\`) REFERENCES \`ong\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ong_users_user\` ADD CONSTRAINT \`FK_4d0f0edd12795dc1cf924cd9d02\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ong_users_user\` DROP FOREIGN KEY \`FK_4d0f0edd12795dc1cf924cd9d02\``);
        await queryRunner.query(`ALTER TABLE \`ong_users_user\` DROP FOREIGN KEY \`FK_a15d745fc21bd05fefa8f48e7b7\``);
        await queryRunner.query(`ALTER TABLE \`user_token\` DROP FOREIGN KEY \`FK_d37db50eecdf9b8ce4eedd2f918\``);
        await queryRunner.query(`DROP INDEX \`IDX_4d0f0edd12795dc1cf924cd9d0\` ON \`ong_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a15d745fc21bd05fefa8f48e7b\` ON \`ong_users_user\``);
        await queryRunner.query(`DROP TABLE \`ong_users_user\``);
        await queryRunner.query(`DROP TABLE \`ong\``);
        await queryRunner.query(`DROP INDEX \`IDX_3d44ccf43b8a0d6b9978affb88\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_2abd30dd47bd155e594f0e043e\` ON \`user_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_9b8c6eac80e52d95241b573877\` ON \`user_token\``);
        await queryRunner.query(`DROP TABLE \`user_token\``);
    }

}
