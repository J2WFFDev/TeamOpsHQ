/*
  Warnings:

  - You are about to drop the `Athlete` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Program` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Program` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Program` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Team` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `programId` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `orgId` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MediaAttachment_itemId_idx";

-- DropIndex
DROP INDEX "Membership_userId_teamId_key";

-- DropIndex
DROP INDEX "Note_type_status_idx";

-- DropIndex
DROP INDEX "Note_athleteId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Athlete";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MediaAttachment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Membership";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Org" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timezone" TEXT
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER,
    "programId" INTEGER,
    "name" TEXT NOT NULL,
    CONSTRAINT "Squad_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserOrgRole" (
    "orgId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("orgId", "userId"),
    CONSTRAINT "UserOrgRole_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserOrgRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProgramRole" (
    "programId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("programId", "userId"),
    CONSTRAINT "UserProgramRole_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProgramRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserTeamRole" (
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("teamId", "userId"),
    CONSTRAINT "UserTeamRole_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserTeamRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSquadRole" (
    "squadId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("squadId", "userId"),
    CONSTRAINT "UserSquadRole_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSquadRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Element" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "status" TEXT,
    "priority" INTEGER,
    "quickRef" BOOLEAN NOT NULL DEFAULT false,
    "quickCode" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "listId" INTEGER,
    "parentId" INTEGER,
    "pinned" BOOLEAN,
    "detailsJson" JSONB NOT NULL,
    "startAt" DATETIME,
    "dueAt" DATETIME,
    "endAt" DATETIME,
    "goalDate" DATETIME,
    "locationName" TEXT,
    "currentRevisionId" INTEGER,
    "revNum" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Element_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "linkType" TEXT NOT NULL,
    CONSTRAINT "ElementLink_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ElementLink_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    CONSTRAINT "Tag_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementTag" (
    "elementId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("elementId", "tagId"),
    CONSTRAINT "ElementTag_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ElementTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "List" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "programId" INTEGER,
    "teamId" INTEGER,
    "name" TEXT NOT NULL,
    "listType" TEXT NOT NULL DEFAULT 'standard',
    "sortIdx" INTEGER,
    CONSTRAINT "List_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementList" (
    "elementId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,

    PRIMARY KEY ("elementId", "listId"),
    CONSTRAINT "ElementList_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ElementList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "elementId" INTEGER NOT NULL,
    "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unit" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "target" REAL,
    "note" TEXT,
    CONSTRAINT "ProgressLog_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressRollup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "elementId" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "current" REAL NOT NULL,
    "target" REAL,
    CONSTRAINT "ProgressRollup_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "elementId" INTEGER NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "locationName" TEXT,
    "recurrence" TEXT,
    "visibility" TEXT NOT NULL,
    CONSTRAINT "CalendarEvent_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calEventId" INTEGER NOT NULL,
    "userId" INTEGER,
    "contactId" INTEGER,
    "rsvp" TEXT,
    CONSTRAINT "EventAttendee_calEventId_fkey" FOREIGN KEY ("calEventId") REFERENCES "CalendarEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalendarResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventResource" (
    "calEventId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,

    PRIMARY KEY ("calEventId", "resourceId"),
    CONSTRAINT "EventResource_calEventId_fkey" FOREIGN KEY ("calEventId") REFERENCES "CalendarEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "CalendarResource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "actorUserId" INTEGER NOT NULL,
    "verb" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "objectId" INTEGER NOT NULL,
    "targetType" TEXT,
    "targetId" INTEGER,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,
    CONSTRAINT "FeedItem_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedReadState" (
    "feedId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "readAt" DATETIME,

    PRIMARY KEY ("feedId", "userId"),
    CONSTRAINT "FeedReadState_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "FeedItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeedReadState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    CONSTRAINT "Contact_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "geo" JSONB
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "elementId" INTEGER NOT NULL,
    "authorUserId" INTEGER NOT NULL,
    "bodyMd" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" INTEGER,
    CONSTRAINT "Comment_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "elementId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "urlOrPath" TEXT NOT NULL,
    CONSTRAINT "Attachment_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Objective" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "ownerUserId" INTEGER,
    "horizon" TEXT NOT NULL,
    CONSTRAINT "Objective_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeyResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "objectiveId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "target" REAL NOT NULL,
    "current" REAL,
    CONSTRAINT "KeyResult_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementObjectiveLink" (
    "elementId" INTEGER NOT NULL,
    "objectiveId" INTEGER NOT NULL,

    PRIMARY KEY ("elementId", "objectiveId"),
    CONSTRAINT "ElementObjectiveLink_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ElementObjectiveLink_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementRevision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "elementId" INTEGER NOT NULL,
    "revNum" INTEGER NOT NULL,
    "parentRevisionId" INTEGER,
    "changedBy" INTEGER NOT NULL,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeNote" TEXT,
    "branch" TEXT,
    "snapshot" JSONB NOT NULL,
    CONSTRAINT "ElementRevision_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementPatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "revisionId" INTEGER NOT NULL,
    "op" TEXT NOT NULL,
    "patchJson" JSONB NOT NULL,
    CONSTRAINT "ElementPatch_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "ElementRevision" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PromptSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "scope" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "promptSetId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "bodyMd" TEXT NOT NULL,
    CONSTRAINT "Prompt_promptSetId_fkey" FOREIGN KEY ("promptSetId") REFERENCES "PromptSet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgramPlanStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "programId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "descr" TEXT,
    CONSTRAINT "ProgramPlanStep_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Program" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "Program_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Program" ("id", "name") SELECT "id", "name" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "programId" INTEGER,
    "name" TEXT NOT NULL,
    "color" TEXT,
    CONSTRAINT "Team_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("id", "name", "programId") SELECT "id", "name", "programId" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "tz" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id") SELECT "createdAt", "email", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Org_slug_key" ON "Org"("slug");

-- CreateIndex
CREATE INDEX "ElementLink_parentId_idx" ON "ElementLink"("parentId");

-- CreateIndex
CREATE INDEX "ElementLink_childId_idx" ON "ElementLink"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressRollup_elementId_key" ON "ProgressRollup"("elementId");
