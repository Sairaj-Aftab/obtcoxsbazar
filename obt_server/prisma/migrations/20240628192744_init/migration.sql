-- CreateTable
CREATE TABLE `BusSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `busName` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `busNo` VARCHAR(191) NOT NULL,
    `guideName` VARCHAR(191) NOT NULL,
    `guidePhone` VARCHAR(191) NOT NULL,
    `leavingPlace` VARCHAR(191) NOT NULL,
    `destinationPlace` VARCHAR(191) NOT NULL,
    `seatStatus` BOOLEAN NOT NULL,
    `paribahanUserId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BusSchedule` ADD CONSTRAINT `BusSchedule_paribahanUserId_fkey` FOREIGN KEY (`paribahanUserId`) REFERENCES `ParibahanUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
