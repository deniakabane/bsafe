-- AddForeignKey
ALTER TABLE `master_document` ADD CONSTRAINT `master_document_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_document` ADD CONSTRAINT `master_document_training_id_fkey` FOREIGN KEY (`training_id`) REFERENCES `Training`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_document` ADD CONSTRAINT `master_document_skp_id_fkey` FOREIGN KEY (`skp_id`) REFERENCES `Skp`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
