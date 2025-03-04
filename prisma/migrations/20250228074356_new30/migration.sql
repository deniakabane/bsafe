/*
  Warnings:

  - You are about to drop the column `registration_type` on the `admin_user` table. All the data in the column will be lost.
  - You are about to alter the column `nominal` on the `history_payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `domicile_province` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `domicile_city` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `admin_user` DROP COLUMN `registration_type`;

-- AlterTable
ALTER TABLE `history_payment` MODIFY `nominal` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NULL,
    MODIFY `full_address` VARCHAR(191) NULL,
    MODIFY `national_id_number` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(50) NULL,
    MODIFY `blood_type` VARCHAR(10) NULL,
    MODIFY `birth_place` VARCHAR(191) NULL,
    MODIFY `birth_date` DATETIME(3) NULL,
    MODIFY `religion` VARCHAR(50) NULL,
    MODIFY `domicile_province` INTEGER NULL,
    MODIFY `domicile_city` INTEGER NULL,
    MODIFY `last_education` VARCHAR(191) NULL,
    MODIFY `registration_type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user_skp` MODIFY `certificate_no` VARCHAR(191) NULL,
    MODIFY `theme` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user_training` MODIFY `certificate_no` VARCHAR(191) NULL,
    MODIFY `theme` VARCHAR(191) NULL;
