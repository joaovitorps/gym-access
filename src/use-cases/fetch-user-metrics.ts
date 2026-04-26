import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserMetricsUseCaseParams {
  userId: string;
}

interface FetchUserMetricsUseCaseReturn {
  userTotalOfCheckIns: number;
}

export class FetchUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}
  async execute({
    userId,
  }: FetchUserMetricsUseCaseParams): Promise<FetchUserMetricsUseCaseReturn> {
    const userTotalOfCheckIns =
      await this.checkInsRepository.getUserTotalOfCheckIns(userId);

    return { userTotalOfCheckIns };
  }
}
