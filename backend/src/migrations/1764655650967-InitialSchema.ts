import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764655650967 implements MigrationInterface {
    name = 'InitialSchema1764655650967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "isEquipped" boolean NOT NULL DEFAULT false, "slot" character varying, "characterId" uuid, CONSTRAINT "PK_94f5cbcb5f280f2f30bd4a9fd90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "level" integer NOT NULL DEFAULT '1', "xp" integer NOT NULL DEFAULT '0', "gold" integer NOT NULL DEFAULT '100', "currentHealth" integer NOT NULL DEFAULT '100', "maxHealth" integer NOT NULL DEFAULT '100', "strength" integer NOT NULL DEFAULT '5', "agility" integer NOT NULL DEFAULT '5', "endurance" integer NOT NULL DEFAULT '5', "perception" integer NOT NULL DEFAULT '5', "intelligence" integer NOT NULL DEFAULT '5', "userId" uuid, CONSTRAINT "REL_04c2fb52adfa5265763de8c446" UNIQUE ("userId"), CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "objectives" text NOT NULL, "rewards" text NOT NULL, CONSTRAINT "PK_0d6873502a58302d2ae0b82631c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_quest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'ACTIVE', "progress" text, "userId" uuid, "questId" uuid, CONSTRAINT "PK_61a721810ddb65d863c65687e8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD CONSTRAINT "FK_de3058536c4e7658ba7ee37dfb0" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "FK_04c2fb52adfa5265763de8c4464" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD CONSTRAINT "FK_28ef7a3cb952329439c57004b5b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD CONSTRAINT "FK_1a3529870506c3a3879ab833a44" FOREIGN KEY ("questId") REFERENCES "quest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quest" DROP CONSTRAINT "FK_1a3529870506c3a3879ab833a44"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP CONSTRAINT "FK_28ef7a3cb952329439c57004b5b"`);
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "FK_04c2fb52adfa5265763de8c4464"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP CONSTRAINT "FK_de3058536c4e7658ba7ee37dfb0"`);
        await queryRunner.query(`DROP TABLE "user_quest"`);
        await queryRunner.query(`DROP TABLE "quest"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TABLE "inventory_item"`);
    }

}
