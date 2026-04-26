import { hash } from "bcryptjs";
import type { User } from "@/generated/prisma/client";
import type { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUserParams {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserReturn {
  user: User;
}

// SOLID
// D - Dependency Inversion principle

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserParams): Promise<RegisterUserReturn> {
    const duplicatedEmail = await this.usersRepository.existsByEmail(email);

    if (duplicatedEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
