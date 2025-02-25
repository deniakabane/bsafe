/*
  Warnings:

  - You are about to drop the column `created_at` on the `admin_user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `admin_user` table. All the data in the column will be lost.
  - You are about to drop the `dokmaster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `admin_user_domicile_city_idx` ON `admin_user`;

-- DropIndex
DROP INDEX `admin_user_email_idx` ON `admin_user`;

-- DropIndex
DROP INDEX `admin_user_name_idx` ON `admin_user`;

-- DropIndex
DROP INDEX `admin_user_national_id_number_idx` ON `admin_user`;

-- DropIndex
DROP INDEX `admin_user_national_id_number_key` ON `admin_user`;

-- DropIndex
DROP INDEX `admin_user_phone_idx` ON `admin_user`;

-- DropIndex
DROP INDEX `User_domicile_city_idx` ON `user`;

-- DropIndex
DROP INDEX `User_email_idx` ON `user`;

-- DropIndex
DROP INDEX `User_name_idx` ON `user`;

-- DropIndex
DROP INDEX `User_national_id_number_idx` ON `user`;

-- DropIndex
DROP INDEX `User_phone_idx` ON `user`;

-- AlterTable
ALTER TABLE `admin_user` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;

-- DropTable
DROP TABLE `dokmaster`;

-- CreateTable
CREATE TABLE `master_document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `training_id` INTEGER NULL,
    `skp_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `master_document_user_id_idx`(`user_id`),
    INDEX `master_document_skp_id_idx`(`skp_id`),
    INDEX `master_document_training_id_idx`(`training_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RedefineIndex
CREATE INDEX `Schema_schema_group_id_idx` ON `Schema`(`schema_group_id`);
DROP INDEX `Schema_schema_group_id_fkey` ON `schema`;

-- RedefineIndex
CREATE INDEX `Training_schema_id_idx` ON `Training`(`schema_id`);
DROP INDEX `Training_schema_id_fkey` ON `training`;
