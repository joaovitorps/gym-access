import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export const gymNearby = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((latitude) => {
      return Math.abs(latitude) <= 90;
    }),
    longitude: z.coerce.number().refine((longitude) => {
      return Math.abs(longitude) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

  const useCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await useCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.code(200).send({ gyms });
};
