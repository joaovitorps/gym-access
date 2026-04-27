import type { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserMetricsUseCase } from "@/use-cases/factories/make-fetch-user-metrics-use-case";

export const checkInMetrics = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const useCase = makeFetchUserMetricsUseCase();

  const { userTotalOfCheckIns } = await useCase.execute({
    userId: request.user.sub,
  });

  return reply.code(200).send({ userTotalOfCheckIns });
};
