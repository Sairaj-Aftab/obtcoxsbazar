-- CreateTable
CREATE TABLE `AuthUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `roleId` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `plainPassword` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AuthUser_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoticeFromAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    UNIQUE INDEX `Role_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    UNIQUE INDEX `Permission_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParibahanUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paribahanName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NULL,
    `contactNumber` VARCHAR(191) NULL,
    `salesPerson` VARCHAR(191) NULL,
    `salesNumber` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `plainPassword` VARCHAR(191) NOT NULL,
    `authUserId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ParibahanUser_paribahanName_key`(`paribahanName`),
    UNIQUE INDEX `ParibahanUser_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoticeFromBus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `paribahanUserId` INTEGER NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NoticeFromBus_paribahanUserId_key`(`paribahanUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `busName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `busNo` VARCHAR(191) NOT NULL,
    `guideName` VARCHAR(191) NOT NULL,
    `guidePhone` VARCHAR(191) NOT NULL,
    `leavingPlace` VARCHAR(191) NOT NULL,
    `destinationPlace` VARCHAR(191) NOT NULL,
    `rent` INTEGER NULL,
    `seatStatus` BOOLEAN NOT NULL,
    `paribahanUserId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveDestinationPlace` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placeName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `trash` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LeaveDestinationPlace_placeName_key`(`placeName`),
    UNIQUE INDEX `LeaveDestinationPlace_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_authUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_authUser_AB_unique`(`A`, `B`),
    INDEX `_authUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToRole_AB_unique`(`A`, `B`),
    INDEX `_PermissionToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LeaveDestinationPlaceToParibahanUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LeaveDestinationPlaceToParibahanUser_AB_unique`(`A`, `B`),
    INDEX `_LeaveDestinationPlaceToParibahanUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuthUser` ADD CONSTRAINT `AuthUser_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParibahanUser` ADD CONSTRAINT `ParibahanUser_authUserId_fkey` FOREIGN KEY (`authUserId`) REFERENCES `AuthUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoticeFromBus` ADD CONSTRAINT `NoticeFromBus_paribahanUserId_fkey` FOREIGN KEY (`paribahanUserId`) REFERENCES `ParibahanUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusSchedule` ADD CONSTRAINT `BusSchedule_paribahanUserId_fkey` FOREIGN KEY (`paribahanUserId`) REFERENCES `ParibahanUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_authUser` ADD CONSTRAINT `_authUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `AuthUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_authUser` ADD CONSTRAINT `_authUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `NoticeFromAdmin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LeaveDestinationPlaceToParibahanUser` ADD CONSTRAINT `_LeaveDestinationPlaceToParibahanUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `LeaveDestinationPlace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LeaveDestinationPlaceToParibahanUser` ADD CONSTRAINT `_LeaveDestinationPlaceToParibahanUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `ParibahanUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
