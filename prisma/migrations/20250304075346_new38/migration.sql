/*
  Warnings:

  - You are about to alter the column `level` on the `admin_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `admin_user` MODIFY `level` ENUM('ADMIN', 'SUPER_ADMIN') NOT NULL;

-- AlterTable
ALTER TABLE `user_training` MODIFY `status` ENUM('CANCEL', 'DRAFT', 'PESERTA') NOT NULL;

-- CreateTable
CREATE TABLE `category_certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `certificate_id` INTEGER NOT NULL,
    `description` LONGTEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `certificate` ADD CONSTRAINT `certificate_certificate_id_fkey` FOREIGN KEY (`certificate_id`) REFERENCES `category_certificate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
