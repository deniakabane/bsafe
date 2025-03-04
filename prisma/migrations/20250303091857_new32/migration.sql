-- AlterTable
ALTER TABLE `history_payment` ADD COLUMN `appeal_id` INTEGER NULL,
    MODIFY `nominal` INTEGER NULL,
    MODIFY `proof_of_tf` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `pasfoto` INTEGER NULL;
