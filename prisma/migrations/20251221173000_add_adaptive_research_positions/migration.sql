-- CreateTable
CREATE TABLE "AdaptiveResearchPosition" (
    "id" TEXT NOT NULL,
    "attachedDepartment" TEXT,
    "postName" TEXT NOT NULL,
    "bpsScale" TEXT NOT NULL,
    "sanctionedPosts" INTEGER NOT NULL,
    "filledPosts" INTEGER NOT NULL,
    "vacantPosts" INTEGER NOT NULL,
    "promotionPosts" INTEGER NOT NULL,
    "initialRecruitmentPosts" INTEGER NOT NULL,
    "remarks" TEXT,
    "orderNumber" INTEGER,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdaptiveResearchPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdaptiveResearchPosition_departmentId_idx" ON "AdaptiveResearchPosition"("departmentId");

-- CreateIndex
CREATE INDEX "AdaptiveResearchPosition_orderNumber_idx" ON "AdaptiveResearchPosition"("orderNumber");

-- AddForeignKey
ALTER TABLE "AdaptiveResearchPosition" ADD CONSTRAINT "AdaptiveResearchPosition_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
