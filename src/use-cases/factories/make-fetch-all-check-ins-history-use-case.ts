import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchAllCheckInsHistoryUseCase } from "../fetch-all-check-ins-history";

export const makeFetchAllCheckInsHistoryUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchAllCheckInsHistoryUseCase = new FetchAllCheckInsHistoryUseCase(
    checkInsRepository,
  );

  return fetchAllCheckInsHistoryUseCase;
};
