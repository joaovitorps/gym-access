import type { User } from "@/generated/prisma/client";
import type { UserCreateInput } from "@/generated/prisma/models";

export interface UserRegisterRepository {
  existsByEmail: (email: string) => Promise<User | null>;
  create: (data: UserCreateInput) => Promise<User>;
}
