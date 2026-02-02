import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1770026089415 implements MigrationInterface {
    name = 'InitialMigration1770026089415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "email" text NOT NULL, "fullName" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "password" text NOT NULL, "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0504d8b5c50e7968706b40b35f" ON "reports" ("userId", "number") `);
        await queryRunner.query(`CREATE TABLE "shifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "endDate" TIMESTAMP, "lunchEnd" TIMESTAMP, "lunchStart" TIMESTAMP, "startDate" TIMESTAMP NOT NULL, "reportId" uuid, CONSTRAINT "PK_84d692e367e4d6cdf045828768c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shifts" ADD CONSTRAINT "FK_983eab2d040d21553b1e01ae857" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shifts" DROP CONSTRAINT "FK_983eab2d040d21553b1e01ae857"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c"`);
        await queryRunner.query(`DROP TABLE "shifts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0504d8b5c50e7968706b40b35f"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
