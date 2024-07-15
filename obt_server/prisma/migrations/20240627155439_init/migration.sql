/*
  Warnings:

  - Added the required column `plainPassword` to the `ParibahanUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `paribahanuser` ADD COLUMN `plainPassword` VARCHAR(191) NOT NULL;
