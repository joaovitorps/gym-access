-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'MEMBER';
