/*
  Warnings:

  - A unique constraint covering the columns `[UserName]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Admin_UserName_key` ON `Admin`(`UserName`);
