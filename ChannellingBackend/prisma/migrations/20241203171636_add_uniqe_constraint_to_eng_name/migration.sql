/*
  Warnings:

  - A unique constraint covering the columns `[eng_name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Category_eng_name_key` ON `Category`(`eng_name`);
