/*
  Warnings:

  - You are about to drop the column `specialization` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `specializationId` to the `Doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `doctors` DROP COLUMN `specialization`,
    ADD COLUMN `specializationId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Doctors` ADD CONSTRAINT `Doctors_specializationId_fkey` FOREIGN KEY (`specializationId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
