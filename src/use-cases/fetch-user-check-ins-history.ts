import type { CheckIn } from "@/generated/prisma/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";

type FetchUserCheckInsHistoryParams = {
  userId: string;
  page: number;
};

type FetchUserCheckInsHistoryReturn = {
  checkIns: CheckIn[];
};

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryParams): Promise<FetchUserCheckInsHistoryReturn> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    return { checkIns };
  }
}
