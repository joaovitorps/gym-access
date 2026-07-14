import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeFetchAllCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-all-check-ins-history-use-case";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export const checkInHistory = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  if (request.user.role === "ADMIN") {
    const useCase = makeFetchAllCheckInsHistoryUseCase();

    const { checkIns } = await useCase.execute({
      page,
    });

    return reply.code(200).send({ checkIns });
  }

  const useCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await useCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.code(200).send({ checkIns });
};
