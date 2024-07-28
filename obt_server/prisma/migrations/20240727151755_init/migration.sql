/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `DriverInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[license]` on the table `DriverInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DriverInfo_phone_key` ON `DriverInfo`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `DriverInfo_license_key` ON `DriverInfo`(`license`);
