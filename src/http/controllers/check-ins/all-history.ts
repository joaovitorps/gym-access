import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeFetchAllCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-all-check-ins-history-use-case";

export const checkInAllHistory = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkInAllHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInAllHistoryQuerySchema.parse(request.query);

  const useCase = makeFetchAllCheckInsHistoryUseCase();

  const { checkIns } = await useCase.execute({
    page,
  });

  return reply.code(200).send({ checkIns });
};
