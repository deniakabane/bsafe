/*
  Warnings:

  - Added the required column `price` to the `certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate` ADD COLUMN `price` INTEGER NOT NULL;
