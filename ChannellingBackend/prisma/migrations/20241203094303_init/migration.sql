/*
  Warnings:

  - Made the column `UserName` on table `admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Password` on table `admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fullName` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_number` on table `doctors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `doctors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `UserName` VARCHAR(191) NOT NULL,
    MODIFY `Password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `doctors` MODIFY `fullName` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `contact_number` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `nic` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_id_key`(`id`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eng_name` VARCHAR(191) NOT NULL,
    `sin_name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
