import { PrismaUsersRepository } from "@/repositories/user/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../auth/authenticate";

export const makeAuthenticateUseCase = () => {
  const registerRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(registerRepository);

  return authenticateUseCase;
};
