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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Note" ("assignedTo", "athleteId", "createdAt", "decisionOutcome", "decisionRationale", "dueDate", "id", "mediaPath", "status", "tags", "text", "type", "updatedAt") SELECT "assignedTo", "athleteId", "createdAt", "decisionOutcome", "decisionRationale", "dueDate", "id", "mediaPath", "status", "tags", "text", "type", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
