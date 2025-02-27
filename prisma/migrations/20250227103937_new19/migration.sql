-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_training_id_fkey` FOREIGN KEY (`training_id`) REFERENCES `Training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_payment` ADD CONSTRAINT `history_payment_reseller_id_fkey` FOREIGN KEY (`reseller_id`) REFERENCES `Reseller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
