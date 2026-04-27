import dayjs from "dayjs";
import type { CheckIn } from "@/generated/prisma/client";
import type { CheckInUncheckedCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { MAX_ITEMS_PER_PAGE } from "@/utils/constants/paginate";
import type { CheckInsRepository } from "../check-ins-repository";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    return await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIn = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * MAX_ITEMS_PER_PAGE,
      take: MAX_ITEMS_PER_PAGE,
    });

    return checkIn;
  }

  async getUserTotalOfCheckIns(userId: string) {
    const checkIn = await prisma.checkIn.count({
      where: { user_id: userId },
    });

    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      data,
      where: { id: data.id },
    });

    return checkIn;
  }

  async create(data: CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }
}
