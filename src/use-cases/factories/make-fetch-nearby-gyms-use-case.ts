import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGyms } from "../fetch-nearby-gyms";

export const makeFetchNearbyGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGyms(gymsRepository);

  return fetchNearbyGymsUseCase;
};
