/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `schema` table. All the data in the column will be lost.
  - You are about to drop the column `gambar` on the `schema` table. All the data in the column will be lost.
  - You are about to drop the column `gambar_path` on the `schema` table. All the data in the column will be lost.
  - You are about to drop the column `link_seo` on the `schema` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `schema` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `schemagroup` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `schemagroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schema` DROP COLUMN `deskripsi`,
    DROP COLUMN `gambar`,
    DROP COLUMN `gambar_path`,
    DROP COLUMN `link_seo`,
    DROP COLUMN `nama`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `image_path` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'Untitled',
    ADD COLUMN `seo_link` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schemagroup` DROP COLUMN `keterangan`,
    DROP COLUMN `nama`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'Untitled';
