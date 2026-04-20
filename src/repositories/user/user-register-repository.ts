import type { User } from "@/generated/prisma/client";
import type {
  UserCreateInput,
  UserWhereUniqueInput,
} from "@/generated/prisma/models";

export interface UserRegisterRepository {
  exists: (uniqueProperty: UserWhereUniqueInput) => Promise<User | null>;
  create: (data: UserCreateInput) => Promise<User>;
}
