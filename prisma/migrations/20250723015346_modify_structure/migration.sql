/*
  Warnings:

  - You are about to drop the column `companyId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_companyId_fkey`;

-- DropIndex
DROP INDEX `User_companyId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `companyId`;

-- CreateTable
CREATE TABLE `UserOnCompany` (
    `userId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOnCompany` ADD CONSTRAINT `UserOnCompany_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOnCompany` ADD CONSTRAINT `UserOnCompany_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
