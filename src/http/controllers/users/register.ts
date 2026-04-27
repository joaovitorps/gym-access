import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export const userRegister = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkBodySchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = checkBodySchema.parse(request.body);

  try {
    const userRegisterUseCase = makeRegisterUseCase();

    await userRegisterUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.code(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.code(201).send();
};
