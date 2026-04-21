import { hash } from "bcryptjs";
import type { User } from "@/generated/prisma/client";
import type { UserRegisterRepository } from "@/repositories/user/user-register-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

interface UserRegisterParams {
  name: string;
  email: string;
  password: string;
}

interface UserRegisterReturn {
  user: User;
}

// SOLID
// D - Dependency Inversion principle

export class UserRegisterUseCase {
  constructor(private userRegisterRepository: UserRegisterRepository) {}

  async execute({
    name,
    email,
    password,
  }: UserRegisterParams): Promise<UserRegisterReturn> {
    const duplicatedEmail =
      await this.userRegisterRepository.existsByEmail(email);

    if (duplicatedEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.userRegisterRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
