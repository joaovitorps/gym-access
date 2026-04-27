import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";

export const checkInValidate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkInValidateParamsSchema = z.object({
    checkInId: z.uuid(),
  });

  const { checkInId } = checkInValidateParamsSchema.parse(request.params);

  const useCase = makeValidateCheckInUseCase();

  const { checkIn } = await useCase.execute({
    checkInId,
  });

  return reply.code(204).send({ checkIn });
};
