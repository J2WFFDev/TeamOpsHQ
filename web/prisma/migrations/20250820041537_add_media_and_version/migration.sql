-- CreateTable
CREATE TABLE "MediaAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT,
    "path" TEXT NOT NULL,
    "mime" TEXT,
    "size" INTEGER,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaderId" TEXT,
    CONSTRAINT "MediaAttachment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaPath" TEXT,
    "type" TEXT NOT NULL DEFAULT 'NOTE',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "tags" TEXT,
    "dueDate" DATETIME,
    "assignedTo" TEXT,
    "decisionRationale" TEXT,
    "decisionOutcome" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_Note" ("assignedTo", "athleteId", "createdAt", "decisionOutcome", "decisionRationale", "dueDate", "id", "mediaPath", "status", "tags", "text", "type", "updatedAt") SELECT "assignedTo", "athleteId", "createdAt", "decisionOutcome", "decisionRationale", "dueDate", "id", "mediaPath", "status", "tags", "text", "type", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE INDEX "Note_athleteId_idx" ON "Note"("athleteId");
CREATE INDEX "Note_type_status_idx" ON "Note"("type", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "MediaAttachment_itemId_idx" ON "MediaAttachment"("itemId");
