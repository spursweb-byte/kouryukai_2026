-- CreateTable
CREATE TABLE "Registration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entryNo" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "salesName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deliveryEmail" TEXT NOT NULL,
    "resourceStatus" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_entryNo_key" ON "Registration"("entryNo");
