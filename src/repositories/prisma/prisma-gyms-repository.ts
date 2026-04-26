import type { GymCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { MAX_ITEMS_PER_PAGE } from "@/utils/constants/paginate";
import type { FetchNearbyParams, GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
  async findById(gymId: string) {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
    });

    return gym;
  }
  async fetchNearby({ userLatitude, userLongitude }: FetchNearbyParams) {
    throw new Error("Method not implemented.");
  }
  async searchGyms(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: { title: { contains: query } },
      skip: MAX_ITEMS_PER_PAGE,
      take: (page - 1) * MAX_ITEMS_PER_PAGE,
    });

    return gyms;
  }
  async create(data: GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }
}
