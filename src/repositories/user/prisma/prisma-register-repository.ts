import type { UserCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type { UserRegisterRepository } from "../user-register-repository";

export class PrismaRegisterRepository implements UserRegisterRepository {
  async existsByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: UserCreateInput) {
    return await prisma.user.create({ data });
  }
}
