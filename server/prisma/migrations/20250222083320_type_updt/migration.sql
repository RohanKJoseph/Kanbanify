/*
  Warnings:

  - A unique constraint covering the columns `[projectId,name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Type_projectId_name_key" ON "Type"("projectId", "name");
