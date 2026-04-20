import { hash } from "bcryptjs";
import type { UserRegisterRepository } from "@/repositories/user/user-register-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

interface UserRegisterParams {
  name: string;
  email: string;
  password: string;
}

// SOLID
// D - Dependency Inversion principle

export class UserRegisterUseCase {
  constructor(private userRegisterRepository: UserRegisterRepository) {}

  async execute({ name, email, password }: UserRegisterParams) {
    const duplicatedEmail = await this.userRegisterRepository.exists({ email });

    if (duplicatedEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    await this.userRegisterRepository.create({ name, email, password_hash });
  }
}
