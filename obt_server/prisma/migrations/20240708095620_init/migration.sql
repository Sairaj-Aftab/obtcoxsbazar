/*
  Warnings:

  - You are about to drop the `notice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notice` DROP FOREIGN KEY `Notice_authUserId_fkey`;

-- DropForeignKey
ALTER TABLE `notice` DROP FOREIGN KEY `Notice_paribahanUserId_fkey`;

-- DropTable
DROP TABLE `notice`;

-- CreateTable
CREATE TABLE `NoticeFromAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `authUserId` INTEGER NULL,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NoticeFromAdmin_authUserId_key`(`authUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoticeFromBus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `paribahanUserId` INTEGER NULL,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NoticeFromBus_paribahanUserId_key`(`paribahanUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NoticeFromAdmin` ADD CONSTRAINT `NoticeFromAdmin_authUserId_fkey` FOREIGN KEY (`authUserId`) REFERENCES `AuthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoticeFromBus` ADD CONSTRAINT `NoticeFromBus_paribahanUserId_fkey` FOREIGN KEY (`paribahanUserId`) REFERENCES `ParibahanUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
