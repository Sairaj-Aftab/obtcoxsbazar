/*
  Warnings:

  - You are about to drop the column `notice` on the `notice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId]` on the table `Notice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authUserId` to the `ParibahanUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notice` DROP FOREIGN KEY `Notice_paribahanUserId_fkey`;

-- AlterTable
ALTER TABLE `notice` DROP COLUMN `notice`,
    ADD COLUMN `authUserId` INTEGER NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `paribahanUserId` INTEGER NULL;

-- AlterTable
ALTER TABLE `paribahanuser` ADD COLUMN `authUserId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Notice_authUserId_key` ON `Notice`(`authUserId`);

-- AddForeignKey
ALTER TABLE `ParibahanUser` ADD CONSTRAINT `ParibahanUser_authUserId_fkey` FOREIGN KEY (`authUserId`) REFERENCES `AuthUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_paribahanUserId_fkey` FOREIGN KEY (`paribahanUserId`) REFERENCES `ParibahanUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_authUserId_fkey` FOREIGN KEY (`authUserId`) REFERENCES `AuthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
