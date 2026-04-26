import dayjs from "dayjs";
import type { CheckIn } from "@/generated/prisma/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { TIME_LIMIT_FOR_VALIDATION_IN_MINUTES } from "@/utils/constants/validate";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type ValidateCheckInParams = {
  checkInId: string;
};

type ValidateCheckInReturn = {
  checkIn: CheckIn;
};

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInParams): Promise<ValidateCheckInReturn> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    // const did20MinutesAfterCheckInPassed = dayjs(checkIn.created_at)
    //   .add(20, "minutes")
    //   .isBefore(new Date());

    // if (did20MinutesAfterCheckInPassed) {
    //   throw new CheckInValidationExpiredError();
    // }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (
      distanceInMinutesFromCheckInCreation >=
      TIME_LIMIT_FOR_VALIDATION_IN_MINUTES
    ) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
