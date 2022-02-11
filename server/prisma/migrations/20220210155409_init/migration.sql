/*
  Warnings:

  - Made the column `details` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activity` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    MODIFY `details` VARCHAR(512) NOT NULL DEFAULT '',
    MODIFY `avatar` VARCHAR(150) NOT NULL DEFAULT '/media/default-avatar.svg',
    MODIFY `activity` VARCHAR(25) NOT NULL DEFAULT 'Online';
