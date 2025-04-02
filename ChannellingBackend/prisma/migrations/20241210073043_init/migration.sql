/*
  Warnings:

  - Made the column `Qualification` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `staff` MODIFY `Qualification` VARCHAR(191) NOT NULL;
