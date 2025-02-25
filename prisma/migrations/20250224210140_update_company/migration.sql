/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Company_name_key` ON `Company`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Company_phone_key` ON `Company`(`phone`);
