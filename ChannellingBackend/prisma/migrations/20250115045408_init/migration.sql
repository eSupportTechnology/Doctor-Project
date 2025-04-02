/*
  Warnings:

  - You are about to drop the column `available_date` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `week_day` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `date` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `schedule_doctor_id_fkey`;

-- DropIndex
DROP INDEX `schedule_id_key` ON `schedule`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `available_date`,
    DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `week_day`,
    ADD COLUMN `date` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
