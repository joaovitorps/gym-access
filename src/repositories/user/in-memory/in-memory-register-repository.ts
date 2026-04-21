import { v4 as uuidv4 } from "uuid";
import type { User } from "@/generated/prisma/client";
import type { UserCreateInput } from "@/generated/prisma/models";
import type { UserRegisterRepository } from "../user-register-repository";

export class InMemoryRegisterRepository implements UserRegisterRepository {
  private items: User[] = [];

  async existsByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: UserCreateInput) {
    const user: User = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
