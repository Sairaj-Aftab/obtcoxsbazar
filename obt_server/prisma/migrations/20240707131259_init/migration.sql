/*
  Warnings:

  - You are about to drop the `_leavedestinationplacetoparibahanuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_leavedestinationplacetoparibahanuser` DROP FOREIGN KEY `_LeaveDestinationPlaceToParibahanUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_leavedestinationplacetoparibahanuser` DROP FOREIGN KEY `_LeaveDestinationPlaceToParibahanUser_B_fkey`;

-- DropTable
DROP TABLE `_leavedestinationplacetoparibahanuser`;

-- CreateTable
CREATE TABLE `ParibahanDestination` (
    `paribahanId` INTEGER NOT NULL,
    `destinationId` INTEGER NOT NULL,

    PRIMARY KEY (`paribahanId`, `destinationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParibahanDestination` ADD CONSTRAINT `ParibahanDestination_paribahanId_fkey` FOREIGN KEY (`paribahanId`) REFERENCES `ParibahanUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParibahanDestination` ADD CONSTRAINT `ParibahanDestination_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `LeaveDestinationPlace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
