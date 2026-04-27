import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export const gymSearch = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const requestQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = requestQuerySchema.parse(request.query);

  const useCase = makeSearchGymsUseCase();

  const { gyms } = await useCase.execute({
    query: q,
    page,
  });

  return reply.code(200).send({ gyms });
};
