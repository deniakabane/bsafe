/*
  Warnings:

  - You are about to alter the column `type` on the `reseller` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `admin_user` MODIFY `level` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `reseller` MODIFY `type` ENUM('internal', 'external') NOT NULL;
