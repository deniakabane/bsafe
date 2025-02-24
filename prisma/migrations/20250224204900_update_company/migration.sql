/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `deleted_at`,
    MODIFY `province` VARCHAR(100) NULL,
    MODIFY `city` VARCHAR(100) NULL;
