import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import type { CheckIn } from "@/generated/prisma/client";
import type { CheckInUncheckedCreateInput } from "@/generated/prisma/models";
import { MAX_ITEMS_PER_PAGE } from "@/utils/constants/paginate";
import type { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  checkIns: CheckIn[] = [];

  async findById(id: string) {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate = checkInDate.isSame(date, "date");

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const userCheckInsHistory = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    );

    return userCheckInsHistory.slice(
      (page - 1) * MAX_ITEMS_PER_PAGE,
      page * MAX_ITEMS_PER_PAGE,
    );
  }

  async getUserTotalOfCheckIns(userId: string) {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
  }

  async create(data: CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    );

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
