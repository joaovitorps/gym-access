import { type Gym, Prisma } from "@/generated/prisma/client";
import type { GymCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { MAX_DISTANCE_NEARBY_GYMS_IN_KILOMETERS } from "@/utils/constants/distance";
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
    const schema: { current_schema: string }[] =
      await prisma.$queryRaw`SELECT current_schema()`;

    if (!schema[0]) {
      throw new Error("Could not identify the schema.");
    }

    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * FROM ${Prisma.raw(`"${schema[0].current_schema}"."Gym"`)}
    WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= ${MAX_DISTANCE_NEARBY_GYMS_IN_KILOMETERS}`;

    return gyms;
  }

  async searchGyms(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: MAX_ITEMS_PER_PAGE,
      skip: (page - 1) * MAX_ITEMS_PER_PAGE,
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
