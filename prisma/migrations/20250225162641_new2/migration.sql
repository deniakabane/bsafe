/*
  Warnings:

  - You are about to drop the column `product_id` on the `product_appeal_detail` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `schema` table. All the data in the column will be lost.
  - Added the required column `training_id` to the `product_appeal_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `Schema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `product_appeal_detail_product_id_idx` ON `product_appeal_detail`;

-- AlterTable
ALTER TABLE `product_appeal_detail` DROP COLUMN `product_id`,
    ADD COLUMN `training_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schema` DROP COLUMN `image`,
    ADD COLUMN `image_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `training` ADD COLUMN `image_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `product_appeal_detail_training_id_idx` ON `product_appeal_detail`(`training_id`);
