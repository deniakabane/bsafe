-- AddForeignKey
ALTER TABLE `product_appeal_training` ADD CONSTRAINT `product_appeal_training_training_id_fkey` FOREIGN KEY (`training_id`) REFERENCES `Training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_appeal_training` ADD CONSTRAINT `product_appeal_training_appeal_id_fkey` FOREIGN KEY (`appeal_id`) REFERENCES `product_appeal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
