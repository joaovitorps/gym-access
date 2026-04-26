import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { RegisterGymUseCase } from "../register-gym";

export const makeRegisterGymUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const registerGymUseCase = new RegisterGymUseCase(gymsRepository);

  return registerGymUseCase;
};
