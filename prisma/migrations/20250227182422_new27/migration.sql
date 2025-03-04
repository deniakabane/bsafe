/*
  Warnings:

  - You are about to alter the column `status` on the `history_payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(3))`.

*/
-- DropForeignKey
ALTER TABLE `history_payment` DROP FOREIGN KEY `history_payment_reseller_id_fkey`;

-- AlterTable
ALTER TABLE `history_payment` MODIFY `reseller_id` INTEGER NULL,
    MODIFY `status` ENUM('PAID', 'UNPAID', 'DP') NOT NULL;

-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_reseller_id_fkey` FOREIGN KEY (`reseller_id`) REFERENCES `Reseller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
