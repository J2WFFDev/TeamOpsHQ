-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "programId" TEXT,
    CONSTRAINT "Team_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");
