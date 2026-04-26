import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUserUseCase } from "../register-user";

export const makeRegisterUseCase = () => {
  const registerRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUserUseCase(registerRepository);

  return registerUseCase;
};
