-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_createdById_fkey";

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
