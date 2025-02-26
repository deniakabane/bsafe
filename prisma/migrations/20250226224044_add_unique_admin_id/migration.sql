/*
  Warnings:

  - A unique constraint covering the columns `[admin_id]` on the table `Reseller` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Reseller_admin_id_key` ON `Reseller`(`admin_id`);
