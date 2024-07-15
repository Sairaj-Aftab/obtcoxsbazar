/*
  Warnings:

  - Added the required column `status` to the `NoticeFromAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `noticefromadmin` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `noticefrombus` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;
