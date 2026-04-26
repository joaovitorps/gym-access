import type { Gym } from "@/generated/prisma/client";
import type { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsUseCaseParams {
  query: string;
  page: number;
}

interface SearchGymsUseCaseReturn {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseParams): Promise<SearchGymsUseCaseReturn> {
    const gyms = await this.gymsRepository.searchGyms(query, page);

    return { gyms };
  }
}
