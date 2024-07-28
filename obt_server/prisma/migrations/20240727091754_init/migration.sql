/*
  Warnings:

  - Added the required column `paribahanName` to the `DriverInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `DriverInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paribahanName` to the `GuideInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `GuideInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `driverinfo` ADD COLUMN `paribahanName` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `guideinfo` ADD COLUMN `paribahanName` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;
