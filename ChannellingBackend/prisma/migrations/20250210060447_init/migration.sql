/*
  Warnings:

  - Added the required column `patients` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patients` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sheets` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `availability` ADD COLUMN `patients` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `doctors` ADD COLUMN `birthday` DATETIME(3) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `patients` INTEGER NOT NULL,
    ADD COLUMN `sheets` LONGTEXT NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `profileImage` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleID` INTEGER NOT NULL,
    `patientId` INTEGER NULL,
    `mobileNo` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `fee` DOUBLE NULL,
    `age` INTEGER NOT NULL,
    `nic` VARCHAR(191) NOT NULL,
    `sheet_No` INTEGER NOT NULL,
    `timeSlot` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'unpaid',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Appointment_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_scheduleID_fkey` FOREIGN KEY (`scheduleID`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
