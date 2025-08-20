/*
  Warnings:

  - Added the required column `updatedAt` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
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
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Backfill updatedAt for existing rows with the current timestamp
INSERT INTO "new_Note" ("athleteId", "createdAt", "id", "mediaPath", "text", "updatedAt") SELECT "athleteId", "createdAt", "id", "mediaPath", "text", CURRENT_TIMESTAMP FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
