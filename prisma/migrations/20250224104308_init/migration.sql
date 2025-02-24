/*
  Warnings:

  - You are about to drop the `traininggroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `schema` DROP FOREIGN KEY `Schema_schema_group_id_fkey`;

-- DropIndex
DROP INDEX `Schema_schema_group_id_fkey` ON `schema`;

-- DropTable
DROP TABLE `traininggroup`;

-- CreateTable
CREATE TABLE `SchemaGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Schema` ADD CONSTRAINT `Schema_schema_group_id_fkey` FOREIGN KEY (`schema_group_id`) REFERENCES `SchemaGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
