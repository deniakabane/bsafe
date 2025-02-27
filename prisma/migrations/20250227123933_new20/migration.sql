/*
  Warnings:

  - Added the required column `skp_id` to the `history_payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history_payment` ADD COLUMN `skp_id` INTEGER NOT NULL;
