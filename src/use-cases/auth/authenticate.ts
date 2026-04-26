import bcrypt from "bcryptjs";
import type { User } from "@/generated/prisma/client";
import type { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

interface AuthenticateParams {
  email: string;
  password: string;
}

interface AuthenticateReturn {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private userRegisterRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateParams): Promise<AuthenticateReturn> {
    const user = await this.userRegisterRepository.existsByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
