/*
  Warnings:

  - You are about to drop the `paribahandestination` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `paribahandestination` DROP FOREIGN KEY `ParibahanDestination_destinationId_fkey`;

-- DropForeignKey
ALTER TABLE `paribahandestination` DROP FOREIGN KEY `ParibahanDestination_paribahanId_fkey`;

-- DropTable
DROP TABLE `paribahandestination`;

-- CreateTable
CREATE TABLE `_LeaveDestinationPlaceToParibahanUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LeaveDestinationPlaceToParibahanUser_AB_unique`(`A`, `B`),
    INDEX `_LeaveDestinationPlaceToParibahanUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LeaveDestinationPlaceToParibahanUser` ADD CONSTRAINT `_LeaveDestinationPlaceToParibahanUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `LeaveDestinationPlace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LeaveDestinationPlaceToParibahanUser` ADD CONSTRAINT `_LeaveDestinationPlaceToParibahanUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `ParibahanUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
