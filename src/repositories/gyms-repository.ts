import type { Gym } from "@/generated/prisma/client";
import type { GymCreateInput } from "@/generated/prisma/models";

export interface FetchNearbyParams {
  userLatitude: number;
  userLongitude: number;
}

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>;
  fetchNearby({
    userLatitude,
    userLongitude,
  }: FetchNearbyParams): Promise<Gym[]>;
  searchGyms(query: string, page: number): Promise<Gym[]>;
  create(data: GymCreateInput): Promise<Gym>;
}
