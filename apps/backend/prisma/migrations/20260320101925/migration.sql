/*
  Warnings:

  - You are about to drop the `BlogCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlogPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogCategoriesToBlogPosts` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `actionAddress` on table `Informations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actionLong` on table `Informations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actionLat` on table `Informations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actionRadius` on table `Informations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_BlogCategoriesToBlogPosts" DROP CONSTRAINT "_BlogCategoriesToBlogPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogCategoriesToBlogPosts" DROP CONSTRAINT "_BlogCategoriesToBlogPosts_B_fkey";

-- AlterTable
ALTER TABLE "Informations" ALTER COLUMN "actionAddress" SET NOT NULL,
ALTER COLUMN "actionAddress" SET DEFAULT 'Bordeaux',
ALTER COLUMN "actionLong" SET NOT NULL,
ALTER COLUMN "actionLong" SET DEFAULT -0.56667,
ALTER COLUMN "actionLat" SET NOT NULL,
ALTER COLUMN "actionLat" SET DEFAULT 44.833328,
ALTER COLUMN "actionRadius" SET NOT NULL,
ALTER COLUMN "actionRadius" SET DEFAULT 30;

-- DropTable
DROP TABLE "BlogCategories";

-- DropTable
DROP TABLE "BlogPosts";

-- DropTable
DROP TABLE "_BlogCategoriesToBlogPosts";
