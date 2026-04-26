import { randomUUID } from "node:crypto";
import { type Gym, Prisma } from "@/generated/prisma/client";
import type { GymCreateInput } from "@/generated/prisma/models";
import { getDistanceBetweenCoordinates } from "@/utils/calculate-distance-between-coordinates";
import { MAX_DISTANCE_NEARBY_GYMS_IN_KILOMETERS } from "@/utils/constants/distance";
import { MAX_ITEMS_PER_PAGE } from "@/utils/constants/paginate";
import type { FetchNearbyParams, GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = [];

  async findById(gymId: string) {
    const gym = this.gyms.find((gym) => (gym.id = gymId));

    if (!gym) {
      return null;
    }

    return gym;
  }

  async searchGyms(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);
  }

  async fetchNearby({ userLatitude, userLongitude }: FetchNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: userLatitude, longitude: userLongitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      );

      return distance < MAX_DISTANCE_NEARBY_GYMS_IN_KILOMETERS;
    });
  }

  async create(data: GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }
}
