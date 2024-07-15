/*
  Warnings:

  - You are about to drop the column `phone` on the `paribahanuser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `paribahanuser` DROP COLUMN `phone`,
    ADD COLUMN `SalesNumber` VARCHAR(191) NULL,
    ADD COLUMN `SalesPerson` VARCHAR(191) NULL,
    ADD COLUMN `contactNumber` VARCHAR(191) NULL,
    ADD COLUMN `contactPerson` VARCHAR(191) NULL;
