/*
  Warnings:

  - You are about to drop the `_authusertonoticefromadmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_authusertonoticefromadmin` DROP FOREIGN KEY `_AuthUserToNoticeFromAdmin_A_fkey`;

-- DropForeignKey
ALTER TABLE `_authusertonoticefromadmin` DROP FOREIGN KEY `_AuthUserToNoticeFromAdmin_B_fkey`;

-- DropTable
DROP TABLE `_authusertonoticefromadmin`;

-- CreateTable
CREATE TABLE `_authUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_authUser_AB_unique`(`A`, `B`),
    INDEX `_authUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_authUser` ADD CONSTRAINT `_authUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_authUser` ADD CONSTRAINT `_authUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `NoticeFromAdmin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
