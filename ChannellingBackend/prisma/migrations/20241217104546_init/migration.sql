/*
  Warnings:

  - You are about to drop the `parmacy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `staff` MODIFY `password` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `parmacy`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `pharmacy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `categoryID` INTEGER NOT NULL,

    UNIQUE INDEX `pharmacy_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pharmacy` ADD CONSTRAINT `pharmacy_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
