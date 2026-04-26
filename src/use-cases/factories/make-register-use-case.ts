import { PrismaUsersRepository } from "@/repositories/user/prisma/prisma-users-repository";
import { UserRegisterUseCase } from "../user/register";

export const makeRegisterUseCase = () => {
  const registerRepository = new PrismaUsersRepository();
  const registerUseCase = new UserRegisterUseCase(registerRepository);

  return registerUseCase;
};
