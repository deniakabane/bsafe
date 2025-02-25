/*
  Warnings:

  - A unique constraint covering the columns `[national_id_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_national_id_number_key` ON `User`(`national_id_number`);
