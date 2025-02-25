/*
  Warnings:

  - You are about to alter the column `status` on the `master_document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `TinyInt`.
  - You are about to alter the column `status` on the `product_appeal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `TinyInt`.
  - You are about to alter the column `status` on the `product_appeal_detail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `master_document` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `product_appeal` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `product_appeal_detail` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `skp` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `training` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;
