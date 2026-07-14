import type { CheckIn } from "@/generated/prisma/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";

type FetchAllCheckInsHistoryParams = {
  page: number;
};

type FetchAllCheckInsHistoryReturn = {
  checkIns: CheckIn[];
};

export class FetchAllCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    page,
  }: FetchAllCheckInsHistoryParams): Promise<FetchAllCheckInsHistoryReturn> {
    const checkIns = await this.checkInsRepository.findMany(page);

    return { checkIns };
  }
}
