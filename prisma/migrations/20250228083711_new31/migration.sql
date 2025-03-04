/*
  Warnings:

  - Added the required column `status` to the `user_training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_training` ADD COLUMN `status` ENUM('DRAFT', 'PESERTA') NOT NULL;
