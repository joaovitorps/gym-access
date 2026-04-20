import type {
  UserCreateInput,
  UserWhereUniqueInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type { UserRegisterRepository } from "../user-register-repository";

export class PrismaRegisterRepository implements UserRegisterRepository {
  async exists(uniqueProperty: UserWhereUniqueInput) {
    return await prisma.user.findUnique({
      where: uniqueProperty,
    });
  }

  async create(data: UserCreateInput) {
    return await prisma.user.create({ data });
  }
}
