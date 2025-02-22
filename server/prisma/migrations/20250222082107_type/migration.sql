/*
  Warnings:

  - You are about to drop the column `type` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "type",
ADD COLUMN     "typeId" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "Type" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Type_projectId_idx" ON "Type"("projectId");

-- CreateIndex
CREATE INDEX "Card_typeId_idx" ON "Card"("typeId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Type" ADD CONSTRAINT "Type_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
