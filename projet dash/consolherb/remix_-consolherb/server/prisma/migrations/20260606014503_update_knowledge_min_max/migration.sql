/*
  Warnings:

  - You are about to drop the column `growthCycleDays` on the `crop_knowledge` table. All the data in the column will be lost.
  - You are about to drop the column `idealPh` on the `crop_knowledge` table. All the data in the column will be lost.
  - You are about to drop the column `soilType` on the `crop_knowledge` table. All the data in the column will be lost.
  - You are about to drop the column `waterRequirement` on the `crop_knowledge` table. All the data in the column will be lost.
  - Added the required column `idealPhMax` to the `crop_knowledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idealPhMin` to the `crop_knowledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idealTempMax` to the `crop_knowledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idealTempMin` to the `crop_knowledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterNeed` to the `crop_knowledge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "crop_knowledge" DROP COLUMN "growthCycleDays",
DROP COLUMN "idealPh",
DROP COLUMN "soilType",
DROP COLUMN "waterRequirement",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "idealPhMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "idealPhMin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "idealTempMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "idealTempMin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "waterNeed" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pest_knowledge" ADD COLUMN     "severity" TEXT NOT NULL DEFAULT 'Medium';
