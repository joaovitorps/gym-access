import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeRegisterGymUseCase } from "@/use-cases/factories/make-register-gym-use-case";

export const gymRegister = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkBodySchema = z.object({
    title: z.string().min(3),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((latitude) => {
      return Math.abs(latitude) <= 90;
    }),
    longitude: z.number().refine((longitude) => {
      return Math.abs(longitude) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    checkBodySchema.parse(request.body);

  const gymRegisterUseCase = makeRegisterGymUseCase();

  await gymRegisterUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.code(201).send();
};
