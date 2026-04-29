import type { FastifyReply, FastifyRequest } from "fastify";
import z, { uuid } from "zod";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export const checkInRegister = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkInParamsSchema = z.object({
    gymId: uuid(),
  });

  const checkInBodySchema = z.object({
    latitude: z.coerce.number().refine((latitude) => {
      return Math.abs(latitude) <= 90;
    }),
    longitude: z.coerce.number().refine((longitude) => {
      return Math.abs(longitude) <= 180;
    }),
  });

  const { gymId } = checkInParamsSchema.parse(request.params);
  const { latitude, longitude } = checkInBodySchema.parse(request.body);

  const useCase = makeCheckInUseCase();

  await useCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.code(201).send();
};
