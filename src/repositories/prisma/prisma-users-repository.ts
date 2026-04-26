import type { UserCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type { UsersRepository } from "../../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async existsById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async existsByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: UserCreateInput) {
    return await prisma.user.create({ data });
  }
}
