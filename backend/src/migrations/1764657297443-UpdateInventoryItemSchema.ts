import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInventoryItemSchema1764657297443 implements MigrationInterface {
    name = 'UpdateInventoryItemSchema1764657297443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "isEquipped"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "itemName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "itemType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "equipped" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "lastModified" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD CONSTRAINT "FK_76c3dd2c365117171d3b25b772d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP CONSTRAINT "FK_76c3dd2c365117171d3b25b772d"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "lastModified"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "equipped"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "itemType"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" DROP COLUMN "itemName"`);
        await queryRunner.query(`ALTER TABLE "inventory_item" ADD "isEquipped" boolean NOT NULL DEFAULT false`);
    }

}
