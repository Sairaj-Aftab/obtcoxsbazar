/*
  Warnings:

  - You are about to drop the column `SalesNumber` on the `paribahanuser` table. All the data in the column will be lost.
  - You are about to drop the column `SalesPerson` on the `paribahanuser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `paribahanuser` DROP COLUMN `SalesNumber`,
    DROP COLUMN `SalesPerson`,
    ADD COLUMN `salesNumber` VARCHAR(191) NULL,
    ADD COLUMN `salesPerson` VARCHAR(191) NULL;
