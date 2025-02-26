/*
  Warnings:

  - You are about to drop the `product_appeal_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `product_appeal_detail`;

-- CreateTable
CREATE TABLE `product_appeal_training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `training_id` INTEGER NOT NULL,
    `appeal_id` INTEGER NOT NULL,
    `type` ENUM('Training', 'Other') NOT NULL DEFAULT 'Training',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `product_appeal_training_training_id_idx`(`training_id`),
    INDEX `product_appeal_training_appeal_id_idx`(`appeal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
