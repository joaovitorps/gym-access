import type { Gym } from "@/generated/prisma/client";
import type { GymsRepository } from "@/repositories/gyms-repository";

interface FetchNearbyGymsParams {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsReturn {
  gyms: Gym[];
}

export class FetchNearbyGyms {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsParams): Promise<FetchNearbyGymsReturn> {
    const gyms = await this.gymsRepository.fetchNearby({
      userLatitude,
      userLongitude,
    });

    return { gyms };
  }
}
