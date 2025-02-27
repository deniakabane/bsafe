-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_skp_id_fkey` FOREIGN KEY (`skp_id`) REFERENCES `Skp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
