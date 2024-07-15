-- DropForeignKey
ALTER TABLE `authuser` DROP FOREIGN KEY `AuthUser_roleId_fkey`;

-- AlterTable
ALTER TABLE `authuser` MODIFY `roleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AuthUser` ADD CONSTRAINT `AuthUser_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
