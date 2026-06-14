-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyProgram" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "stampThreshold" INTEGER NOT NULL,
    "rewardDescription" TEXT,

    CONSTRAINT "LoyaltyProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pass" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "customerIdentifier" TEXT NOT NULL,
    "applePushToken" TEXT,
    "deviceLibraryIdentifier" TEXT,
    "googleObjectId" TEXT,
    "stampCount" INTEGER NOT NULL DEFAULT 0,
    "pushNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastVisitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StampEvent" (
    "id" TEXT NOT NULL,
    "passId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "stampedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StampEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_slug_key" ON "Merchant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_apiKey_key" ON "Merchant"("apiKey");

-- CreateIndex
CREATE INDEX "Pass_lastVisitedAt_idx" ON "Pass"("lastVisitedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Pass_programId_customerIdentifier_key" ON "Pass"("programId", "customerIdentifier");

-- CreateIndex
CREATE INDEX "StampEvent_merchantId_stampedAt_idx" ON "StampEvent"("merchantId", "stampedAt");

-- AddForeignKey
ALTER TABLE "LoyaltyProgram" ADD CONSTRAINT "LoyaltyProgram_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_programId_fkey" FOREIGN KEY ("programId") REFERENCES "LoyaltyProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StampEvent" ADD CONSTRAINT "StampEvent_passId_fkey" FOREIGN KEY ("passId") REFERENCES "Pass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StampEvent" ADD CONSTRAINT "StampEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
