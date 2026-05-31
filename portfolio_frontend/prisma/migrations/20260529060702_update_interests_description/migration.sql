/*
  Warnings:

  - You are about to drop the column `icon` on the `interest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `interest` DROP COLUMN `icon`,
    ADD COLUMN `description` TEXT NULL;
