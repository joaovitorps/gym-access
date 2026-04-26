import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserMetricsUseCase } from "../fetch-user-metrics";

export const makeFetchUserMetricsUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserMetricsUseCase = new FetchUserMetricsUseCase(
    checkInsRepository,
  );

  return fetchUserMetricsUseCase;
};
