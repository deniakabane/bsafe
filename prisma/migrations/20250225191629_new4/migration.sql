-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `user_training_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `user_training_training_id_fkey` FOREIGN KEY (`training_id`) REFERENCES `Training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
