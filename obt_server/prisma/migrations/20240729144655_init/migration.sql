-- CreateTable
CREATE TABLE `RegularBusSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `busName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `leavingPlace` VARCHAR(191) NOT NULL,
    `destinationPlace` VARCHAR(191) NOT NULL,
    `rent` INTEGER NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
