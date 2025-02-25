/*
  Warnings:

  - You are about to drop the `adminuser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schemagroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usercompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usertraining` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[national_id_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `schema` DROP FOREIGN KEY `Schema_schema_group_id_fkey`;

-- DropIndex
DROP INDEX `Schema_schema_group_id_fkey` ON `schema`;

-- DropIndex
DROP INDEX `User_name_key` ON `user`;

-- DropTable
DROP TABLE `adminuser`;

-- DropTable
DROP TABLE `schemagroup`;

-- DropTable
DROP TABLE `usercompany`;

-- DropTable
DROP TABLE `usertraining`;

-- CreateTable
CREATE TABLE `admin_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `full_address` VARCHAR(191) NOT NULL,
    `national_id_number` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(50) NOT NULL,
    `blood_type` VARCHAR(10) NOT NULL,
    `birth_place` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `religion` VARCHAR(50) NOT NULL,
    `domicile_province` VARCHAR(191) NOT NULL,
    `domicile_city` VARCHAR(191) NOT NULL,
    `last_education` VARCHAR(191) NOT NULL,
    `registration_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_user_email_key`(`email`),
    UNIQUE INDEX `admin_user_phone_key`(`phone`),
    UNIQUE INDEX `admin_user_national_id_number_key`(`national_id_number`),
    INDEX `admin_user_name_idx`(`name`),
    INDEX `admin_user_email_idx`(`email`),
    INDEX `admin_user_phone_idx`(`phone`),
    INDEX `admin_user_national_id_number_idx`(`national_id_number`),
    INDEX `admin_user_domicile_city_idx`(`domicile_city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `training_id` INTEGER NOT NULL,
    `certificate_no` VARCHAR(191) NOT NULL,
    `theme` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_training_user_id_idx`(`user_id`),
    INDEX `user_training_training_id_idx`(`training_id`),
    INDEX `user_training_certificate_no_idx`(`certificate_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,
    `still_working` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_company_user_id_idx`(`user_id`),
    INDEX `user_company_company_id_idx`(`company_id`),
    UNIQUE INDEX `user_company_user_id_company_id_key`(`user_id`, `company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schema_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokmaster` (
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

    INDEX `dokmaster_user_id_idx`(`user_id`),
    INDEX `dokmaster_skp_id_idx`(`skp_id`),
    INDEX `dokmaster_training_id_idx`(`training_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reseller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `admin_id` INTEGER NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Reseller_admin_id_idx`(`admin_id`),
    INDEX `Reseller_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `training_id` INTEGER NOT NULL,
    `nominal` DECIMAL(10, 2) NOT NULL,
    `proof_of_tf` VARCHAR(255) NULL,
    `reseller_id` INTEGER NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `History_user_id_idx`(`user_id`),
    INDEX `History_training_id_idx`(`training_id`),
    INDEX `History_reseller_id_idx`(`reseller_id`),
    INDEX `History_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_appeal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_appeal_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `appeal_id` INTEGER NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `product_appeal_detail_product_id_idx`(`product_id`),
    INDEX `product_appeal_detail_appeal_id_idx`(`appeal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_national_id_number_key` ON `User`(`national_id_number`);

-- AddForeignKey
ALTER TABLE `Schema` ADD CONSTRAINT `Schema_schema_group_id_fkey` FOREIGN KEY (`schema_group_id`) REFERENCES `schema_group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
