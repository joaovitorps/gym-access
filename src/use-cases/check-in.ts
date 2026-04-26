import type { CheckIn } from "@/generated/prisma/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/calculate-distance-between-coordinates";
import { MAX_CHECK_IN_DISTANCE_IN_KILOMETERS } from "@/utils/constants/distance";
import { MaxDistanceReachedError } from "./errors/max-distance-reached-error";
import { MaxNumberOfCheckInError } from "./errors/max-number-of-check-in-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInParams {
  gymId: string;
  userId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInReturn {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInParams): Promise<CheckInReturn> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distanceUserGym = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    if (distanceUserGym > MAX_CHECK_IN_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceReachedError();
    }

    const checkForAnotherUserCheckIn =
      await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (checkForAnotherUserCheckIn) {
      throw new MaxNumberOfCheckInError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
