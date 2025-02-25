-- CreateTable
CREATE TABLE `Skp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `image_id` INTEGER NOT NULL,
    `description` LONGTEXT NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `price` INTEGER NULL,
    `type` ENUM('SKP', 'LISENSI') NOT NULL,
    `schema_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Skp_schema_id_idx`(`schema_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_skp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `skp_id` INTEGER NOT NULL,
    `certificate_no` VARCHAR(191) NOT NULL,
    `theme` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_skp_user_id_idx`(`user_id`),
    INDEX `user_skp_skp_id_idx`(`skp_id`),
    INDEX `user_skp_certificate_no_idx`(`certificate_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Skp` ADD CONSTRAINT `Skp_schema_id_fkey` FOREIGN KEY (`schema_id`) REFERENCES `Schema`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_skp` ADD CONSTRAINT `user_skp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_skp` ADD CONSTRAINT `user_skp_skp_id_fkey` FOREIGN KEY (`skp_id`) REFERENCES `Skp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
