/*
  Warnings:

  - You are about to drop the column `authUserId` on the `noticefromadmin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `noticefromadmin` DROP FOREIGN KEY `NoticeFromAdmin_authUserId_fkey`;

-- AlterTable
ALTER TABLE `noticefromadmin` DROP COLUMN `authUserId`;

-- CreateTable
CREATE TABLE `_AuthUserToNoticeFromAdmin` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AuthUserToNoticeFromAdmin_AB_unique`(`A`, `B`),
    INDEX `_AuthUserToNoticeFromAdmin_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AuthUserToNoticeFromAdmin` ADD CONSTRAINT `_AuthUserToNoticeFromAdmin_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AuthUserToNoticeFromAdmin` ADD CONSTRAINT `_AuthUserToNoticeFromAdmin_B_fkey` FOREIGN KEY (`B`) REFERENCES `NoticeFromAdmin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
