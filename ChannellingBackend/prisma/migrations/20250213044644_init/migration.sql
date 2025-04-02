-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `active` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `deleted_at` DATETIME(3) NULL;
