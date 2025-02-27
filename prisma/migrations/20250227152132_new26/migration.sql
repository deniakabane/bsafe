/*
  Warnings:

  - You are about to alter the column `type` on the `product_appeal_training` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(3))`.
  - The values [internal,external] on the enum `Reseller_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product_appeal_training` MODIFY `type` ENUM('TRAINING', 'OTHER') NOT NULL DEFAULT 'TRAINING';

-- AlterTable
ALTER TABLE `reseller` MODIFY `type` ENUM('INTERNAL', 'EXTERNAL') NOT NULL;
