/*
  Warnings:

  - You are about to drop the column `placeName` on the `notice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `notice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paribahanUserId]` on the table `Notice` will be added. If there are existing duplicate values, this will fail.
  - Made the column `roleId` on table `authuser` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `notice` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paribahanUserId` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `authuser` DROP FOREIGN KEY `AuthUser_roleId_fkey`;

-- DropIndex
DROP INDEX `Notice_placeName_key` ON `notice`;

-- AlterTable
ALTER TABLE `authuser` MODIFY `roleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `notice` DROP COLUMN `placeName`,
    DROP COLUMN `status`,
    ADD COLUMN `notice` VARCHAR(191) NOT NULL,
    ADD COLUMN `paribahanUserId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `paribahanuser` ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Notice_paribahanUserId_key` ON `Notice`(`paribahanUserId`);

-- AddForeignKey
ALTER TABLE `AuthUser` ADD CONSTRAINT `AuthUser_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_paribahanUserId_fkey` FOREIGN KEY (`paribahanUserId`) REFERENCES `ParibahanUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
