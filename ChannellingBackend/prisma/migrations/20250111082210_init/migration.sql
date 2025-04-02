/*
  Warnings:

  - You are about to drop the column `Time` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the `invoicefee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoiceservices` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorID` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicefee` DROP FOREIGN KEY `InvoiceFee_invoiceId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicefee` DROP FOREIGN KEY `InvoiceFee_invoiceServiceId_fkey`;

-- DropIndex
DROP INDEX `Invoice_doctorId_fkey` ON `invoice`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `Time`,
    DROP COLUMN `doctorId`,
    DROP COLUMN `status`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `doctorID` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `invoicefee`;

-- DropTable
DROP TABLE `invoiceservices`;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `addedData` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `InvoiceID` INTEGER NOT NULL,
    `ServiceID` INTEGER NOT NULL,

    UNIQUE INDEX `InvoiceService_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_id_key` ON `Invoice`(`id`);

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_doctorID_fkey` FOREIGN KEY (`doctorID`) REFERENCES `Doctors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceService` ADD CONSTRAINT `InvoiceService_InvoiceID_fkey` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceService` ADD CONSTRAINT `InvoiceService_ServiceID_fkey` FOREIGN KEY (`ServiceID`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
