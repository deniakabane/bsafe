/*
  Warnings:

  - Added the required column `birth_date` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_place` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blood_type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domicile_city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domicile_province` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_education` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `national_id_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `religion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `birth_date` DATETIME(3) NOT NULL,
    ADD COLUMN `birth_place` VARCHAR(191) NOT NULL,
    ADD COLUMN `blood_type` VARCHAR(10) NOT NULL,
    ADD COLUMN `domicile_city` VARCHAR(191) NOT NULL,
    ADD COLUMN `domicile_province` VARCHAR(191) NOT NULL,
    ADD COLUMN `full_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(50) NOT NULL,
    ADD COLUMN `last_education` VARCHAR(191) NOT NULL,
    ADD COLUMN `national_id_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `registration_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `religion` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `AdminUser` (
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

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    INDEX `AdminUser_name_idx`(`name`),
    INDEX `AdminUser_email_idx`(`email`),
    INDEX `AdminUser_phone_idx`(`phone`),
    INDEX `AdminUser_national_id_number_idx`(`national_id_number`),
    INDEX `AdminUser_domicile_city_idx`(`domicile_city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTraining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `training_id` INTEGER NOT NULL,
    `certificate_no` VARCHAR(191) NOT NULL,
    `theme` VARCHAR(191) NOT NULL,

    INDEX `UserTraining_user_id_idx`(`user_id`),
    INDEX `UserTraining_training_id_idx`(`training_id`),
    INDEX `UserTraining_certificate_no_idx`(`certificate_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,
    `still_working` BOOLEAN NOT NULL DEFAULT true,

    INDEX `UserCompany_user_id_idx`(`user_id`),
    INDEX `UserCompany_company_id_idx`(`company_id`),
    UNIQUE INDEX `UserCompany_user_id_company_id_key`(`user_id`, `company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logo` VARCHAR(255) NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `company_wa` VARCHAR(20) NULL,
    `hrd_wa` VARCHAR(20) NULL,
    `province` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `finance_pic` VARCHAR(191) NULL,
    `finance_phone` VARCHAR(20) NULL,

    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `User_national_id_number_idx` ON `User`(`national_id_number`);

-- CreateIndex
CREATE INDEX `User_domicile_city_idx` ON `User`(`domicile_city`);
