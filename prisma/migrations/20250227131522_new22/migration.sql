-- DropForeignKey
ALTER TABLE `history_payment` DROP FOREIGN KEY `history_payment_skp_id_fkey`;

-- DropForeignKey
ALTER TABLE `history_payment` DROP FOREIGN KEY `history_payment_training_id_fkey`;

-- DropIndex
DROP INDEX `history_payment_skp_id_fkey` ON `history_payment`;

-- AlterTable
ALTER TABLE `history_payment` MODIFY `training_id` INTEGER NULL,
    MODIFY `skp_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_training_id_fkey` FOREIGN KEY (`training_id`) REFERENCES `Training`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_skp_id_fkey` FOREIGN KEY (`skp_id`) REFERENCES `Skp`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
