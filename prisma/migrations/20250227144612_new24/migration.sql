/*
  Warnings:

  - You are about to alter the column `type` on the `master_document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `master_document` MODIFY `type` ENUM('USER', 'TRAINING', 'SKP') NOT NULL;
