/*
  Warnings:

  - Made the column `proof_of_tf` on table `history_payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reseller_id` on table `history_payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `history_payment` MODIFY `proof_of_tf` INTEGER NOT NULL,
    MODIFY `reseller_id` INTEGER NOT NULL;
